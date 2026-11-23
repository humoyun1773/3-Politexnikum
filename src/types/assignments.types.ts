export type KindEnum = 'control' | 'practice' | 'test' | 'bsb';

export interface Assignment {
  id: number;
  title: string;
  subject: string;
  kind: KindEnum;
  kind_display: string;
  due_date: string;
  days_left: string;
  submitted: string | boolean;
  description?: string;
  max_score?: number;
}

export interface AssignmentSubmitPayload {
  file_url?: string;
  note?: string;
  file?: File;
}
