import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Cloud, Sun, CloudRain, AlertTriangle, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Mock data for classes
const classes = [
  { id: "all", name: "Toutes les classes" },
  { id: "m1-finance", name: "M1 Finance" },
  { id: "m2-marketing", name: "M2 Marketing" },
  { id: "l3-droit", name: "L3 Droit" },
  { id: "m1-rh", name: "M1 RH" },
];

// Mock heatmap data - weeks x classes
const heatmapData = {
  weeks: ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6", "Sem 7", "Sem 8"],
  classes: [
    {
      name: "M1 Finance",
      data: [3, 5, 7, 9, 6, 4, 8, 5], // 1-10 scale, 10 = max stress
      exams: [0, 1, 2, 3, 1, 0, 2, 1],
    },
    {
      name: "M2 Marketing",
      data: [4, 6, 5, 7, 8, 9, 6, 4],
      exams: [1, 1, 1, 2, 2, 3, 1, 0],
    },
    {
      name: "L3 Droit",
      data: [2, 3, 4, 5, 6, 7, 8, 9],
      exams: [0, 0, 1, 1, 2, 2, 3, 4],
    },
    {
      name: "M1 RH",
      data: [5, 4, 3, 6, 7, 5, 4, 6],
      exams: [1, 0, 0, 2, 2, 1, 0, 1],
    },
  ],
};

// Get color based on stress level
const getStressColor = (level: number) => {
  if (level <= 3) return "bg-green-500";
  if (level <= 5) return "bg-green-400";
  if (level <= 6) return "bg-yellow-400";
  if (level <= 7) return "bg-orange-400";
  if (level <= 8) return "bg-orange-500";
  return "bg-red-500";
};

const getStressLabel = (level: number) => {
  if (level <= 3) return "Calme";
  if (level <= 5) return "Normal";
  if (level <= 6) return "Modéré";
  if (level <= 7) return "Élevé";
  if (level <= 8) return "Intense";
  return "Critique";
};

const getWeatherIcon = (level: number) => {
  if (level <= 4) return <Sun className="w-5 h-5 text-yellow-400" />;
  if (level <= 7) return <Cloud className="w-5 h-5 text-gray-400" />;
  return <CloudRain className="w-5 h-5 text-blue-400" />;
};

export default function SchoolWeather() {
  const [selectedClass, setSelectedClass] = useState("all");

  const filteredClasses =
    selectedClass === "all"
      ? heatmapData.classes
      : heatmapData.classes.filter((c) => c.name.toLowerCase().replace(" ", "-") === selectedClass);

  // Calculate overall stats
  const avgStress =
    heatmapData.classes.reduce((acc, c) => acc + c.data.reduce((a, b) => a + b, 0) / c.data.length, 0) /
    heatmapData.classes.length;

  const criticalWeeks = heatmapData.classes.flatMap((c, classIdx) =>
    c.data
      .map((stress, weekIdx) => ({ class: c.name, week: heatmapData.weeks[weekIdx], stress }))
      .filter((w) => w.stress >= 8)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Météo de la Promo</h1>
          <p className="text-muted-foreground mt-1">Visualisez la charge mentale par classe et par semaine</p>
        </div>
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrer par classe" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((cls) => (
              <SelectItem key={cls.id} value={cls.id}>
                {cls.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              {getWeatherIcon(avgStress)}
              <div>
                <p className="text-sm text-muted-foreground">Charge Moyenne Globale</p>
                <p className="text-2xl font-bold">{avgStress.toFixed(1)}/10</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Semaines Critiques</p>
                <p className="text-2xl font-bold">{criticalWeeks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Info className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Recommandation</p>
                <p className="text-sm font-medium">
                  {criticalWeeks.length > 0 ? "Lisser les examens" : "Charge équilibrée"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground">Légende :</span>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500" />
              <span className="text-sm">Calme (1-3)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-400" />
              <span className="text-sm">Modéré (4-6)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-orange-500" />
              <span className="text-sm">Élevé (7-8)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500" />
              <span className="text-sm">Critique (9-10)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>Heatmap de Charge Mentale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr>
                  <th className="text-left p-3 font-medium text-muted-foreground">Classe</th>
                  {heatmapData.weeks.map((week) => (
                    <th key={week} className="text-center p-3 font-medium text-muted-foreground">
                      {week}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredClasses.map((cls) => (
                  <tr key={cls.name} className="border-t border-border">
                    <td className="p-3 font-medium">{cls.name}</td>
                    {cls.data.map((stress, idx) => (
                      <td key={idx} className="p-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={`w-full h-12 rounded-lg ${getStressColor(
                                stress
                              )} flex items-center justify-center cursor-pointer transition-transform hover:scale-105`}
                            >
                              <span className="text-white font-bold text-sm">{stress}</span>
                              {cls.exams[idx] > 0 && (
                                <Badge
                                  variant="secondary"
                                  className="absolute -top-2 -right-2 text-[10px] bg-background"
                                >
                                  {cls.exams[idx]} exam{cls.exams[idx] > 1 ? "s" : ""}
                                </Badge>
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              <strong>{cls.name}</strong> - {heatmapData.weeks[idx]}
                            </p>
                            <p>Charge: {getStressLabel(stress)}</p>
                            <p>Examens: {cls.exams[idx]}</p>
                          </TooltipContent>
                        </Tooltip>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Critical Weeks Alert */}
      {criticalWeeks.length > 0 && (
        <Card className="border-red-500/50 bg-red-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-500">
              <AlertTriangle className="w-5 h-5" />
              Alertes de Surcharge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {criticalWeeks.map((week, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-background">
                  <div>
                    <p className="font-medium">{week.class}</p>
                    <p className="text-sm text-muted-foreground">{week.week}</p>
                  </div>
                  <Badge variant="destructive">Charge {week.stress}/10</Badge>
                </div>
              ))}
              <p className="text-sm text-muted-foreground mt-4">
                💡 Conseil : Envisagez de décaler certains examens pour ces semaines critiques.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
