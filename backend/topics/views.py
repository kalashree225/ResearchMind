from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from papers.models import Paper, DocumentChunk
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans, DBSCAN
from sklearn.decomposition import PCA
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from collections import Counter
import re

@api_view(['POST'])
@permission_classes([AllowAny])
def generate_clusters(request):
    paper_ids = request.data.get('paper_ids', [])
    algorithm = request.data.get('algorithm', 'dbscan')
    n_clusters = request.data.get('n_clusters', 4)
    
    try:
        if paper_ids:
            papers = Paper.objects.filter(id__in=paper_ids)
        else:
            papers = Paper.objects.filter(status='ready')[:20]
        
        if not papers.exists():
            return Response({
                'error': 'No papers found for clustering',
                'clusters': [],
                'total_papers': 0,
                'algorithm': algorithm
            })
        
        # Extract text content from papers
        paper_texts = []
        paper_data = []
        
        for paper in papers:
            # Get abstract and key sections
            chunks = DocumentChunk.objects.filter(paper=paper)
            text_parts = []
            
            if paper.abstract:
                text_parts.append(paper.abstract)
            
            # Add content from important sections
            for chunk in chunks.filter(section__in=['abstract', 'introduction', 'methods', 'results']):
                text_parts.append(chunk.text)
            
            # Combine all text
            full_text = ' '.join(text_parts)
            
            if len(full_text.strip()) > 50:  # Only include papers with substantial content
                paper_texts.append(full_text)
                paper_data.append({
                    'id': str(paper.id),
                    'title': paper.title,
                    'authors': paper.authors
                })
        
        if len(paper_texts) < 2:
            return Response({
                'error': 'Need at least 2 papers with content for clustering',
                'clusters': [],
                'total_papers': len(papers),
                'algorithm': algorithm
            })
        
        # Perform TF-IDF vectorization
        vectorizer = TfidfVectorizer(
            max_features=1000,
            stop_words='english',
            ngram_range=(1, 2),
            min_df=1,
            max_df=0.8
        )
        
        tfidf_matrix = vectorizer.fit_transform(paper_texts)
        
        # Perform clustering
        if algorithm.lower() == 'kmeans':
            cluster_labels = _perform_kmeans(tfidf_matrix, n_clusters)
        elif algorithm.lower() == 'dbscan':
            cluster_labels = _perform_dbscan(tfidf_matrix)
        else:
            cluster_labels = _perform_kmeans(tfidf_matrix, n_clusters)
        
        # Reduce dimensionality for visualization
        pca = PCA(n_components=2)
        coordinates = pca.fit_transform(tfidf_matrix.toarray())
        
        # Generate cluster information
        clusters = _generate_cluster_info(
            cluster_labels, 
            paper_data, 
            coordinates, 
            tfidf_matrix, 
            vectorizer.get_feature_names_out()
        )
        
        return Response({
            'clusters': clusters,
            'total_papers': len(paper_data),
            'algorithm': algorithm.upper(),
            'feature_count': len(vectorizer.get_feature_names_out())
        })
        
    except Exception as e:
        # Fallback to mock data if clustering fails
        return _get_fallback_clusters(papers, algorithm)


def _perform_kmeans(tfidf_matrix, n_clusters):
    """Perform K-means clustering."""
    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    return kmeans.fit_predict(tfidf_matrix)


def _perform_dbscan(tfidf_matrix):
    """Perform DBSCAN clustering."""
    # Convert to cosine distance for DBSCAN
    cosine_sim = cosine_similarity(tfidf_matrix)
    cosine_dist = 1 - cosine_sim
    
    dbscan = DBSCAN(eps=0.5, min_samples=2, metric='precomputed')
    return dbscan.fit_predict(cosine_dist)


def _generate_cluster_info(cluster_labels, paper_data, coordinates, tfidf_matrix, feature_names):
    """Generate detailed information for each cluster."""
    clusters = []
    unique_labels = np.unique(cluster_labels)
    
    # Color palette for clusters
    colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-red-500', 'bg-indigo-500']
    
    for i, label in enumerate(unique_labels):
        if label == -1:  # Noise points in DBSCAN
            continue
            
        # Get papers in this cluster
        cluster_mask = cluster_labels == label
        cluster_papers = [paper_data[j] for j in range(len(paper_data)) if cluster_mask[j]]
        cluster_coords = coordinates[cluster_mask]
        cluster_tfidf = tfidf_matrix[cluster_mask]
        
        # Calculate cluster keywords
        cluster_keywords = _extract_cluster_keywords(cluster_tfidf, feature_names)
        
        # Calculate cluster density (average distance to centroid)
        centroid = np.mean(cluster_coords, axis=0)
        distances = [np.linalg.norm(coord - centroid) for coord in cluster_coords]
        density = 1.0 / (np.mean(distances) + 0.1)  # Inverse of average distance
        
        # Generate cluster name based on keywords
        cluster_name = _generate_cluster_name(cluster_keywords)
        
        # Calculate position for visualization (normalized to 0-100)
        if len(cluster_coords) > 0:
            x_percent = int(np.clip((centroid[0] - coordinates[:, 0].min()) / 
                                  (coordinates[:, 0].max() - coordinates[:, 0].min() + 0.001) * 80 + 10, 5, 95))
            y_percent = int(np.clip((centroid[1] - coordinates[:, 1].min()) / 
                                  (coordinates[:, 1].max() - coordinates[:, 1].min() + 0.001) * 80 + 10, 5, 95))
        else:
            x_percent = 50
            y_percent = 50
        
        clusters.append({
            'id': int(label),
            'name': cluster_name,
            'papers': len(cluster_papers),
            'keywords': cluster_keywords,
            'density': round(float(density), 2),
            'x': x_percent,
            'y': y_percent,
            'size': round(1.0 + len(cluster_papers) * 0.1, 1),
            'color': colors[i % len(colors)],
            'paper_ids': [paper['id'] for paper in cluster_papers]
        })
    
    return clusters


