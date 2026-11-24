export type { KindEnum, Assignment } from './openapi.types';

export interface AssignmentSubmitPayload {
  file_url?: string;
  note?: string;
  file?: File;
}
