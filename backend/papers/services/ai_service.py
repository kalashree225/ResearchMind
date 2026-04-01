import os
import json
from typing import List, Dict, Any
import openai
from django.conf import settings
from ..models import Paper, DocumentChunk


class AIService:
    """Service for AI-powered paper analysis using OpenAI."""
    
    def __init__(self):
        self.client = openai.OpenAI(
            api_key=os.getenv('OPENAI_API_KEY', 'your-openai-api-key')
        )
        self.model = "gpt-4-turbo-preview"
        self.embedding_model = "text-embedding-3-large"
    
    def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for a list of texts."""
        try:
            response = self.client.embeddings.create(
                model=self.embedding_model,
                input=texts
            )
            return [embedding.embedding for embedding in response.data]
        except Exception as e:
            print(f"Error generating embeddings: {e}")
            return []
    
    def chat_with_papers(self, message: str, paper_ids: List[str], conversation_history: List[Dict] = None) -> str:
        """Generate AI response based on paper context."""
        try:
            # Get relevant document chunks
            context_chunks = self._get_relevant_chunks(message, paper_ids)
            
            # Build context
            context = self._build_context(context_chunks, paper_ids)
            
            # Build conversation history
            history = self._build_conversation_history(conversation_history or [])
            
            # Create prompt
            prompt = self._create_chat_prompt(message, context, history)
            
            # Generate response
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful AI assistant specialized in analyzing academic research papers. Provide accurate, insightful responses based on the provided paper content. Always cite specific parts of the papers when making claims."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=1000,
                temperature=0.7
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"Error in chat with papers: {e}")
            return f"I apologize, but I encountered an error while analyzing the papers: {str(e)}"
    
    def generate_paper_summary(self, paper_id: str) -> Dict[str, Any]:
        """Generate a comprehensive summary of a paper."""
        try:
            paper = Paper.objects.get(id=paper_id)
            chunks = DocumentChunk.objects.filter(paper=paper).order_by('chunk_index')
            
            # Get full text
            full_text = "\n\n".join([chunk.text for chunk in chunks])
            
            # Truncate if too long
            if len(full_text) > 8000:
                full_text = full_text[:8000] + "..."
            
            # Generate summary sections
            sections = {
                'main_contribution': self._extract_main_contribution(full_text),
                'methodology': self._extract_methodology(full_text),
                'key_results': self._extract_key_results(full_text),
                'limitations': self._extract_limitations(full_text),
                'future_work': self._extract_future_work(full_text)
            }
            
            # Generate overall summary
            overall_summary = self._generate_overall_summary(full_text, sections)
            
            return {
                'overall_summary': overall_summary,
                'sections': sections,
                'paper_metadata': {
                    'title': paper.title,
                    'authors': paper.authors,
                    'abstract': paper.abstract
                }
            }
            
        except Exception as e:
            print(f"Error generating paper summary: {e}")
            return {
                'error': str(e),
                'overall_summary': 'Unable to generate summary due to an error.',
                'sections': {}
            }
    
    def compare_papers(self, paper_ids: List[str]) -> Dict[str, Any]:
        """Generate a comparison between multiple papers."""
        try:
            papers = Paper.objects.filter(id__in=paper_ids)
            
            if len(papers) < 2:
                return {'error': 'At least 2 papers are required for comparison'}
            
            # Get summaries for all papers
            summaries = {}
            for paper in papers:
                summaries[paper.id] = self.generate_paper_summary(paper.id)
            
            # Generate comparison
            comparison_prompt = self._create_comparison_prompt(papers, summaries)
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert at analyzing and comparing academic research papers. Provide detailed, structured comparisons highlighting similarities, differences, strengths, and weaknesses."
                    },
                    {
                        "role": "user",
                        "content": comparison_prompt
                    }
                ],
                max_tokens=1500,
                temperature=0.3
            )
            
            comparison_text = response.choices[0].message.content
            
            # Parse comparison into structured format
            comparison_data = self._parse_comparison_response(comparison_text, papers)
            
            return {
                'comparison_text': comparison_text,
                'structured_comparison': comparison_data,
                'papers': [
                    {
                        'id': str(paper.id),
                        'title': paper.title,
                        'authors': paper.authors
                    }
                    for paper in papers
                ]
            }
            
        except Exception as e:
            print(f"Error comparing papers: {e}")
            return {'error': str(e)}
    
    def _get_relevant_chunks(self, query: str, paper_ids: List[str], max_chunks: int = 5) -> List[DocumentChunk]:
        """Get most relevant chunks for a query."""
        chunks = DocumentChunk.objects.filter(paper_id__in=paper_ids).order_by('chunk_index')
        
        # For now, return chunks from abstract and introduction first
        # In a full implementation, this would use vector similarity search
        priority_sections = ['abstract', 'introduction', 'methods', 'results']
        relevant_chunks = []
        
        for section in priority_sections:
            section_chunks = chunks.filter(section=section)[:max_chunks - len(relevant_chunks)]
            relevant_chunks.extend(section_chunks)
            if len(relevant_chunks) >= max_chunks:
                break
        
        # If still need more chunks, add from other sections
        if len(relevant_chunks) < max_chunks:
            remaining_chunks = chunks.exclude(section__in=priority_sections)[:max_chunks - len(relevant_chunks)]
            relevant_chunks.extend(remaining_chunks)
        
        return relevant_chunks
    
    def _build_context(self, chunks: List[DocumentChunk], paper_ids: List[str]) -> str:
        """Build context string from chunks."""
        papers = Paper.objects.filter(id__in=paper_ids)
        
        context = "Context from the following papers:\n\n"
        
        for paper in papers:
            paper_chunks = [c for c in chunks if c.paper_id == paper.id]
            if paper_chunks:
                context += f"Paper: {paper.title}\n"
                context += f"Authors: {', '.join(paper.authors)}\n\n"
                
                for chunk in paper_chunks:
                    context += f"[{chunk.section.title()}]: {chunk.text}\n\n"
                
                context += "---\n\n"
        
        return context
    
    def _build_conversation_history(self, history: List[Dict]) -> str:
        """Build conversation history string."""
        if not history:
            return ""
        
        history_text = "Previous conversation:\n"
        for msg in history[-5:]:  # Last 5 messages
            role = "User" if msg['role'] == 'user' else "Assistant"
            history_text += f"{role}: {msg['content']}\n"
        
        return history_text + "\n"
    
    def _create_chat_prompt(self, message: str, context: str, history: str) -> str:
        """Create prompt for chat completion."""
        prompt = f"""
{history}

