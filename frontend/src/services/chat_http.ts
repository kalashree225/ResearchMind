import api from './api';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  messages: ChatMessage[];
}

export interface ChatRequest {
  message: string;
  paper_ids: string[];
  session_id?: string;
}

export interface ChatResponse {
  message: string;
  session_id: string;
  message_id: string;
}

export const chatService = {
  sendMessage: async (data: ChatRequest): Promise<ChatResponse> => {
    const { data: response } = await api.post('/chat/', data);
    return response;
  },

  getSessions: async (): Promise<ChatSession[]> => {
    const { data } = await api.get('/chat/sessions/');
    return data;
  },

  getSession: async (sessionId: string): Promise<ChatSession> => {
    const { data } = await api.get(`/chat/sessions/${sessionId}/`);
    return data;
  },

  deleteSession: async (sessionId: string): Promise<void> => {
    await api.delete(`/chat/sessions/${sessionId}/`);
  },
};
