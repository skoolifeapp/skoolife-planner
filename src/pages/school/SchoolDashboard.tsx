import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Brain, AlertTriangle, TrendingUp, BookOpen, Calendar } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

// Mock data for activity chart
const activityData = [
  { name: "Sem 1", sessions: 120, exams: 2 },
  { name: "Sem 2", sessions: 145, exams: 1 },
  { name: "Sem 3", sessions: 180, exams: 3 },
  { name: "Sem 4", sessions: 210, exams: 5 },
  { name: "Sem 5", sessions: 165, exams: 2 },
  { name: "Sem 6", sessions: 195, exams: 4 },
  { name: "Sem 7", sessions: 220, exams: 6 },
  { name: "Sem 8", sessions: 175, exams: 3 },
];

// Mock data for recent alerts
const recentAlerts = [
  { student: "Thomas Dupuis", class: "M1 Finance", issue: "Inactif depuis 8 jours", severity: "high" },
  { student: "Marie Lambert", class: "M2 Marketing", issue: "Charge mentale élevée", severity: "medium" },
  { student: "Lucas Martin", class: "L3 Droit", issue: "Baisse d'activité", severity: "low" },
];

// Mock data for top classes
const topClasses = [
  { name: "M1 Finance", activation: 92, students: 28 },
  { name: "M2 Marketing", activation: 88, students: 24 },
  { name: "L3 Droit", activation: 85, students: 32 },
  { name: "M1 RH", activation: 78, students: 22 },
];

export default function SchoolDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Tableau de Bord</h1>
        <p className="text-muted-foreground mt-1">Vue d'ensemble de l'activité étudiante</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-yellow-400/10 to-yellow-500/5 border-yellow-400/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taux d'activation</p>
                <p className="text-3xl font-bold text-foreground mt-1">85%</p>
                <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +5% vs semaine dernière
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-400/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-400/10 to-blue-500/5 border-blue-400/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Charge Mentale Moyenne</p>
                <p className="text-3xl font-bold text-foreground mt-1">6.2<span className="text-lg text-muted-foreground">/10</span></p>
                <p className="text-xs text-orange-500 mt-1">Niveau modéré</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-400/20 flex items-center justify-center">
                <Brain className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-400/10 to-red-500/5 border-red-400/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Alertes Décrochage</p>
                <p className="text-3xl font-bold text-foreground mt-1">12</p>
                <p className="text-xs text-red-500 mt-1">Étudiants inactifs 7j+</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-red-400/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-400/10 to-green-500/5 border-green-400/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sessions ce mois</p>
                <p className="text-3xl font-bold text-foreground mt-1">1,247</p>
                <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +12% vs mois dernier
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-400/20 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Activité Mensuelle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#facc15" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#facc15" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="sessions"
                    stroke="#facc15"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorSessions)"
                    name="Sessions d'étude"
                  />
                  <Line
                    type="monotone"
                    dataKey="exams"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ fill: "#ef4444" }}
                    name="Examens"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Top Classes Actives
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topClasses.map((cls, index) => (
              <div key={cls.name} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{cls.name}</p>
                  <p className="text-xs text-muted-foreground">{cls.students} étudiants</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-green-500">{cls.activation}%</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Alertes Récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAlerts.map((alert, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      alert.severity === "high"
                        ? "bg-red-500"
                        : alert.severity === "medium"
                        ? "bg-orange-500"
                        : "bg-yellow-500"
                    }`}
                  />
                  <div>
                    <p className="font-medium text-sm">{alert.student}</p>
                    <p className="text-xs text-muted-foreground">{alert.class}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{alert.issue}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
