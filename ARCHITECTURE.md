# ResearchMind AI Academic Paper Chatbot - System Architecture & Implementation Guide

## 1. Executive Summary
ResearchMind is an AI-powered academic paper analysis platform that enables researchers, students, and academics to upload research papers (PDFs) or paste arXiv links, interact with them via natural language chat, and receive structured insights including summaries, methodology breakdowns, result comparisons, citation graphs, and topic clustering visualizations.

**Key Capabilities:**
*   RAG (Retrieval-Augmented Generation) over multiple research papers
*   Multi-paper comparison and analysis
*   Citation network graph generation and visualization
*   Topic clustering using NLP and ML techniques
*   Structured summaries with key findings cards
*   Results comparison tables across papers

## 2. System Architecture

### 2.1 High-Level Architecture
ResearchMind follows a modern microservices-inspired architecture with clear separation between frontend, backend API, background processing, and data storage layers.

| Layer | Components |
| :--- | :--- |
| **Frontend** | React SPA, D3.js for visualizations, WebSocket for real-time chat |
| **API Layer** | Django REST Framework, JWT Authentication, Rate Limiting |
| **Processing** | Celery workers, Background tasks, PDF processing, Embedding generation |
| **AI/ML** | OpenAI API, Sentence Transformers, spaCy, scikit-learn clustering |
| **Storage** | PostgreSQL + pgvector, Redis (cache + Celery broker), S3/MinIO (file storage) |

### 2.2 Component Interaction Flow
1.  **User Uploads PDF** → Frontend sends to Django API
2.  **API Validates** → Stores in S3, Creates DB record, Triggers Celery task
3.  **Celery Worker** → Extracts text, Generates embeddings, Stores in pgvector
4.  **User Chats** → WebSocket connection, Query embedding, Vector similarity search
5.  **RAG Pipeline** → Retrieve relevant chunks, Send to OpenAI with context, Stream response

## 3. Technology Stack

### 3.1 Backend Technologies
| Technology | Purpose | Version |
| :--- | :--- | :--- |
| **Django** | Web framework, ORM, Admin | 5.0+ |
| **DRF** | REST API, Serialization | 3.14+ |
| **Celery** | Async task processing | 5.3+ |
| **PostgreSQL**| Primary database | 15+ |
| **pgvector** | Vector similarity search | 0.5+ |
| **Redis** | Cache, Celery broker | 7.0+ |

### 3.2 AI/ML Libraries
*   **OpenAI API:** GPT-4 for chat responses, text-embedding-3-large for embeddings
*   **sentence-transformers:** Alternative local embeddings (all-MiniLM-L6-v2)
*   **spaCy:** NER, entity extraction, linguistic features
*   **scikit-learn:** K-means clustering, DBSCAN for topic detection
*   **PyPDF2/pdfplumber:** PDF text extraction
*   **networkx:** Citation graph construction and analysis

### 3.3 Frontend Technologies
*   **React 18:** UI framework with hooks
*   **D3.js:** Citation graphs and topic cluster visualizations
*   **Recharts:** Results comparison charts
*   **Tailwind CSS:** Utility-first styling
*   **React Query:** Server state management
*   **WebSocket/Socket.io:** Real-time chat

## 4. Backend Logic & Workflow

### 4.1 Paper Upload Workflow
*   **Step 1: File Upload** - User uploads PDF via React dropzone or provides arXiv URL. Frontend validates file type (PDF only) and size (<10MB). POST `/api/papers/` with multipart/form-data.
*   **Step 2: Backend Validation** - Django serializer validates file format, size, metadata. Check for duplicate uploads using content hash (SHA-256). Upload to S3/MinIO bucket with unique key.
*   **Step 3: Database Record** - Create `Paper` model instance with `status='processing'`. Store metadata: title, authors, upload_date, file_url, user_id.
*   **Step 4: Async Processing** - Trigger Celery task: `process_paper_task.delay(paper_id)`. Return 202 Accepted with paper_id to frontend. Frontend polls `/api/papers/{id}/status` or receives WebSocket update.

