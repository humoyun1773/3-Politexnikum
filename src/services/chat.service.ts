import { apiClient } from './api';
import { ChatMessage, SendChatMessagePayload } from '@/types/chat.types';

export const chatService = {
  async getMessages(): Promise<ChatMessage[]> {
    const response = await apiClient.get<ChatMessage[]>('/api/chat/');
    return response.data || [];
  },

  async sendMessage(textOrPayload: string | SendChatMessagePayload): Promise<ChatMessage> {
    const payload =
      typeof textOrPayload === 'string' ? { text: textOrPayload } : textOrPayload;
    const response = await apiClient.post<ChatMessage>('/api/chat/', payload);
    return response.data;
  },
};
