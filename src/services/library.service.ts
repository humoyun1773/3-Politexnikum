import { apiClient } from './api';
import { Book } from '@/types/library.types';

export const libraryService = {
  async getBooks(): Promise<Book[]> {
    const response = await apiClient.get<Book[]>('/api/library/');
    return response.data || [];
  },
};
