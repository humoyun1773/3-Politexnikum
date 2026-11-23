export interface UserSettings {
  theme?: 'dark' | 'light' | 'system';
  language?: 'uz' | 'ru' | 'en';
  email_notifications?: boolean;
  sms_notifications?: boolean;
  chat_notifications?: boolean;
  show_rating_publicly?: boolean;
}

export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
}
