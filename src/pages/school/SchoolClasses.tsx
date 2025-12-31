import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, BookOpen, Clock, Plus, ChevronRight } from "lucide-react";

// Mock classes data
const classesData = [
  {
    id: "m1-finance",
    name: "M1 Finance",
    students: 28,
    activeRate: 92,
    avgLoad: 6.5,
    nextExam: "2024-01-28",
    examSubject: "Comptabilité Avancée",
    weeklyHours: 24,
    color: "#facc15",
  },
  {
    id: "m2-marketing",
    name: "M2 Marketing",
    students: 24,
    activeRate: 88,
    avgLoad: 7.2,
    nextExam: "2024-01-25",
    examSubject: "Marketing Digital",
    weeklyHours: 22,
    color: "#3b82f6",
  },
  {
    id: "l3-droit",
    name: "L3 Droit",
    students: 32,
    activeRate: 85,
    avgLoad: 8.1,
    nextExam: "2024-02-01",
    examSubject: "Droit des Contrats",
    weeklyHours: 28,
    color: "#10b981",
  },
  {
    id: "m1-rh",
    name: "M1 RH",
    students: 22,
    activeRate: 78,
    avgLoad: 5.4,
    nextExam: "2024-01-30",
    examSubject: "Gestion des Talents",
    weeklyHours: 20,
    color: "#f97316",
  },
];

// Mock upcoming events
const upcomingEvents = [
  {
    id: 1,
    title: "Examen Comptabilité",
    class: "M1 Finance",
    date: "2024-01-28",
    time: "09:00 - 12:00",
    type: "exam",
  },
  {
    id: 2,
    title: "Partiel Marketing Digital",
    class: "M2 Marketing",
    date: "2024-01-25",
    time: "14:00 - 17:00",
    type: "exam",
  },
  {
    id: 3,
    title: "Conférence Invité",
    class: "L3 Droit",
    date: "2024-01-24",
    time: "10:00 - 12:00",
    type: "event",
  },
  {
    id: 4,
    title: "Workshop CV",
    class: "M1 RH",
    date: "2024-01-26",
    time: "09:00 - 11:00",
    type: "workshop",
  },
];

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return "Demain";
  if (diffDays < 7) return `Dans ${diffDays} jours`;
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
};

const getEventTypeStyle = (type: string) => {
  switch (type) {
    case "exam":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    case "event":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case "workshop":
      return "bg-purple-500/10 text-purple-500 border-purple-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/20";
  }
};

export default function SchoolClasses() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des Classes</h1>
          <p className="text-muted-foreground mt-1">Calendrier partagé et suivi par classe</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Ajouter un événement
        </Button>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {classesData.map((cls) => (
          <Card
            key={cls.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedClass === cls.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setSelectedClass(selectedClass === cls.id ? null : cls.id)}
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${cls.color}20` }}
                  >
                    <BookOpen className="w-6 h-6" style={{ color: cls.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{cls.name}</h3>
                    <p className="text-sm text-muted-foreground">{cls.students} étudiants</p>
                  </div>
                </div>
                <ChevronRight
                  className={`w-5 h-5 text-muted-foreground transition-transform ${
                    selectedClass === cls.id ? "rotate-90" : ""
                  }`}
                />
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <p className="text-xl font-bold text-green-500">{cls.activeRate}%</p>
                  <p className="text-[10px] text-muted-foreground">Activation</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <p
                    className={`text-xl font-bold ${
                      cls.avgLoad >= 7 ? "text-red-500" : cls.avgLoad >= 5 ? "text-orange-500" : "text-green-500"
                    }`}
                  >
                    {cls.avgLoad}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Charge /10</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <p className="text-xl font-bold">{cls.weeklyHours}h</p>
                  <p className="text-[10px] text-muted-foreground">Cours/sem</p>
                </div>
              </div>

              {/* Next Exam Info */}
              <div className="mt-4 p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium">Prochain examen</span>
                </div>
                <p className="text-sm mt-1">{cls.examSubject}</p>
                <p className="text-xs text-muted-foreground">{formatDate(cls.nextExam)}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Événements à Venir
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[50px]">
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.date).toLocaleDateString("fr-FR", { weekday: "short" })}
                    </p>
                    <p className="text-xl font-bold">{new Date(event.date).getDate()}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.date).toLocaleDateString("fr-FR", { month: "short" })}
                    </p>
                  </div>
                  <div className="h-12 w-px bg-border" />
                  <div>
                    <h4 className="font-medium">{event.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {event.class}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {event.time}
                      </span>
                    </div>
                  </div>
                </div>
                <Badge className={getEventTypeStyle(event.type)}>
                  {event.type === "exam" ? "Examen" : event.type === "event" ? "Événement" : "Workshop"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
