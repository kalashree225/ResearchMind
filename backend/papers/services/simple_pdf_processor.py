import os
import re
from typing import List, Dict, Tuple
from django.utils import timezone
import PyPDF2
from django.conf import settings
from ..models import Paper, DocumentChunk

class SimplePDFProcessor:
    """Simplified PDF processor using only PyPDF2 (no external dependencies)."""
    
    def __init__(self):
        self.chunk_size = 1000  # characters
        self.chunk_overlap = 100  # characters
        
    def extract_text_from_pdf(self, file_path: str) -> Dict:
        """Extract text from PDF using PyPDF2."""
        try:
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                
                # Extract metadata
                metadata = pdf_reader.metadata
                title = metadata.get('/Title', '') if metadata else ''
                author = metadata.get('/Author', '') if metadata else ''
                
                # Extract text from all pages
                full_text = ""
                pages_text = []
                
                for page_num, page in enumerate(pdf_reader.pages):
                    try:
                        page_text = page.extract_text()
                        if page_text.strip():
                            pages_text.append({
                                'page': page_num + 1,
                                'text': page_text.strip()
                            })
                            full_text += page_text + "\n"
                    except Exception as e:
                        print(f"Error extracting text from page {page_num}: {e}")
                        continue
                
                return {
                    'title': title,
                    'author': author,
                    'full_text': full_text.strip(),
                    'pages': pages_text,
                    'total_pages': len(pdf_reader.pages),
                    'success': True
                }
                
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def create_text_chunks(self, text: str, paper: Paper) -> List[DocumentChunk]:
        """Create text chunks from extracted text."""
        if not text.strip():
            return []
        
        # Clean up text
        text = re.sub(r'\s+', ' ', text)
        text = text.strip()
        
        chunks = []
        start = 0
        
        while start < len(text):
            end = start + self.chunk_size
            
            if end >= len(text):
                chunks.append(text[start:])
                break
            
            # Try to break at sentence or word boundary
            chunk_text = text[start:end]
            
            # Look for sentence endings
            sentence_end = max(
                chunk_text.rfind('.'),
                chunk_text.rfind('!'),
                chunk_text.rfind('?')
            )
            
            if sentence_end > self.chunk_size * 0.7:  # If we found a good break point
                end = start + sentence_end + 1
                chunk_text = text[start:end]
            else:
                # Look for word boundary
                word_boundary = chunk_text.rfind(' ')
                if word_boundary > self.chunk_size * 0.8:
                    end = start + word_boundary
                    chunk_text = text[start:end]
            
            chunks.append(chunk_text.strip())
            
            if start + self.chunk_overlap >= len(text):
                break
                
            start = max(start + 1, end - self.chunk_overlap)
        
        # Create DocumentChunk objects
        document_chunks = []
        for i, chunk_text in enumerate(chunks):
            if chunk_text.strip():
                document_chunks.append(
                    DocumentChunk(
                        paper=paper,
                        text=chunk_text,
                        section='main',
                        page_number=1,
                        chunk_index=i,
                        token_count=len(chunk_text.split())
                    )
                )
        
        return document_chunks
    
    def process_pdf(self, paper: Paper, file_path: str) -> Dict:
        """Process PDF file and update paper with extracted content."""
        try:
            # Update status
            paper.status = 'processing'
            paper.save()
            
            # Extract text
            extraction_result = self.extract_text_from_pdf(file_path)
            
            if not extraction_result['success']:
                paper.status = 'failed'
                paper.save()
                return {
                    'success': False,
                    'error': extraction_result['error']
                }
            
            # Update paper metadata
            if extraction_result['title'] and not paper.title:
                paper.title = extraction_result['title']
            
            if extraction_result['author']:
                paper.authors = [extraction_result['author']]
            
            # Extract abstract (first paragraph or first 500 chars)
            full_text = extraction_result['full_text']
            if full_text and not paper.abstract:
                # Try to find abstract (usually first paragraph)
                paragraphs = full_text.split('\n\n')
                if paragraphs:
                    abstract = paragraphs[0].strip()
                    if len(abstract) > 500:
                        abstract = abstract[:500] + '...'
                    paper.abstract = abstract
            
            # Create text chunks
            chunks = self.create_text_chunks(full_text, paper)
            
            # Save chunks
            DocumentChunk.objects.bulk_create(chunks)
            
            # Update paper status
            paper.status = 'ready'
            paper.processed_at = timezone.now()
            paper.save()
            
            return {
                'success': True,
                'chunks_created': len(chunks),
                'total_pages': extraction_result['total_pages']
            }
            
        except Exception as e:
            paper.status = 'failed'
            paper.save()
            return {
                'success': False,
                'error': str(e)
            }
