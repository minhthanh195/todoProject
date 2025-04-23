export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
  tags?: string[];
  deadline?: string;
  completedAt?: string;
  group: string;
}
