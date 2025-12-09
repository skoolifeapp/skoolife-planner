import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Calendar, TrendingUp, GraduationCap, Settings, LogOut, Menu, X } from 'lucide-react';
import logo from '@/assets/logo.png';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { path: '/app', label: 'Planning', icon: Calendar },
  { path: '/progression', label: 'Progression', icon: TrendingUp },
  { path: '/subjects', label: 'Matières', icon: GraduationCap },
  { path: '/settings', label: 'Paramètres', icon: Settings },
];

interface AppSidebarProps {
  children: React.ReactNode;
}

export const AppSidebar = ({ children }: AppSidebarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 flex-col bg-card border-r border-border p-6 z-50">
        <NavLink to="/" className="flex items-center gap-3 mb-10">
          <img src={logo} alt="Skoolife" className="h-9 w-auto" />
          <span className="font-bold text-xl text-foreground">Skoolife</span>
        </NavLink>

        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/app'}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-secondary/50"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="pt-6 border-t border-border space-y-3">
          <ThemeToggle />
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2">
          <img src={logo} alt="Skoolife" className="h-8 w-auto" />
          <span className="font-bold text-lg text-foreground">Skoolife</span>
        </NavLink>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-sm pt-16 animate-fade-in">
          <nav className="p-4 space-y-2">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/app'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-secondary/50"
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="text-lg">{item.label}</span>
              </NavLink>
            ))}
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-4 py-4 text-muted-foreground hover:text-foreground"
              onClick={() => {
                setMobileMenuOpen(false);
                handleSignOut();
              }}
            >
              <LogOut className="w-5 h-5" />
              <span className="text-lg">Déconnexion</span>
            </Button>
          </nav>
        </div>
      )}

      {/* Main content with transition */}
      <main className="lg:ml-64 min-h-screen transition-opacity duration-200">
        {children}
      </main>
    </div>
  );
};

export default AppSidebar;