### 4.2 Chat Interaction Workflow
*   **Step 1: User Message** - User types question in chat interface. Frontend sends via WebSocket or POST `/api/chat/`. Payload: `{ paper_ids: [...], message: 'What is the main finding?' }`
*   **Step 2: Query Embedding** - Generate embedding for user query using OpenAI API or sentence-transformers. Cache embeddings in Redis with TTL (1 hour) for repeat queries.
*   **Step 3: Vector Search** - Query pgvector using cosine similarity: `SELECT * FROM chunks WHERE paper_id IN (...) ORDER BY embedding <=> query_embedding LIMIT 5`. Retrieve top-k (k=5-10) most relevant text chunks.
*   **Step 4: Context Assembly** - Construct prompt with retrieved chunks as context. Include metadata: paper titles, authors, sections. Add system message defining response format (structured summary, comparison, etc.).
*   **Step 5: LLM Response** - Send to OpenAI GPT-4 with streaming enabled. Stream response chunks back to frontend via WebSocket. Store complete message in `ChatMessage` model.

## 5. Data Processing Pipeline

### 5.1 PDF Text Extraction Pipeline
| Stage | Process | Output |
| :--- | :--- | :--- |
| **Download** | Fetch PDF from S3 or arXiv URL | Binary PDF file in memory |
| **Extract** | Use pdfplumber to extract text with layout preservation | Raw text per page, tables extracted separately |
| **Clean** | Remove headers/footers, normalize whitespace, fix hyphenation | Cleaned continuous text |
| **Section** | Identify sections using regex patterns (Abstract, Intro, Methods, Results, etc.) | Sections with labels and boundaries |
| **Chunk** | Split into 500-token chunks with 50-token overlap using tiktoken | Array of text chunks with metadata (section, page) |
| **Embed** | Generate embeddings for each chunk using OpenAI text-embedding-3-large | 1536-dim vectors stored in pgvector |
| **Store** | Save chunks to DocumentChunk model with vector index | Searchable vector database, Paper status='ready' |

### 5.2 Citation Graph Pipeline
*   **Extract References:** Parse 'References' section using regex for DOI, arXiv IDs, titles
*   **Match Papers:** Cross-reference with existing papers in database
*   **Build Graph:** Use networkx to create directed graph (paper → cited_paper)
*   **Metrics:** Calculate PageRank, degree centrality, betweenness
*   **Export:** Serialize graph as JSON (nodes, edges) for D3.js visualization

### 5.3 Topic Clustering Pipeline
*   **Feature Extraction:** Use TF-IDF on paper abstracts/summaries
*   **Dimensionality Reduction:** Apply UMAP or t-SNE for visualization
*   **Clustering:** K-means (elbow method for k) or DBSCAN
*   **Topic Naming:** Extract top keywords per cluster using TF-IDF scores
*   **Visualization:** Generate scatter plot with cluster colors, send to frontend

## 6. Database Schema

### 6.1 Core Models
| Model | Fields | Indexes |
| :--- | :--- | :--- |
| **User** | id, email, password_hash, created_at | email (unique) |
| **Paper** | id, user_id, title, authors, abstract, file_url, status, content_hash, arxiv_id, uploaded_at | user_id, content_hash, status |
| **DocumentChunk** | id, paper_id, text, embedding (vector), section, page, token_count | paper_id, embedding (ivfflat/hnsw) |
| **ChatSession** | id, user_id, title, created_at | user_id, created_at |
| **ChatMessage** | id, session_id, role, content, paper_ids, created_at | session_id, created_at |
| **Citation** | id, citing_paper_id, cited_paper_id, context | citing_paper_id, cited_paper_id |

### 6.2 Vector Index Configuration
PostgreSQL pgvector extension setup:
```sql
CREATE EXTENSION vector;
CREATE INDEX ON document_chunk USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
-- Alternative: HNSW for better accuracy
CREATE INDEX ON document_chunk USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
```

## 7. API Design

### 7.1 Core Endpoints
| Method | Endpoint | Purpose | Auth |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | User registration | None |
| **POST** | `/api/auth/login` | Login, returns JWT token | None |
| **POST** | `/api/papers/` | Upload PDF or submit arXiv URL | JWT |
| **GET** | `/api/papers/` | List all papers for user | JWT |
| **GET** | `/api/papers/{id}/status` | Check processing status | JWT |
| **POST** | `/api/chat/` | Send chat message, get response | JWT |
| **GET** | `/api/papers/{id}/summary` | Get structured summary | JWT |
| **GET** | `/api/citations/graph` | Get citation graph data | JWT |
| **POST** | `/api/topics/cluster` | Generate topic clusters | JWT |

