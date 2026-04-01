import api from './api';

export interface TopicCluster {
  id: number;
  name: string;
  papers: number;
  keywords: string[];
  density: number;
  x: number;
  y: number;
  size: number;
  color?: string;
}

export interface ClusterResponse {
  clusters: TopicCluster[];
  total_papers: number;
  algorithm: string;
}

export const topicsService = {
  generateClusters: async (paperIds?: string[]): Promise<ClusterResponse> => {
    const { data } = await api.post('/topics/cluster', {
      paper_ids: paperIds,
      algorithm: 'dbscan',
    });
    return data;
  },

  getClusterDetails: async (clusterId: number) => {
    const { data } = await api.get(`/topics/clusters/${clusterId}`);
    return data;
  },
};
