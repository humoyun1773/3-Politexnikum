export type { Goal, PatchedGoal } from './openapi.types';

export interface CreateGoalPayload {
  title: string;
  is_done?: boolean;
}

export interface UpdateGoalPayload {
  title?: string;
  is_done?: boolean;
}
