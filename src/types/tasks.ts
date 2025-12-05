export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  subject_id: string | null;
  due_date: string | null;
  estimated_duration_minutes: number | null;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'done';
  linked_event_id: string | null;
  created_at: string;
  updated_at: string;
  subject?: {
    id: string;
    name: string;
    color: string;
  };
}
