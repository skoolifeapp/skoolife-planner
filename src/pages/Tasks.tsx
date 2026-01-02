import { KanbanBoard } from '@/components/tasks/KanbanBoard';
import { CheckSquare } from 'lucide-react';

export default function Tasks() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <CheckSquare className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">To-Do List</h1>
          <p className="text-muted-foreground text-sm">
            Organisez vos tâches avec un tableau Kanban
          </p>
        </div>
      </div>

      {/* Kanban board */}
      <KanbanBoard />
    </div>
  );
}
