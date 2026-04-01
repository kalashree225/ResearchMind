from celery import shared_task
from django.utils import timezone
from .models import Paper, DocumentChunk
from .services.pdf_processor import PDFProcessor
from .services.ai_service import AIService


@shared_task(bind=True, max_retries=3)
def process_pdf_task(self, paper_id: str):
    """Background task to process PDF and create chunks."""
    try:
        paper = Paper.objects.get(id=paper_id)
        
        # Update status
        paper.status = 'processing'
        paper.save()
        
        # Process PDF
        processor = PDFProcessor()
        success = processor.process_pdf(paper)
        
        if success:
            # Generate embeddings if OpenAI API key is available
            try:
                generate_embeddings_task.delay(paper_id)
            except Exception as e:
                print(f"Could not start embedding generation: {e}")
            
            return {'status': 'success', 'paper_id': paper_id}
        else:
            return {'status': 'failed', 'paper_id': paper_id, 'error': paper.processing_error}
            
    except Exception as exc:
        # Retry logic
        if self.request.retries < self.max_retries:
            # Update status to show retry
            try:
                paper = Paper.objects.get(id=paper_id)
                paper.processing_error = f"Processing failed, retrying... (Attempt {self.request.retries + 1})"
                paper.save()
            except:
                pass
            
            raise self.retry(countdown=60 * (2 ** self.request.retries))
        
        # Final failure
        try:
            paper = Paper.objects.get(id=paper_id)
            paper.status = 'failed'
            paper.processing_error = str(exc)
            paper.save()
        except:
            pass
        
        return {'status': 'failed', 'paper_id': paper_id, 'error': str(exc)}


@shared_task(bind=True, max_retries=3)
def generate_embeddings_task(self, paper_id: str):
    """Generate embeddings for document chunks."""
    try:
        paper = Paper.objects.get(id=paper_id)
        
        # Update status
        paper.status = 'embedding'
        paper.save()
        
        # Get chunks
        chunks = DocumentChunk.objects.filter(paper=paper).order_by('chunk_index')
        
        if not chunks.exists():
            return {'status': 'no_chunks', 'paper_id': paper_id}
        
        # Generate embeddings
        ai_service = AIService()
        
        # Process in batches to avoid rate limits
        batch_size = 100
        total_chunks = chunks.count()
        processed = 0
        
        for i in range(0, total_chunks, batch_size):
            batch_chunks = chunks[i:i + batch_size]
            texts = [chunk.text for chunk in batch_chunks]
            
            # Generate embeddings
            embeddings = ai_service.generate_embeddings(texts)
            
            # Update chunks with embeddings
            for chunk, embedding in zip(batch_chunks, embeddings):
                if embedding:
                    chunk.embedding = embedding
                    chunk.save()
            
            processed += len(batch_chunks)
            
            # Update progress
            progress = int((processed / total_chunks) * 100)
            paper.extraction_progress = progress
            paper.save()
        
        # Update final status
        paper.status = 'ready'
        paper.processed_at = timezone.now()
        paper.extraction_progress = 100
        paper.save()
        
        return {'status': 'success', 'paper_id': paper_id, 'chunks_processed': total_chunks}
        
    except Exception as exc:
        # Retry logic
        if self.request.retries < self.max_retries:
            raise self.retry(countdown=60 * (2 ** self.request.retries))
        
        # Final failure
        try:
            paper = Paper.objects.get(id=paper_id)
            paper.status = 'failed'
            paper.processing_error = f"Embedding generation failed: {str(exc)}"
            paper.save()
        except:
            pass
        
        return {'status': 'failed', 'paper_id': paper_id, 'error': str(exc)}


@shared_task
def extract_citations_task(paper_id: str):
    """Extract citations from a processed paper."""
    try:
        paper = Paper.objects.get(id=paper_id)
        
        # Get all chunks, focusing on references section
        chunks = DocumentChunk.objects.filter(paper=paper, section='references')
        
        if not chunks.exists():
            # Try to find references in other sections
            chunks = DocumentChunk.objects.filter(paper=paper)
        
        citations_found = 0
        
        for chunk in chunks:
            citations = _extract_citations_from_text(chunk.text, paper)
            citations_found += len(citations)
        
        return {'status': 'success', 'paper_id': paper_id, 'citations_found': citations_found}
        
    except Exception as e:
        return {'status': 'failed', 'paper_id': paper_id, 'error': str(e)}


@shared_task
def generate_paper_summary_task(paper_id: str):
    """Generate AI summary for a paper."""
    try:
        paper = Paper.objects.get(id=paper_id)
        
        ai_service = AIService()
        summary = ai_service.generate_paper_summary(paper_id)
        
        # Store summary in paper metadata
        if 'error' not in summary:
            paper.metadata['ai_summary'] = summary
            paper.save()
        
        return {'status': 'success', 'paper_id': paper_id}
        
    except Exception as e:
        return {'status': 'failed', 'paper_id': paper_id, 'error': str(e)}


def _extract_citations_from_text(text: str, paper: Paper):
    """Extract citations from text using regex patterns."""
    import re
    from .models import Citation
    
    citations = []
    
    # DOI pattern
    doi_pattern = r'(?:doi:|DOI:)\s*(10\.\d+/[^\s]+)'
    doi_matches = re.findall(doi_pattern, text, re.IGNORECASE)
    
    for doi in doi_matches:
        citation, created = Citation.objects.get_or_create(
            citing_paper=paper,
            cited_title=f"DOI: {doi}",
            defaults={
                'doi': doi,
                'extraction_method': 'regex_doi',
                'confidence_score': 0.9
            }
        )
        if created:
            citations.append(citation)
    
    # arXiv pattern
    arxiv_pattern = r'arXiv:(\d+\.\d+)'
    arxiv_matches = re.findall(arxiv_pattern, text)
    
    for arxiv_id in arxiv_matches:
        citation, created = Citation.objects.get_or_create(
            citing_paper=paper,
            cited_title=f"arXiv:{arxiv_id}",
            defaults={
                'arxiv_id': arxiv_id,
                'extraction_method': 'regex_arxiv',
                'confidence_score': 0.9
            }
        )
        if created:
            citations.append(citation)
    
    # Simple title pattern (very basic)
    # This is a placeholder - real citation extraction is much more complex
    title_pattern = r'\[([^\]]+)\]'
    title_matches = re.findall(title_pattern, text)
    
    for title in title_matches[:5]:  # Limit to avoid false positives
        if len(title) > 10 and len(title) < 200:  # Reasonable title length
            citation, created = Citation.objects.get_or_create(
                citing_paper=paper,
                cited_title=title,
                defaults={
                    'extraction_method': 'regex_title',
                    'confidence_score': 0.3
                }
            )
            if created:
                citations.append(citation)
    
    return citations
