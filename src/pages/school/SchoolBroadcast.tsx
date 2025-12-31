import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Send, Paperclip, Bell, FileText, Clock, Users, X } from "lucide-react";
import { toast } from "sonner";

// Mock classes data
const classesData = [
  { id: "m1-finance", name: "M1 Finance", students: 28 },
  { id: "m2-marketing", name: "M2 Marketing", students: 24 },
  { id: "l3-droit", name: "L3 Droit", students: 32 },
  { id: "m1-rh", name: "M1 RH", students: 22 },
];

// Mock previous broadcasts
const previousBroadcasts = [
  {
    id: 1,
    title: "Rappel examens de fin de semestre",
    message: "Les examens débutent le 15 janvier. Pensez à bien vous organiser !",
    classes: ["M1 Finance", "M2 Marketing"],
    sentAt: "2024-01-20T10:30:00",
    hasAttachment: false,
  },
  {
    id: 2,
    title: "Nouveau cours disponible",
    message: "Le PDF du cours de Macroéconomie est disponible.",
    classes: ["M1 Finance"],
    sentAt: "2024-01-18T14:00:00",
    hasAttachment: true,
  },
  {
    id: 3,
    title: "Changement de salle",
    message: "Le cours de Marketing Digital aura lieu en salle B204.",
    classes: ["M2 Marketing"],
    sentAt: "2024-01-15T09:00:00",
    hasAttachment: false,
  },
];

export default function SchoolBroadcast() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [sending, setSending] = useState(false);

  const handleClassToggle = (classId: string) => {
    setSelectedClasses((prev) =>
      prev.includes(classId) ? prev.filter((c) => c !== classId) : [...prev, classId]
    );
  };

  const handleSelectAll = () => {
    if (selectedClasses.length === classesData.length) {
      setSelectedClasses([]);
    } else {
      setSelectedClasses(classesData.map((c) => c.id));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
  };

  const handleSend = async () => {
    if (!title.trim() || !message.trim() || selectedClasses.length === 0) {
      toast.error("Veuillez remplir tous les champs et sélectionner au moins une classe");
      return;
    }

    setSending(true);
    // Simulate sending
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSending(false);

    toast.success("Notification envoyée avec succès !");

    // Reset form
    setTitle("");
    setMessage("");
    setSelectedClasses([]);
    setAttachment(null);
  };

  const totalRecipients = selectedClasses.reduce((acc, classId) => {
    const cls = classesData.find((c) => c.id === classId);
    return acc + (cls?.students || 0);
  }, 0);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Diffusion</h1>
        <p className="text-muted-foreground mt-1">
          Envoyez des notifications et fichiers aux étudiants
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compose Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Nouvelle Notification
              </CardTitle>
              <CardDescription>
                Composez votre message et sélectionnez les destinataires
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Titre de la notification</Label>
                <Input
                  id="title"
                  placeholder="Ex: Rappel important..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Rédigez votre message ici..."
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              {/* Attachment */}
              <div className="space-y-2">
                <Label>Pièce jointe (optionnel)</Label>
                {attachment ? (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="flex-1 text-sm truncate">{attachment.name}</span>
                    <Button variant="ghost" size="icon" onClick={handleRemoveAttachment}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                    />
                    <Button variant="outline" className="w-full gap-2">
                      <Paperclip className="w-4 h-4" />
                      Joindre un fichier
                    </Button>
                  </div>
                )}
              </div>

              {/* Class Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Destinataires</Label>
                  <Button variant="ghost" size="sm" onClick={handleSelectAll}>
                    {selectedClasses.length === classesData.length
                      ? "Désélectionner tout"
                      : "Sélectionner tout"}
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {classesData.map((cls) => (
                    <div
                      key={cls.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedClasses.includes(cls.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted"
                      }`}
                      onClick={() => handleClassToggle(cls.id)}
                    >
                      <Checkbox checked={selectedClasses.includes(cls.id)} />
                      <div>
                        <p className="font-medium text-sm">{cls.name}</p>
                        <p className="text-xs text-muted-foreground">{cls.students} étudiants</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary & Send */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>
                    {totalRecipients} destinataire{totalRecipients > 1 ? "s" : ""}
                  </span>
                </div>
                <Button
                  onClick={handleSend}
                  disabled={sending || selectedClasses.length === 0}
                  className="gap-2"
                >
                  {sending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Envoyer la notification
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Previous Broadcasts */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="w-5 h-5 text-muted-foreground" />
                Historique
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {previousBroadcasts.map((broadcast) => (
                <div
                  key={broadcast.id}
                  className="p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-sm line-clamp-1">{broadcast.title}</h4>
                    {broadcast.hasAttachment && (
                      <Paperclip className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {broadcast.message}
                  </p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {broadcast.classes.map((cls) => (
                      <Badge key={cls} variant="secondary" className="text-[10px]">
                        {cls}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2">
                    {formatDate(broadcast.sentAt)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
