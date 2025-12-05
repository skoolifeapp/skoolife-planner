import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { format, addDays, startOfWeek, setHours, setMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Task } from '@/types/tasks';

interface ScheduleTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onSchedule: (task: Task, date: Date, startTime: string, endTime: string) => void;
}

const timeSlots = [
  '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
];

export const ScheduleTaskDialog = ({
  open,
  onOpenChange,
  task,
  onSchedule,
}: ScheduleTaskDialogProps) => {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const [selectedDay, setSelectedDay] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('14:00');

  const duration = task?.estimated_duration_minutes || 60;
  
  const calculateEndTime = (start: string, durationMin: number): string => {
    const [h, m] = start.split(':').map(Number);
    const totalMinutes = h * 60 + m + durationMin;
    const endH = Math.floor(totalMinutes / 60);
    const endM = totalMinutes % 60;
    return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
  };

  const endTime = calculateEndTime(startTime, duration);

  const handleSchedule = () => {
    if (!task || !selectedDay) return;
    const dayIndex = parseInt(selectedDay);
    const date = weekDays[dayIndex];
    onSchedule(task, date, startTime, endTime);
    onOpenChange(false);
    setSelectedDay('');
    setStartTime('14:00');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Planifier cette tâche</DialogTitle>
        </DialogHeader>

        {task && (
          <div className="space-y-4">
            <div className="p-3 bg-secondary/50 rounded-lg">
              <p className="font-medium">{task.title}</p>
              {task.subject && (
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: task.subject.color }}
                  />
                  {task.subject.name}
                </p>
              )}
              <p className="text-sm text-muted-foreground mt-1">
                Durée : {duration < 60 ? `${duration}min` : `${Math.floor(duration / 60)}h${duration % 60 > 0 ? duration % 60 : ''}`}
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <Label>Jour</Label>
                <Select onValueChange={setSelectedDay} value={selectedDay}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choisir un jour" />
                  </SelectTrigger>
                  <SelectContent>
                    {weekDays.map((day, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {format(day, 'EEEE d MMMM', { locale: fr })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Heure de début</Label>
                <Select onValueChange={setStartTime} value={startTime}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="p-3 bg-primary/10 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Créneau prévu</p>
                <p className="font-medium text-primary">
                  {startTime} → {endTime}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button onClick={handleSchedule} disabled={!selectedDay}>
                Planifier
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
