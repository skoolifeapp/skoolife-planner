import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, addWeeks, addDays, isBefore, isEqual } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const EVENT_TYPES = [
  { value: 'cours', label: 'Cours' },
  { value: 'travail', label: 'Travail' },
  { value: 'perso', label: 'Personnel' },
  { value: 'revision_libre', label: 'Révision libre' },
  { value: 'autre', label: 'Autre' },
];

const formSchema = z.object({
  title: z.string().min(1, 'Le titre est obligatoire').max(100, 'Le titre est trop long'),
  event_type: z.string().min(1, 'Sélectionne un type'),
  date: z.date({ required_error: 'La date est obligatoire' }),
  start_time: z.string().min(1, 'L\'heure de début est obligatoire'),
  end_time: z.string().min(1, 'L\'heure de fin est obligatoire'),
  recurrence: z.enum(['none', 'weekly']),
  recurrence_end_date: z.date().optional().nullable(),
  is_blocking: z.boolean(),
}).refine((data) => {
  if (data.start_time && data.end_time) {
    return data.start_time < data.end_time;
  }
  return true;
}, {
  message: "L'heure de fin doit être après l'heure de début",
  path: ['end_time'],
}).refine((data) => {
  if (data.recurrence === 'weekly' && data.recurrence_end_date) {
    return !isBefore(data.recurrence_end_date, data.date);
  }
  return true;
}, {
  message: "La date de fin de récurrence doit être après la date de début",
  path: ['recurrence_end_date'],
});

type FormValues = z.infer<typeof formSchema>;

interface AddEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEventAdded: () => void;
}

const AddEventDialog = ({ open, onOpenChange, onEventAdded }: AddEventDialogProps) => {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      event_type: 'autre',
      start_time: '09:00',
      end_time: '10:30',
      recurrence: 'none',
      recurrence_end_date: null,
      is_blocking: true,
    },
  });

  const recurrence = form.watch('recurrence');

  const onSubmit = async (values: FormValues) => {
    if (!user) return;

    setSaving(true);

    try {
      const eventsToInsert: {
        user_id: string;
        title: string;
        event_type: string;
        start_datetime: string;
        end_datetime: string;
        source: string;
        is_blocking: boolean;
      }[] = [];

      const createEventForDate = (date: Date, source: string) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return {
          user_id: user.id,
          title: values.title,
          event_type: values.event_type,
          start_datetime: `${dateStr}T${values.start_time}:00`,
          end_datetime: `${dateStr}T${values.end_time}:00`,
          source,
          is_blocking: values.is_blocking,
        };
      };

      if (values.recurrence === 'none') {
        eventsToInsert.push(createEventForDate(values.date, 'manual'));
      } else if (values.recurrence === 'weekly') {
        // Generate weekly events
        let currentDate = values.date;
        const endDate = values.recurrence_end_date || addWeeks(values.date, 12); // Default 12 weeks if no end date

        while (isBefore(currentDate, endDate) || isEqual(currentDate, endDate)) {
          eventsToInsert.push(createEventForDate(currentDate, 'manual_recurring'));
          currentDate = addWeeks(currentDate, 1);
        }
      }

      const { error } = await supabase
        .from('calendar_events')
        .insert(eventsToInsert);

      if (error) throw error;

      const count = eventsToInsert.length;
      toast.success(
        count === 1 
          ? 'Évènement ajouté à ton planning' 
          : `${count} évènements ajoutés à ton planning`
      );

      form.reset();
      onOpenChange(false);
      onEventAdded();
    } catch (err) {
      console.error('Error adding event:', err);
      toast.error('Erreur lors de l\'ajout de l\'évènement');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un évènement</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre de l'évènement</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Cours de compta, Job étudiant..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Event Type */}
            <FormField
              control={form.control}
              name="event_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type d'évènement</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionne un type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EVENT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP', { locale: fr })
                          ) : (
                            <span>Choisis une date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Time inputs */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure de début</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure de fin</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Recurrence */}
            <FormField
              control={form.control}
              name="recurrence"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Récurrence</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="none" id="none" />
                        <Label htmlFor="none" className="font-normal cursor-pointer">
                          Aucune (une seule fois)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="weekly" id="weekly" />
                        <Label htmlFor="weekly" className="font-normal cursor-pointer">
                          Toutes les semaines (même jour, même heure)
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Recurrence end date */}
            {recurrence === 'weekly' && (
              <FormField
                control={form.control}
                name="recurrence_end_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Jusqu'à quelle date ?</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP', { locale: fr })
                            ) : (
                              <span>Choisis une date de fin (optionnel)</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          initialFocus
                          className="p-3 pointer-events-auto"
                          disabled={(date) => {
                            const formDate = form.getValues('date');
                            return formDate ? isBefore(date, formDate) : false;
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <p className="text-xs text-muted-foreground">
                      Si non renseigné, les évènements seront créés sur 12 semaines.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Is blocking */}
            <FormField
              control={form.control}
              name="is_blocking"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="cursor-pointer">
                      Bloquer ce créneau pour le planning de révisions
                    </FormLabel>
                    <p className="text-xs text-muted-foreground">
                      L'IA évitera de placer des sessions de révision sur ce créneau.
                    </p>
                  </div>
                </FormItem>
              )}
            />

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button type="submit" className="flex-1" disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Enregistrer
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventDialog;
