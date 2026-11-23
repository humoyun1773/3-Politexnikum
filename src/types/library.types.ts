export interface Book {
  id: number;
  title: string;
  author: string;
  file: string;
  cover?: string;
  subject?: string;
  pages?: number;
  download_count?: number;
}
