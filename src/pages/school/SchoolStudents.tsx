import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, Mail, User, AlertTriangle, TrendingDown, CheckCircle } from "lucide-react";

// Mock students data
const studentsData = [
  {
    id: 1,
    firstName: "Thomas",
    lastName: "Dupuis",
    email: "thomas.dupuis@ecole.fr",
    class: "M1 Finance",
    status: "at_risk",
    lastConnection: "2024-01-15",
    sessionsThisWeek: 0,
    mentalLoad: 8,
  },
  {
    id: 2,
    firstName: "Marie",
    lastName: "Lambert",
    email: "marie.lambert@ecole.fr",
    class: "M2 Marketing",
    status: "declining",
    lastConnection: "2024-01-20",
    sessionsThisWeek: 2,
    mentalLoad: 7,
  },
  {
    id: 3,
    firstName: "Lucas",
    lastName: "Martin",
    email: "lucas.martin@ecole.fr",
    class: "L3 Droit",
    status: "active",
    lastConnection: "2024-01-22",
    sessionsThisWeek: 8,
    mentalLoad: 5,
  },
  {
    id: 4,
    firstName: "Emma",
    lastName: "Bernard",
    email: "emma.bernard@ecole.fr",
    class: "M1 Finance",
    status: "active",
    lastConnection: "2024-01-22",
    sessionsThisWeek: 12,
    mentalLoad: 6,
  },
  {
    id: 5,
    firstName: "Hugo",
    lastName: "Petit",
    email: "hugo.petit@ecole.fr",
    class: "M1 RH",
    status: "declining",
    lastConnection: "2024-01-19",
    sessionsThisWeek: 3,
    mentalLoad: 6,
  },
  {
    id: 6,
    firstName: "Léa",
    lastName: "Moreau",
    email: "lea.moreau@ecole.fr",
    class: "M2 Marketing",
    status: "active",
    lastConnection: "2024-01-22",
    sessionsThisWeek: 15,
    mentalLoad: 4,
  },
  {
    id: 7,
    firstName: "Antoine",
    lastName: "Leroy",
    email: "antoine.leroy@ecole.fr",
    class: "L3 Droit",
    status: "at_risk",
    lastConnection: "2024-01-10",
    sessionsThisWeek: 0,
    mentalLoad: 9,
  },
  {
    id: 8,
    firstName: "Camille",
    lastName: "Roux",
    email: "camille.roux@ecole.fr",
    class: "M1 RH",
    status: "active",
    lastConnection: "2024-01-21",
    sessionsThisWeek: 7,
    mentalLoad: 5,
  },
];

const classes = ["Toutes", "M1 Finance", "M2 Marketing", "L3 Droit", "M1 RH"];
const statuses = ["Tous", "Actif", "En baisse", "À risque"];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return (
        <Badge className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20">
          <CheckCircle className="w-3 h-3 mr-1" />
          Actif
        </Badge>
      );
    case "declining":
      return (
        <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20">
          <TrendingDown className="w-3 h-3 mr-1" />
          En baisse
        </Badge>
      );
    case "at_risk":
      return (
        <Badge className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20">
          <AlertTriangle className="w-3 h-3 mr-1" />
          À risque
        </Badge>
      );
    default:
      return null;
  }
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  return date.toLocaleDateString("fr-FR");
};

export default function SchoolStudents() {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("Toutes");
  const [statusFilter, setStatusFilter] = useState("Tous");

  const filteredStudents = studentsData.filter((student) => {
    const matchesSearch =
      student.firstName.toLowerCase().includes(search.toLowerCase()) ||
      student.lastName.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase());

    const matchesClass = classFilter === "Toutes" || student.class === classFilter;

    const matchesStatus =
      statusFilter === "Tous" ||
      (statusFilter === "Actif" && student.status === "active") ||
      (statusFilter === "En baisse" && student.status === "declining") ||
      (statusFilter === "À risque" && student.status === "at_risk");

    return matchesSearch && matchesClass && matchesStatus;
  });

  // Stats
  const atRiskCount = studentsData.filter((s) => s.status === "at_risk").length;
  const decliningCount = studentsData.filter((s) => s.status === "declining").length;
  const activeCount = studentsData.filter((s) => s.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Étudiants</h1>
        <p className="text-muted-foreground mt-1">Suivi individuel et détection de décrochage</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-500/5 border-green-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Étudiants Actifs</p>
                <p className="text-2xl font-bold text-green-500">{activeCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-500/5 border-orange-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En Baisse</p>
                <p className="text-2xl font-bold text-orange-500">{decliningCount}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-orange-500/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-500/5 border-red-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">À Risque</p>
                <p className="text-2xl font-bold text-red-500">{atRiskCount}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un étudiant..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Classe" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Étudiants ({filteredStudents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Étudiant</TableHead>
                <TableHead>Classe</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dernière connexion</TableHead>
                <TableHead>Sessions/semaine</TableHead>
                <TableHead>Charge mentale</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-medium text-primary">
                          {student.firstName[0]}
                          {student.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{student.class}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(student.status)}</TableCell>
                  <TableCell>
                    <span
                      className={
                        student.status === "at_risk" ? "text-red-500 font-medium" : "text-muted-foreground"
                      }
                    >
                      {formatDate(student.lastConnection)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={student.sessionsThisWeek === 0 ? "text-red-500" : ""}>
                      {student.sessionsThisWeek}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            student.mentalLoad >= 8
                              ? "bg-red-500"
                              : student.mentalLoad >= 6
                              ? "bg-orange-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${student.mentalLoad * 10}%` }}
                        />
                      </div>
                      <span className="text-sm">{student.mentalLoad}/10</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <User className="w-4 h-4 mr-2" />
                          Voir le profil
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="w-4 h-4 mr-2" />
                          Contacter
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
