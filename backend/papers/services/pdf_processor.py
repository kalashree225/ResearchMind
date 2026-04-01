import os
import re
from typing import List, Dict, Tuple
from django.utils import timezone
import PyPDF2
import pdfplumber
from django.conf import settings
from ..models import Paper, DocumentChunk


class PDFProcessor:
    """Service for processing PDF files and extracting text chunks."""
    
    def __init__(self):
        self.chunk_size = 500  # tokens
        self.chunk_overlap = 50  # tokens
        
    def extract_text_from_pdf(self, file_path: str) -> Dict:
        """Extract text and metadata from PDF file."""
        try:
            # First try with pdfplumber (better for tables and layout)
            text_content = self._extract_with_pdfplumber(file_path)
            if not text_content:
                # Fallback to PyPDF2
                text_content = self._extract_with_pypdf2(file_path)
            
            # Get page count
            page_count = self._get_page_count(file_path)
            
            return {
                'text': text_content,
                'page_count': page_count,
                'success': True
            }
        except Exception as e:
            return {
                'text': '',
                'page_count': 0,
                'success': False,
                'error': str(e)
            }
    
    def _extract_with_pdfplumber(self, file_path: str) -> str:
        """Extract text using pdfplumber."""
        text = []
        try:
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text.append(page_text)
        except Exception as e:
            print(f"pdfplumber failed: {e}")
            return ""
        
        return "\n\n".join(text)
    
    def _extract_with_pypdf2(self, file_path: str) -> str:
        """Extract text using PyPDF2 as fallback."""
        text = []
        try:
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text.append(page_text)
        except Exception as e:
            print(f"PyPDF2 failed: {e}")
            return ""
        
        return "\n\n".join(text)
    
    def _get_page_count(self, file_path: str) -> int:
        """Get total page count of PDF."""
        try:
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                return len(pdf_reader.pages)
        except:
            return 0
    
    def detect_sections(self, text: str) -> Dict[str, Tuple[int, int]]:
        """Detect section boundaries in text."""
        sections = {}
        
        # Common section patterns
        section_patterns = {
            'abstract': r'\babstract\b',
            'introduction': r'\bintroduction\b',
            'methods': r'\b(method|methodology|approach)\b',
            'results': r'\b(results?|findings?)\b',
            'discussion': r'\bdiscussion\b',
            'conclusion': r'\b(conclusion|conclusions?)\b',
            'references': r'\b(references?|bibliography)\b'
        }
        
        lines = text.split('\n')
        
        for section_name, pattern in section_patterns.items():
            for i, line in enumerate(lines):
                if re.search(pattern, line, re.IGNORECASE):
                    if section_name not in sections:
                        sections[section_name] = (i, i)
                    else:
                        sections[section_name] = (sections[section_name][0], i)
        
        return sections
    
    def clean_text(self, text: str) -> str:
        """Clean and normalize extracted text."""
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove common PDF artifacts
        text = re.sub(r'\f', '\n\n', text)  # Form feeds to paragraph breaks
        text = re.sub(r'-\s+', '', text)    # Remove hyphenation line breaks
        
        # Fix common OCR errors
        text = re.sub(r'l\s*l\s*l', 'III', text)  # Roman numerals
        text = re.sub(r'(\d)l\b', r'\g<1>1', text)  # Replace l with 1 in numbers
        
        return text.strip()
    
    def chunk_text(self, text: str, paper_id: int) -> List[DocumentChunk]:
        """Split text into chunks with overlap."""
        chunks = []
        
        # Detect sections
        sections = self.detect_sections(text)
        
        # Split into sentences first for better chunking
        sentences = re.split(r'[.!?]+', text)
        sentences = [s.strip() for s in sentences if s.strip()]
        
        current_chunk = ""
        current_tokens = 0
        chunk_index = 0
        
        for sentence in sentences:
            # Rough token estimation (1 token ≈ 4 characters)
            sentence_tokens = len(sentence) // 4
            
            if current_tokens + sentence_tokens > self.chunk_size and current_chunk:
                # Save current chunk
                chunk = self._create_chunk(
                    current_chunk.strip(), 
                    chunk_index, 
                    paper_id, 
                    sections
                )
                if chunk:
                    chunks.append(chunk)
                
                # Start new chunk with overlap
                overlap_text = self._get_overlap_text(current_chunk)
                current_chunk = overlap_text + " " + sentence
                current_tokens = len(overlap_text) // 4 + sentence_tokens
                chunk_index += 1
            else:
                current_chunk += " " + sentence
                current_tokens += sentence_tokens
        
        # Don't forget the last chunk
        if current_chunk.strip():
            chunk = self._create_chunk(
                current_chunk.strip(), 
                chunk_index, 
                paper_id, 
                sections
            )
            if chunk:
                chunks.append(chunk)
        
        return chunks
    
    def _get_overlap_text(self, text: str) -> str:
        """Get overlap text for next chunk."""
        words = text.split()
        overlap_words = self.chunk_overlap * 4 // len(' ')  # Rough word count
        
        if len(words) > overlap_words:
            return ' '.join(words[-overlap_words:])
        return text
    
    def _create_chunk(self, text: str, chunk_index: int, paper_id: int, sections: Dict) -> DocumentChunk:
        """Create a DocumentChunk object."""
        # Determine section
        section = self._determine_chunk_section(text, sections)
        
        # Count characters (more accurate than tokens for now)
        char_count = len(text)
        token_count = char_count // 4  # Rough estimate
        
        return DocumentChunk(
            paper_id=paper_id,
            text=text,
            section=section,
            page_number=1,  # Could be enhanced with actual page numbers
            chunk_index=chunk_index,
            token_count=token_count,
            char_count=char_count
        )
    
    def _determine_chunk_section(self, text: str, sections: Dict) -> str:
        """Determine which section a chunk belongs to."""
        text_lower = text.lower()
        
        # Check for section keywords in the text
        section_keywords = {
            'abstract': ['abstract', 'summary'],
            'introduction': ['introduction', 'background', 'overview'],
            'methods': ['method', 'methodology', 'approach', 'technique', 'procedure'],
            'results': ['result', 'finding', 'outcome', 'performance'],
            'discussion': ['discussion', 'analysis', 'interpretation'],
            'conclusion': ['conclusion', 'summary', 'future', 'limitation'],
            'references': ['reference', 'bibliography', 'citation']
        }
        
        # Count keyword matches
        section_scores = {}
        for section, keywords in section_keywords.items():
            score = sum(1 for keyword in keywords if keyword in text_lower)
            if score > 0:
                section_scores[section] = score
        
        # Return section with highest score
        if section_scores:
            return max(section_scores, key=section_scores.get)
        
        return 'other'
    
    def process_pdf(self, paper: Paper) -> bool:
        """Process a PDF file and create document chunks."""
        try:
            # Update paper status
            paper.status = 'extracting'
            paper.save()
            
            # Get file path
            if paper.file_url.startswith('/media/'):
                file_path = os.path.join(settings.MEDIA_ROOT, paper.file_url[7:])
            else:
                file_path = paper.file_url
            
            # Extract text
            extraction_result = self.extract_text_from_pdf(file_path)
            
            if not extraction_result['success']:
                paper.status = 'failed'
                paper.processing_error = extraction_result.get('error', 'Unknown error')
                paper.save()
                return False
            
            # Update paper with metadata
            paper.total_pages = extraction_result['page_count']
            paper.extraction_progress = 100
            paper.status = 'chunking'
            paper.save()
            
            # Clean text
            cleaned_text = self.clean_text(extraction_result['text'])
            
            # Create chunks
            chunks = self.chunk_text(cleaned_text, paper.id)
            
            # Save chunks
            DocumentChunk.objects.bulk_create(chunks)
            
            # Update paper status
            paper.status = 'ready'
            paper.processed_at = timezone.now()
            paper.save()
            
            return True
            
        except Exception as e:
            paper.status = 'failed'
            paper.processing_error = str(e)
            paper.save()
            return False
