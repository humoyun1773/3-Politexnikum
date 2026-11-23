export interface StudentProfile {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  group: string;
  specialty: string;
  course: number;
  email?: string;
  phone?: string;
  avatar?: string;
  gpa: number;
  attendance_percentage: number;
  rating_position: number;
  total_students: number;
  joined_date?: string;
}

export interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}
