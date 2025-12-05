import { CheckCircle2, Circle, Calendar, Clock, Pencil, CalendarPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Task } from '@/types/tasks';
import { format, parseISO, isPast, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TaskCardProps {
  task: Task;
  onToggleStatus: (task: Task) => void;
  onEdit: (task: Task) => void;
  onSchedule: (task: Task) => void;
}

const priorityConfig = {
  low: { label: 'Basse', className: 'bg-muted text-muted-foreground' },
  medium: { label: 'Moyenne', className: 'bg-primary/20 text-primary' },
  high: { label: 'Haute', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

export const TaskCard = ({ task, onToggleStatus, onEdit, onSchedule }: TaskCardProps) => {
  const isDone = task.status === 'done';
  const isOverdue = task.due_date && isPast(parseISO(task.due_date)) && !isToday(parseISO(task.due_date)) && !isDone;
  const isScheduled = !!task.linked_event_id;

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h${m}` : `${h}h`;
  };

  return (
    <div 
      className={cn(
        "group relative p-3 bg-card rounded-lg border transition-all hover:shadow-md",
        isDone && "opacity-60 bg-muted/50",
        isOverdue && "border-red-300 dark:border-red-700"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggleStatus(task)}
          className="mt-0.5 flex-shrink-0"
        >
          {isDone ? (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          ) : (
            <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={cn(
            "font-medium text-sm",
            isDone && "line-through text-muted-foreground"
          )}>
            {task.title}
          </p>
          
          {/* Meta line */}
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground flex-wrap">
            {task.subject && (
              <span className="flex items-center gap-1">
                <span 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: task.subject.color }}
                />
                {task.subject.name}
              </span>
            )}
            {task.estimated_duration_minutes && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDuration(task.estimated_duration_minutes)}
              </span>
            )}
            {isScheduled && (
              <span className="flex items-center gap-1 text-blue-600">
                <Calendar className="w-3 h-3" />
                Planifiée
              </span>
            )}
          </div>
        </div>

        {/* Right side: badges + actions */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-1.5">
            <Badge variant="secondary" className={cn("text-xs", priorityConfig[task.priority].className)}>
              {priorityConfig[task.priority].label}
            </Badge>
            {task.due_date && (
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs",
                  isOverdue && "border-red-400 text-red-600 dark:text-red-400"
                )}
              >
                {format(parseISO(task.due_date), 'd MMM', { locale: fr })}
              </Badge>
            )}
          </div>
          
          {/* Action buttons - visible on hover */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {!isScheduled && !isDone && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => onSchedule(task)}
                title="Planifier"
              >
                <CalendarPlus className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onEdit(task)}
              title="Modifier"
            >
              <Pencil className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