## 8. Implementation Roadmap

### 8.1 Phase 1: Core Infrastructure (Weeks 1-2)
*   Setup Django project with DRF, PostgreSQL, Redis, Celery
*   Implement User authentication (JWT, registration, login)
*   Create database models (User, Paper, DocumentChunk, ChatSession, ChatMessage)
*   Setup S3/MinIO for file storage
*   Implement PDF upload endpoint with validation

### 8.2 Phase 2: PDF Processing Pipeline (Weeks 3-4)
*   Implement Celery task for PDF text extraction
*   Build chunking logic with tiktoken
*   Integrate OpenAI embedding API
*   Setup pgvector extension and create vector indexes
*   Implement vector similarity search

### 8.3 Phase 3: RAG Chat System (Weeks 5-6)
*   Build chat API endpoint with context retrieval
*   Integrate OpenAI GPT-4 API with streaming
*   Implement WebSocket for real-time responses
*   Add conversation history management
*   Implement Redis caching for embeddings

### 8.4 Phase 4: Advanced Features (Weeks 7-8)
*   Implement citation extraction and graph building
*   Build topic clustering pipeline with scikit-learn
*   Create structured summary generation
*   Implement multi-paper comparison logic
*   Add results comparison table generation

### 8.5 Phase 5: Frontend Development (Weeks 9-10)
*   Build React UI with component structure
*   Implement file upload interface with drag-drop
*   Create chat interface with streaming support
*   Build D3.js citation graph visualization
*   Implement topic cluster visualization
*   Add structured summary and comparison table UI

### 8.6 Phase 6: Testing & Deployment (Weeks 11-12)
*   Write unit tests for core logic (pytest)
*   Integration testing for API endpoints
*   Setup Docker containerization
*   Configure CI/CD pipeline (GitHub Actions)
*   Deploy to cloud (AWS/GCP/DigitalOcean)
*   Documentation and project report

## 9. Key Features Implementation Details

### 9.1 Structured Summary Generation
*   **Approach:** Extract paper sections: Abstract, Introduction, Methodology, Results, Conclusion. Use GPT-4 with structured prompts for each section. Format output as JSON with predefined schema. Display as cards with expandable sections.
*   **Prompt Template:**
    ```text
    Analyze the following research paper section and provide:
    1. Main finding/contribution (1-2 sentences)
    2. Key methodology (bullet points)
    3. Results summary (quantitative if available)
    4. Limitations mentioned
    
    Section: {section_text}
    ```

### 9.2 Multi-Paper Comparison
*   **Approach:** User selects 2-5 papers for comparison. Extract comparable attributes: methodology, dataset, metrics, results. Use GPT-4 to generate comparison matrix. Display as interactive table with sorting/filtering.
*   **Comparison Dimensions:** Research Question/Problem Statement, Methodology/Approach, Dataset/Experimental Setup, Key Results/Metrics, Limitations/Future Work.

### 9.3 Citation Network Visualization
*   **Implementation:** Use D3.js force-directed graph layout. Node size = citation count (PageRank score). Node color = publication year or topic cluster. Edge thickness = co-citation strength. Interactive: hover for details, click to navigate.
*   **Graph Metrics:** Degree centrality (most cited papers), Betweenness centrality (bridging papers), Community detection (related research clusters).

## 10. Deployment Architecture

### 10.1 Containerization with Docker
**Services:**
*   `web`: Django application (Gunicorn + Nginx)
*   `worker`: Celery worker for background tasks
*   `beat`: Celery beat for scheduled tasks
*   `db`: PostgreSQL with pgvector
*   `redis`: Cache and message broker
*   `frontend`: React app (served by Nginx)

### 10.2 Production Considerations
*   **Scaling:** Horizontal scaling for web and worker containers
*   **Load Balancing:** Nginx for distributing requests
*   **Monitoring:** Prometheus + Grafana for metrics, Sentry for error tracking
*   **Logging:** ELK stack (Elasticsearch, Logstash, Kibana)
*   **Security:** HTTPS/TLS, JWT with expiry, rate limiting, CORS configuration
*   **Backup:** Automated PostgreSQL backups, S3 versioning
