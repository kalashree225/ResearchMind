import { useQuery, useMutation } from '@tanstack/react-query';
import { topicsService } from '../services/topics';

export const useGenerateClusters = () => {
  return useMutation({
    mutationFn: (paperIds?: string[]) => topicsService.generateClusters(paperIds),
  });
};

export const useClusterDetails = (clusterId: number) => {
  return useQuery({
    queryKey: ['clusters', clusterId],
    queryFn: () => topicsService.getClusterDetails(clusterId),
    enabled: !!clusterId,
  });
};
