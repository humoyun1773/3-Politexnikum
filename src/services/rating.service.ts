import { apiClient } from './api';
import { RatingItem, RatingFilterParams } from '@/types/rating.types';

export const ratingService = {
  async getRating(params?: RatingFilterParams): Promise<RatingItem[]> {
    const response = await apiClient.get<RatingItem[]>('/api/rating/', {
      params,
    });
    return response.data || [];
  },
};
