export interface Task {
  id: number;
  title: string;
  duration: string;
  imageUrl?: string;
  quickLink?: string;
  completed: boolean;
  group: string;
}

export interface DailyCheckin {
  id: number;
  title: string;
  completed: boolean;
  lastCompletedDate?: string;
}