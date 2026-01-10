import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCreateFlashcard } from "@/hooks/useFlashcards";
import { toast } from "sonner";

const formSchema = z.object({
  front: z.string().min(1, "Le recto est requis"),
  back: z.string().min(1, "Le verso est requis"),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateFlashcardDialogProps {
  deckId: string;
}

export function CreateFlashcardDialog({ deckId }: CreateFlashcardDialogProps) {
  const [open, setOpen] = useState(false);
  const createFlashcard = useCreateFlashcard();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      front: "",
      back: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await createFlashcard.mutateAsync({
        deck_id: deckId,
        front: values.front,
        back: values.back,
      });
      form.reset();
      // Keep dialog open for quick card creation
    } catch (error) {
      toast.error("Erreur lors de la création");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une carte
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouvelle flashcard</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="front"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recto (Question)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="La question ou le terme à apprendre..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="back"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verso (Réponse)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="La réponse ou la définition..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Fermer
              </Button>
              <Button type="submit" disabled={createFlashcard.isPending}>
                {createFlashcard.isPending ? "Ajout..." : "Ajouter"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
