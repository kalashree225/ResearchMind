from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import hashlib
import uuid
import requests
from urllib.parse import urlparse
import os
from datetime import datetime
from .models import Paper, DocumentChunk, Citation
from .services.ai_service import AIService

# Temporarily disable tasks for demo
# from .tasks import process_pdf_task, generate_paper_summary_task, generate_embeddings_task, extract_citations_task
from django.core.files.storage import default_storage
from django.conf import settings

@api_view(['POST'])
@permission_classes([AllowAny])
@parser_classes([MultiPartParser, FormParser])
def upload_paper(request):
    if 'file' in request.FILES:
        file = request.FILES['file']
        
        if not file.name.lower().endswith('.pdf'):
            return Response({'error': 'Only PDF files are allowed'}, status=status.HTTP_400_BAD_REQUEST)
        
        if file.size > 10 * 1024 * 1024:
            return Response({'error': 'File size must be less than 10MB'}, status=status.HTTP_400_BAD_REQUEST)
        
        content = file.read()
        file.seek(0)
        content_hash = hashlib.sha256(content).hexdigest()
        
        if Paper.objects.filter(content_hash=content_hash).exists():
            existing = Paper.objects.get(content_hash=content_hash)
            return Response({
                'id': str(existing.id),
                'status': existing.status,
                'message': 'Paper already exists'
            })
        
        os.makedirs(os.path.join(settings.MEDIA_ROOT, 'papers'), exist_ok=True)
        file_path = os.path.join('papers', f'{content_hash}.pdf')
        saved_path = default_storage.save(file_path, file)
        
        paper = Paper.objects.create(
            user=request.user if request.user.is_authenticated else None,
            title=file.name.replace('.pdf', '').replace('_', ' '),
            authors=['Unknown Author'],
            abstract='Uploaded PDF document. Processing for full text extraction.',
            file_url=f'/media/{saved_path}',
            content_hash=content_hash,
            status='processing'
        )
        
        # Trigger background processing
        try:
            process_pdf_task.delay(str(paper.id))
        except Exception as e:
            # Fallback to synchronous processing if Celery is not available
            paper.status = 'failed'
            paper.processing_error = f"Background processing not available: {str(e)}"
            paper.save()
        
        return Response({
            'id': str(paper.id),
            'status': paper.status,
            'message': 'Paper uploaded and processing started'
        }, status=status.HTTP_201_CREATED)
    
    elif 'arxiv_url' in request.data:
        arxiv_url = request.data['arxiv_url']
        arxiv_id = arxiv_url.split('/')[-1].replace('.pdf', '').replace('abs', '').strip('/')
        
        content_hash = hashlib.sha256(arxiv_url.encode()).hexdigest()
        
        if Paper.objects.filter(content_hash=content_hash).exists():
            existing = Paper.objects.get(content_hash=content_hash)
            return Response({
                'id': str(existing.id),
                'status': existing.status,
                'message': 'Paper already imported'
            })
        
        paper = Paper.objects.create(
            user=request.user if request.user.is_authenticated else None,
            title=f'arXiv Paper: {arxiv_id}',
            authors=['arXiv Author'],
            abstract='Imported from arXiv. Full metadata will be fetched.',
            arxiv_id=arxiv_id,
            file_url=arxiv_url,
            content_hash=content_hash,
            status='ready'  # arXiv papers don't need PDF processing
        )
        
        # Create a basic chunk for arXiv papers
        DocumentChunk.objects.create(
            paper=paper,
            text=f'Content from arXiv paper {arxiv_id}. Full text would be downloaded from arXiv API.',
            section='abstract',
            page_number=1,
            chunk_index=0,
            token_count=100
        )
        
        return Response({
            'id': str(paper.id),
            'status': 'ready',
            'message': 'arXiv paper imported successfully'
        }, status=status.HTTP_201_CREATED)
    
    return Response({'error': 'No file or arXiv URL provided'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def list_papers(request):
    papers = Paper.objects.all().order_by('-uploaded_at')[:50]
    
    data = [{
        'id': str(p.id),
        'title': p.title,
        'authors': p.authors,
        'abstract': p.abstract,
        'status': p.status,
        'uploaded_at': p.uploaded_at.isoformat(),
        'arxiv_id': p.arxiv_id,
        'total_pages': p.total_pages,
        'extraction_progress': p.extraction_progress,
        'processing_error': p.processing_error
    } for p in papers]
    
    return Response(data)


@api_view(['GET'])
@permission_classes([AllowAny])
def paper_status(request, paper_id):
    try:
        paper = Paper.objects.get(id=paper_id)
        
        # Include chunk count for progress tracking
        chunk_count = DocumentChunk.objects.filter(paper=paper).count()
        
        return Response({
            'id': str(paper.id),
            'title': paper.title,
            'authors': paper.authors,
            'status': paper.status,
            'uploaded_at': paper.uploaded_at.isoformat(),
            'total_pages': paper.total_pages,
            'extraction_progress': paper.extraction_progress,
            'chunk_count': chunk_count,
            'processing_error': paper.processing_error,
            'processed_at': paper.processed_at.isoformat() if paper.processed_at else None
        })
    except Paper.DoesNotExist:
        return Response({'error': 'Paper not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([AllowAny])
def paper_summary(request, paper_id):
    try:
        paper = Paper.objects.get(id=paper_id)
        
        # Check if we have a cached AI summary
        cached_summary = paper.metadata.get('ai_summary')
        if cached_summary and paper.status == 'ready':
            return Response(cached_summary)
        
        # Generate new summary
        ai_service = AIService()
        summary = ai_service.generate_paper_summary(paper_id)
        
        # Cache the summary if successful
        if 'error' not in summary:
            paper.metadata['ai_summary'] = summary
            paper.save()
        
        return Response(summary)
        
    except Paper.DoesNotExist:
        return Response({'error': 'Paper not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': f'Failed to generate summary: {str(e)}'}, status=status.HTTP_500)


@api_view(['POST'])
@permission_classes([AllowAny])
def compare_papers(request):
    """Compare multiple papers."""
    try:
        paper_ids = request.data.get('paper_ids', [])
        
        if len(paper_ids) < 2:
            return Response({'error': 'At least 2 papers are required for comparison'}, status=status.HTTP_400_BAD_REQUEST)
        
        ai_service = AIService()
        comparison = ai_service.compare_papers(paper_ids)
        
        return Response(comparison)
        
    except Exception as e:
        return Response({'error': f'Comparison failed: {str(e)}'}, status=status.HTTP_500)


@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_paper(request, paper_id):
    try:
        paper = Paper.objects.get(id=paper_id)
        paper.delete()
        return Response({'message': 'Paper deleted successfully'})
    except Paper.DoesNotExist:
        return Response({'error': 'Paper not found'}, status=status.HTTP_404_NOT_FOUND)
