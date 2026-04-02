from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.db import models
from papers.models import Paper, Citation, DocumentChunk
from papers.sync_tasks import extract_citations_sync
import re
from collections import defaultdict

@api_view(['GET'])
@permission_classes([AllowAny])
def citation_graph(request):
    paper_ids = request.GET.get('paper_ids', '').split(',') if request.GET.get('paper_ids') else []
    
    if paper_ids:
        papers = Paper.objects.filter(id__in=paper_ids)
    else:
        papers = Paper.objects.all()[:10]
    
    # Build nodes
    nodes = []
    for paper in papers:
        # Count citations for this paper
        citation_count = Citation.objects.filter(citing_paper=paper).count()
        
        nodes.append({
            'id': str(paper.id),
            'title': paper.title,
            'authors': paper.authors,
            'year': paper.uploaded_at.year,
            'citation_count': citation_count,
            'status': paper.status
        })
    
    # Build edges from actual citation relationships
    edges = []
    citation_relationships = defaultdict(int)
    
    for paper in papers:
        citations = Citation.objects.filter(citing_paper=paper)
        
        for citation in citations:
            # Check if cited paper is in our dataset
            if citation.cited_paper and citation.cited_paper in papers:
                source = str(paper.id)
                target = str(citation.cited_paper.id)
                citation_relationships[(source, target)] += 1
    
    # Convert relationships to edges
    for (source, target), weight in citation_relationships.items():
        edges.append({
            'source': source,
            'target': target,
            'weight': weight,
            'type': 'citation'
        })
    
    # Add some co-citation relationships (papers citing the same sources)
    for i, paper1 in enumerate(papers):
        for paper2 in papers[i+1:]:
            if paper1 != paper2:
                # Find common cited papers
                citations1 = set(Citation.objects.filter(citing_paper=paper1).values_list('cited_paper', flat=True))
                citations2 = set(Citation.objects.filter(citing_paper=paper2).values_list('cited_paper', flat=True))
                
                common_citations = citations1.intersection(citations2)
                if len(common_citations) > 0:
                    edges.append({
                        'source': str(paper1.id),
                        'target': str(paper2.id),
                        'weight': len(common_citations),
                        'type': 'co-citation'
                    })
    
    return Response({
        'nodes': nodes,
        'edges': edges,
        'metrics': {
            'total_papers': len(nodes),
            'total_citations': len([e for e in edges if e['type'] == 'citation']),
            'total_co_citations': len([e for e in edges if e['type'] == 'co-citation']),
            'avg_citations': len(edges) / len(nodes) if nodes else 0
        }
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def paper_citations(request, paper_id):
    try:
        paper = Paper.objects.get(id=paper_id)
        citations = Citation.objects.filter(citing_paper=paper).order_by('-confidence_score')
        
        citation_data = []
        for citation in citations:
            citation_info = {
                'cited_title': citation.cited_title,
                'context': citation.context,
                'doi': citation.doi,
                'arxiv_id': citation.arxiv_id,
                'confidence_score': citation.confidence_score,
                'extraction_method': citation.extraction_method
            }
            
            # Add cited paper info if available
            if citation.cited_paper:
                citation_info['cited_paper'] = {
                    'id': str(citation.cited_paper.id),
                    'title': citation.cited_paper.title,
                    'authors': citation.cited_paper.authors
                }
            
            citation_data.append(citation_info)
        
        return Response({
            'paper_id': str(paper.id),
            'paper_title': paper.title,
            'citations': citation_data,
            'total_citations': len(citation_data)
        })
    except Paper.DoesNotExist:
        return Response({'error': 'Paper not found'}, status=404)


@api_view(['POST'])
@permission_classes([AllowAny])
def extract_citations(request):
    """Extract citations from papers."""
    try:
        paper_ids = request.data.get('paper_ids', [])
        
        if not paper_ids:
            return Response({'error': 'No paper IDs provided'}, status=400)
        
        results = []
        for paper_id in paper_ids:
            try:
                # Trigger background citation extraction
                task_result = extract_citations_task.delay(paper_id)
                results.append({
                    'paper_id': paper_id,
                    'task_id': task_result.id,
                    'status': 'started'
                })
            except Exception as e:
                results.append({
                    'paper_id': paper_id,
                    'status': 'failed',
                    'error': str(e)
                })
        
        return Response({
            'message': 'Citation extraction started',
            'results': results
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['GET'])
@permission_classes([AllowAny])
def citation_statistics(request):
    """Get citation statistics."""
    try:
        total_papers = Paper.objects.count()
        total_citations = Citation.objects.count()
        
        # Top cited papers
        top_cited = []
        for paper in Paper.objects.all()[:10]:
            citation_count = Citation.objects.filter(citing_paper=paper).count()
            if citation_count > 0:
                top_cited.append({
                    'paper_id': str(paper.id),
                    'title': paper.title,
                    'citation_count': citation_count
                })
        
        top_cited.sort(key=lambda x: x['citation_count'], reverse=True)
        
        # Citation extraction methods
        extraction_methods = Citation.objects.values('extraction_method').annotate(
            count=models.Count('extraction_method')
        )
        
        return Response({
            'total_papers': total_papers,
            'total_citations': total_citations,
            'avg_citations_per_paper': total_citations / total_papers if total_papers > 0 else 0,
            'top_cited_papers': top_cited[:5],
            'extraction_methods': list(extraction_methods)
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=500)
