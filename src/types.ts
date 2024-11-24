export interface Task {
  id: number;
  title: string;
  duration: string;
  imageUrl: string;
  completed: boolean;
  group: 'Educational' | 'Entertainment' | 'Financial' | 'Skin Care';
}