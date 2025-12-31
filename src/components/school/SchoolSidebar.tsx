import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Cloud,
  Users,
  AlertTriangle,
  Send,
  CalendarDays,
  LogOut,
  GraduationCap,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  {
    title: "Tableau de Bord",
    href: "/school",
    icon: LayoutDashboard,
  },
  {
    title: "Météo de la Promo",
    href: "/school/weather",
    icon: Cloud,
  },
  {
    title: "Gestion des Classes",
    href: "/school/classes",
    icon: CalendarDays,
  },
  {
    title: "Étudiants",
    href: "/school/students",
    icon: Users,
  },
  {
    title: "Diffusion",
    href: "/school/broadcast",
    icon: Send,
  },
];

export default function SchoolSidebar() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#1A1A1A] text-white flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-[#1A1A1A]" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Skoolife</h1>
            <p className="text-xs text-white/60">Espace École</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === "/school"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-yellow-400 text-[#1A1A1A]"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.title}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 space-y-4">
        {/* Back to Student App */}
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-white/70 hover:text-white hover:bg-white/10"
          onClick={() => navigate("/app")}
        >
          <ChevronLeft className="w-5 h-5" />
          Retour à l'app
        </Button>

        {/* Theme Toggle & Logout */}
        <div className="flex items-center justify-between">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
          <div className="w-10 h-10 rounded-full bg-yellow-400/20 flex items-center justify-center">
            <span className="text-sm font-bold text-yellow-400">DP</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Directeur Pédagogique</p>
            <p className="text-xs text-white/50 truncate">admin@ecole.fr</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
