import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService, type SendMessageRequest } from '../services/chat';

export const useChatSessions = () => {
  return useQuery({
    queryKey: ['chat-sessions'],
    queryFn: chatService.listChatSessions,
  });
};

export const useChatSession = (sessionId: string) => {
  return useQuery({
    queryKey: ['chat-sessions', sessionId],
    queryFn: () => chatService.getChatSession(sessionId),
    enabled: !!sessionId,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: SendMessageRequest) => chatService.sendMessage(request),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['chat-sessions', data.session_id] });
      queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
    },
  });
};

export const useDeleteChatSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (sessionId: string) => chatService.deleteChatSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
    },
  });
};
