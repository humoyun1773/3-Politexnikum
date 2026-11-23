import { apiClient } from './api';

export interface SearchResults {
  lessons?: any[];
  assignments?: any[];
  books?: any[];
  announcements?: any[];
  [key: string]: any;
}

export const searchService = {
  async search(query: string): Promise<SearchResults> {
    if (!query.trim()) {
      return { lessons: [], assignments: [], books: [], announcements: [] };
    }
    const response = await apiClient.get<SearchResults>('/api/search/', {
      params: { q: query },
    });
    return response.data || { lessons: [], assignments: [], books: [], announcements: [] };
  },
};
