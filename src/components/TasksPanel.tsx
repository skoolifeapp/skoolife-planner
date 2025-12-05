import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { X, Plus, CheckSquare, Clock, AlertTriangle, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TaskCard } from '@/components/TaskCard';
import { TaskFormDialog } from '@/components/TaskFormDialog';
import { ScheduleTaskDialog } from '@/components/ScheduleTaskDialog';
import { toast } from 'sonner';
import type { Task } from '@/types/tasks';
import type { Subject } from '@/types/planning';
import { format, startOfWeek, endOfWeek, parseISO, isPast, isToday } from 'date-fns';
import { cn } from '@/lib/utils';

interface TasksPanelProps {
  open: boolean;
  onClose: () => void;
  subjects: Subject[];
  onEventCreated: () => void;
}

export const TasksPanel = ({ open, onClose, subjects, onEventCreated }: TasksPanelProps) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToSchedule, setTaskToSchedule] = useState<Task | null>(null);

  const fetchTasks = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('due_date', { ascending: true, nullsFirst: false });

      if (error) throw error;

      // Map subjects to tasks
      const tasksWithSubjects: Task[] = (data || []).map(task => ({
        ...task,
        priority: task.priority as Task['priority'],
        status: task.status as Task['status'],
        subject: subjects.find(s => s.id === task.subject_id),
      }));

      setTasks(tasksWithSubjects);
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors du chargement des tâches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchTasks();
    }
  }, [open, user, subjects]);

  const handleToggleStatus = async (task: Task) => {
    const newStatus = task.status === 'done' ? 'todo' : 'done';

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', task.id);

      if (error) throw error;
      fetchTasks();
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleSaveTask = async (data: Partial<Task>) => {
    if (!user) return;

    try {
      if (selectedTask) {
        // Update
        const { error } = await supabase
          .from('tasks')
          .update({
            title: data.title,
            description: data.description,
            subject_id: data.subject_id,
            due_date: data.due_date,
            estimated_duration_minutes: data.estimated_duration_minutes,
            priority: data.priority,
          })
          .eq('id', selectedTask.id);

        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase
          .from('tasks')
          .insert({
            user_id: user.id,
            title: data.title || '',
            description: data.description,
            subject_id: data.subject_id,
            due_date: data.due_date,
            estimated_duration_minutes: data.estimated_duration_minutes,
            priority: data.priority || 'medium',
          });

        if (error) throw error;
      }

      fetchTasks();
      setSelectedTask(null);
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleDeleteTask = async (task: Task) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', task.id);

      if (error) throw error;
      fetchTasks();
      setFormDialogOpen(false);
      setSelectedTask(null);
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleScheduleTask = async (task: Task, date: Date, startTime: string, endTime: string) => {
    if (!user) return;

    try {
      // Create calendar event
      const startDatetime = new Date(date);
      const [startH, startM] = startTime.split(':').map(Number);
      startDatetime.setHours(startH, startM, 0, 0);

      const endDatetime = new Date(date);
      const [endH, endM] = endTime.split(':').map(Number);
      endDatetime.setHours(endH, endM, 0, 0);

      const { data: eventData, error: eventError } = await supabase
        .from('calendar_events')
        .insert({
          user_id: user.id,
          title: task.title,
          start_datetime: startDatetime.toISOString(),
          end_datetime: endDatetime.toISOString(),
          is_blocking: true,
          event_type: 'revision_libre',
          source: 'task',
        })
        .select()
        .single();

      if (eventError) throw eventError;

      // Link task to event
      const { error: taskError } = await supabase
        .from('tasks')
        .update({ linked_event_id: eventData.id })
        .eq('id', task.id);

      if (taskError) throw taskError;

      fetchTasks();
      onEventCreated();
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de la planification');
    }
  };

  // Group tasks
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  const overdueTasks = tasks.filter(t => 
    t.status !== 'done' && 
    t.due_date && 
    isPast(parseISO(t.due_date)) && 
    !isToday(parseISO(t.due_date))
  );

  const thisWeekTasks = tasks.filter(t => {
    if (t.status === 'done') return false;
    if (overdueTasks.some(ot => ot.id === t.id)) return false;
    if (!t.due_date) return false;
    const dueDate = parseISO(t.due_date);
    return dueDate >= weekStart && dueDate <= weekEnd;
  });

  const upcomingTasks = tasks.filter(t => {
    if (t.status === 'done') return false;
    if (overdueTasks.some(ot => ot.id === t.id)) return false;
    if (thisWeekTasks.some(wt => wt.id === t.id)) return false;
    return true;
  });

  const doneTasks = tasks.filter(t => t.status === 'done');

  const renderSection = (title: string, items: Task[], icon: React.ReactNode, className?: string) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-6">
        <h3 className={cn("text-sm font-semibold mb-3 flex items-center gap-2", className)}>
          {icon}
          {title}
          <span className="text-muted-foreground font-normal">({items.length})</span>
        </h3>
        <div className="space-y-2">
          {items.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleStatus={handleToggleStatus}
              onEdit={(t) => {
                setSelectedTask(t);
                setFormDialogOpen(true);
              }}
              onSchedule={(t) => {
                setTaskToSchedule(t);
                setScheduleDialogOpen(true);
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Overlay */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-[380px] max-w-full bg-background border-l shadow-xl z-50 transform transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-primary" />
            Mes tâches
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* New task button */}
        <div className="p-4 border-b">
          <Button 
            className="w-full" 
            onClick={() => {
              setSelectedTask(null);
              setFormDialogOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle tâche
          </Button>
        </div>

        {/* Tasks list */}
        <ScrollArea className="h-[calc(100%-140px)]">
          <div className="p-4">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Chargement...
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Aucune tâche pour le moment</p>
                <p className="text-sm mt-1">Clique sur "Nouvelle tâche" pour commencer</p>
              </div>
            ) : (
              <>
                {renderSection(
                  "En retard",
                  overdueTasks,
                  <AlertTriangle className="w-4 h-4 text-red-500" />,
                  "text-red-600"
                )}
                {renderSection(
                  "Cette semaine",
                  thisWeekTasks,
                  <CalendarDays className="w-4 h-4 text-primary" />
                )}
                {renderSection(
                  "À venir",
                  upcomingTasks,
                  <Clock className="w-4 h-4 text-muted-foreground" />
                )}
                {renderSection(
                  "Terminées",
                  doneTasks,
                  <CheckSquare className="w-4 h-4 text-green-500" />,
                  "text-muted-foreground"
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Dialogs */}
      <TaskFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        task={selectedTask}
        subjects={subjects}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />

      <ScheduleTaskDialog
        open={scheduleDialogOpen}
        onOpenChange={setScheduleDialogOpen}
        task={taskToSchedule}
        onSchedule={handleScheduleTask}
      />
    </>
  );
};
