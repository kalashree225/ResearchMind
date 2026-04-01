from django.db import models
from django.contrib.auth import get_user_model
import hashlib

User = get_user_model()

class Paper(models.Model):
    STATUS_CHOICES = [
        ('uploading', 'Uploading'),
        ('processing', 'Processing'),
        ('extracting', 'Extracting Text'),
        ('chunking', 'Creating Chunks'),
        ('embedding', 'Generating Embeddings'),
        ('ready', 'Ready'),
        ('failed', 'Failed'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='papers', null=True, blank=True)
    title = models.CharField(max_length=500)
    authors = models.JSONField(default=list)
    abstract = models.TextField(blank=True, null=True)
    file_url = models.URLField(max_length=500, blank=True, null=True)
    arxiv_id = models.CharField(max_length=50, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='uploading')
    content_hash = models.CharField(max_length=64, unique=True, db_index=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(blank=True, null=True)
    metadata = models.JSONField(default=dict, blank=True)
    
    # Processing tracking
    processing_error = models.TextField(blank=True, null=True)
    extraction_progress = models.IntegerField(default=0)
    total_pages = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'papers'
        ordering = ['-uploaded_at']
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['content_hash']),
            models.Index(fields=['arxiv_id']),
        ]
    
    def __str__(self):
        return self.title
    
    @staticmethod
    def generate_content_hash(content):
        return hashlib.sha256(content.encode()).hexdigest()


class DocumentChunk(models.Model):
    SECTION_CHOICES = [
        ('abstract', 'Abstract'),
        ('introduction', 'Introduction'),
        ('methods', 'Methods'),
        ('results', 'Results'),
        ('discussion', 'Discussion'),
        ('conclusion', 'Conclusion'),
        ('references', 'References'),
        ('other', 'Other'),
    ]
    
    paper = models.ForeignKey(Paper, on_delete=models.CASCADE, related_name='chunks')
    text = models.TextField()
    # Vector field for embeddings (commented out for SQLite, uncomment for PostgreSQL with pgvector)
    # embedding = VectorField(dimensions=1536, null=True, blank=True)
    embedding = models.JSONField(null=True, blank=True)  # Temporary storage for embeddings
    section = models.CharField(max_length=50, choices=SECTION_CHOICES, default='other')
    page_number = models.IntegerField(default=0)
    token_count = models.IntegerField(default=0)
    chunk_index = models.IntegerField(default=0)
    
    # Additional metadata
    char_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'document_chunks'
        ordering = ['paper', 'chunk_index']
        indexes = [
            models.Index(fields=['paper', 'chunk_index']),
            models.Index(fields=['section']),
            models.Index(fields=['paper', 'section']),
        ]
    
    def __str__(self):
        return f"{self.paper.title} - Chunk {self.chunk_index}"


class Citation(models.Model):
    citing_paper = models.ForeignKey(Paper, on_delete=models.CASCADE, related_name='citations_made')
    cited_paper = models.ForeignKey(Paper, on_delete=models.CASCADE, related_name='citations_received', null=True, blank=True)
    cited_title = models.CharField(max_length=500)
    context = models.TextField(blank=True)
    doi = models.CharField(max_length=100, blank=True, null=True)
    arxiv_id = models.CharField(max_length=50, blank=True, null=True)
    
    # Extracted metadata
    confidence_score = models.FloatField(default=0.0)
    extraction_method = models.CharField(max_length=50, default='manual')
    
    class Meta:
        db_table = 'citations'
        unique_together = ['citing_paper', 'cited_title']
        indexes = [
            models.Index(fields=['citing_paper']),
            models.Index(fields=['cited_paper']),
            models.Index(fields=['doi']),
            models.Index(fields=['arxiv_id']),
        ]
    
    def __str__(self):
        return f"{self.citing_paper.title} -> {self.cited_title}"
