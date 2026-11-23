export interface ChatMessage {
  id: number;
  sender: number;
  sender_name: string;
  text: string;
  created_at: string;
  avatar?: string;
  is_me?: boolean;
}

export interface SendChatMessagePayload {
  text: string;
}
