export interface Goal {
  id: number;
  title: string;
  is_done: boolean;
  created_at: string;
}

export interface CreateGoalPayload {
  title: string;
  is_done?: boolean;
}

export interface UpdateGoalPayload {
  title?: string;
  is_done?: boolean;
}
