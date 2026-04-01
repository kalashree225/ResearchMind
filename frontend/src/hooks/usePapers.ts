import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { papersService } from '../services/papers';
import type { Paper } from '../services/papers';

export const usePapers = () => {
  return useQuery({
    queryKey: ['papers'],
    queryFn: papersService.listPapers,
  });
};

export const usePaper = (paperId: string) => {
  return useQuery({
    queryKey: ['papers', paperId],
    queryFn: () => papersService.getPaperStatus(paperId),
    enabled: !!paperId,
  });
};

export const usePaperSummary = (paperId: string) => {
  return useQuery({
    queryKey: ['papers', paperId, 'summary'],
    queryFn: () => papersService.getPaperSummary(paperId),
    enabled: !!paperId,
  });
};

export const useUploadPDF = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (file: File) => papersService.uploadPDF(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['papers'] });
    },
  });
};

export const useUploadArxiv = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (arxivUrl: string) => papersService.uploadArxivLink(arxivUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['papers'] });
    },
  });
};

export const useDeletePaper = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (paperId: string) => papersService.deletePaper(paperId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['papers'] });
    },
  });
};

export const useComparePapers = () => {
  return useMutation({
    mutationFn: (paperIds: string[]) => papersService.comparePapers(paperIds),
  });
};

export const usePaperPolling = (paperId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['papers', paperId, 'status'],
    queryFn: () => papersService.getPaperStatus(paperId),
    enabled: enabled && !!paperId,
    refetchInterval: (query) => {
      const data = query.state.data as Paper | undefined;
      if (data?.status === 'processing' || data?.status === 'extracting' || data?.status === 'embedding') {
        return 2000;
      }
      return false;
    },
  });
};