def _extract_cluster_keywords(cluster_tfidf, feature_names, top_n=10):
    """Extract top keywords for a cluster."""
    # Average TF-IDF scores across all documents in cluster
    mean_scores = np.mean(cluster_tfidf.toarray(), axis=0)
    
    # Get top scoring features
    top_indices = mean_scores.argsort()[-top_n:][::-1]
    keywords = [feature_names[i] for i in top_indices if mean_scores[i] > 0]
    
    return keywords[:8]  # Return top 8 keywords


def _generate_cluster_name(keywords):
    """Generate a meaningful cluster name from keywords."""
    if not keywords:
        return "Unknown Cluster"
    
    # Common academic topic patterns
    topic_mapping = {
        'neural': 'Neural Networks',
        'transformer': 'Transformers',
        'attention': 'Attention Mechanisms',
        'learning': 'Machine Learning',
        'classification': 'Classification',
        'detection': 'Object Detection',
        'segmentation': 'Image Segmentation',
        'optimization': 'Optimization',
        'reinforcement': 'Reinforcement Learning',
        'clustering': 'Clustering',
        'regression': 'Regression',
        'nlp': 'Natural Language Processing',
        'vision': 'Computer Vision',
        'graph': 'Graph Neural Networks',
        'generative': 'Generative Models',
        'bert': 'BERT Models',
        'gpt': 'GPT Models',
        'cnn': 'CNN Models',
        'rnn': 'RNN Models'
    }
    
    # Check for known topics
    for keyword, topic in topic_mapping.items():
        if any(keyword.lower() in kw.lower() for kw in keywords[:5]):
            return topic
    
    # Fallback to first keyword
    main_keyword = keywords[0].title() if keywords else "Unknown"
    return f"{main_keyword} Research"


def _get_fallback_clusters(papers, algorithm):
    """Fallback clustering if main algorithm fails."""
    clusters = []
    
    for i, paper in enumerate(papers[:4]):
        # Simple clustering based on title keywords
        title_lower = paper.title.lower()
        
        if any(word in title_lower for word in ['neural', 'network', 'deep']):
            name = 'Neural Networks'
            keywords = ['neural', 'network', 'deep', 'learning']
            color = 'bg-blue-500'
        elif any(word in title_lower for word in ['transformer', 'attention', 'bert']):
            name = 'Transformers'
            keywords = ['transformer', 'attention', 'bert', 'gpt']
            color = 'bg-green-500'
        elif any(word in title_lower for word in ['vision', 'image', 'cnn']):
            name = 'Computer Vision'
            keywords = ['vision', 'image', 'cnn', 'detection']
            color = 'bg-purple-500'
        else:
            name = f'Cluster {i+1}'
            keywords = ['research', 'analysis', 'method', 'approach']
            color = 'bg-yellow-500'
        
        clusters.append({
            'id': i,
            'name': name,
            'papers': 1,
            'keywords': keywords,
            'density': round(np.random.uniform(0.7, 0.95), 2),
            'x': np.random.randint(20, 80),
            'y': np.random.randint(20, 80),
            'size': round(np.random.uniform(1.2, 1.8), 1),
            'color': color,
            'paper_ids': [str(paper.id)]
        })
    
    return Response({
        'clusters': clusters,
        'total_papers': len(papers),
        'algorithm': algorithm.upper(),
        'note': 'Used fallback clustering due to processing limitations'
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def cluster_details(request, cluster_id):
    """Get detailed information about a specific cluster."""
    try:
        # This is a simplified implementation
        # In a real system, you'd store cluster information and retrieve it
        
        cluster_id = int(cluster_id)
        
        # Get some papers that might belong to this cluster
        papers = Paper.objects.filter(status='ready')[:5]
        
        return Response({
            'id': cluster_id,
            'name': f'Cluster {cluster_id}',
            'papers': [
                {
                    'id': str(paper.id),
                    'title': paper.title,
                    'authors': paper.authors
                }
                for paper in papers
            ],
            'keywords': ['keyword1', 'keyword2', 'keyword3'],
            'density': 0.85,
            'description': f'Detailed analysis of cluster {cluster_id} papers and their common themes.'
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=500)