{context}

Current question: {message}

Please provide a comprehensive answer based on the paper content above. Be specific and cite relevant information from the papers.
"""
        return prompt
    
    def _extract_main_contribution(self, text: str) -> str:
        """Extract main contribution from paper text."""
        prompt = f"""
Extract the main contribution of this research paper in 2-3 sentences:

{text[:4000]}
"""
        return self._extract_with_prompt(prompt)
    
    def _extract_methodology(self, text: str) -> List[str]:
        """Extract methodology from paper text."""
        prompt = f"""
Extract the key methodology/approach points from this research paper as a bulleted list:

{text[:4000]}
"""
        result = self._extract_with_prompt(prompt)
        return [line.strip().lstrip('•').lstrip('-') for line in result.split('\n') if line.strip()]
    
    def _extract_key_results(self, text: str) -> str:
        """Extract key results from paper text."""
        prompt = f"""
Extract the key results and findings from this research paper in 2-3 sentences:

{text[:4000]}
"""
        return self._extract_with_prompt(prompt)
    
    def _extract_limitations(self, text: str) -> str:
        """Extract limitations from paper text."""
        prompt = f"""
Extract the limitations mentioned in this research paper:

{text[:4000]}
"""
        return self._extract_with_prompt(prompt)
    
    def _extract_future_work(self, text: str) -> str:
        """Extract future work suggestions from paper text."""
        prompt = f"""
Extract future work suggestions from this research paper:

{text[:4000]}
"""
        return self._extract_with_prompt(prompt)
    
    def _generate_overall_summary(self, text: str, sections: Dict) -> str:
        """Generate overall summary."""
        prompt = f"""
Based on the following extracted sections, provide a concise overall summary of this research paper:

Main Contribution: {sections.get('main_contribution', 'N/A')}
Methodology: {sections.get('methodology', 'N/A')}
Key Results: {sections.get('key_results', 'N/A')}
Limitations: {sections.get('limitations', 'N/A')}
"""
        return self._extract_with_prompt(prompt)
    
    def _extract_with_prompt(self, prompt: str) -> str:
        """Extract information using a prompt."""
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=300,
                temperature=0.3
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"Error in extraction: {e}")
            return "Extraction failed"
    
    def _create_comparison_prompt(self, papers: List[Paper], summaries: Dict) -> str:
        """Create prompt for paper comparison."""
        prompt = "Compare the following research papers:\n\n"
        
        for paper in papers:
            summary = summaries.get(paper.id, {})
            prompt += f"Paper: {paper.title}\n"
            prompt += f"Authors: {', '.join(paper.authors)}\n"
            prompt += f"Main Contribution: {summary.get('sections', {}).get('main_contribution', 'N/A')}\n"
            prompt += f"Methodology: {summary.get('sections', {}).get('methodology', 'N/A')}\n"
            prompt += f"Key Results: {summary.get('sections', {}).get('key_results', 'N/A')}\n\n"
        
        prompt += """
Please provide a structured comparison covering:
1. Similarities in approach and findings
2. Key differences in methodology or results
3. Strengths and weaknesses of each approach
4. Which paper might be more suitable for different use cases
"""
        return prompt
    
    def _parse_comparison_response(self, response: str, papers: List[Paper]) -> Dict:
        """Parse comparison response into structured format."""
        # This is a simplified parsing - in production, you'd want more sophisticated parsing
        return {
            'similarities': 'Extracted from response',
            'differences': 'Extracted from response',
            'strengths': {paper.title: 'Analysis' for paper in papers},
            'weaknesses': {paper.title: 'Analysis' for paper in papers},
            'recommendations': 'Extracted from response'
        }
