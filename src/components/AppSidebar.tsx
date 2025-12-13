import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Calendar, TrendingUp, GraduationCap, Settings, LogOut, Menu, X, User, Video, Sparkles } from 'lucide-react';
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
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const isActive = (path: string) => {
    if (path === '/app') {
      return location.pathname === '/app' || location.pathname === '/';
    }
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 flex-col bg-gradient-to-b from-card via-card to-secondary/30 border-r border-border/50 z-50">
        {/* Logo Section */}
        <div className="p-6 pb-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img src={logo} alt="Skoolife" className="h-11 w-auto rounded-2xl shadow-md group-hover:shadow-lg transition-shadow duration-300" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-card animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-foreground font-heading tracking-tight">Skoolife</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Student planner</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1.5">
          {NAV_ITEMS.map((item, index) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "group relative flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300",
                isActive(item.path)
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground hover:translate-x-1"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={cn(
                "flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300",
                isActive(item.path)
                  ? "bg-primary-foreground/20"
                  : "bg-transparent group-hover:bg-primary/10"
              )}>
                <item.icon className={cn(
                  "w-5 h-5 transition-transform duration-300",
                  isActive(item.path) ? "" : "group-hover:scale-110"
                )} />
              </div>
              <span className="font-medium">{item.label}</span>
              {isActive(item.path) && (
                <div className="absolute right-3 w-2 h-2 bg-primary-foreground rounded-full animate-pulse" />
              )}
            </Link>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 space-y-4">
          {/* Quick Actions */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-foreground uppercase tracking-wide">Actions rapides</span>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <a
                href="https://chat.whatsapp.com/KZaZ5cmGBoM60V5Qmqned5?mode=hqrc"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 transition-all duration-300 hover:scale-105"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#25D366]" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/profile')}
                className="w-10 h-10 rounded-xl bg-primary/10 hover:bg-primary/20 transition-all duration-300 hover:scale-105"
              >
                <User className="w-5 h-5 text-primary" />
              </Button>
            </div>
          </div>

          {/* Demo Button */}
          <a
            href="https://calendly.com/skoolife-co/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-center gap-2 text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 rounded-xl py-5"
            >
              <Video className="w-4 h-4" />
              <span>Réserver une démo</span>
            </Button>
          </a>

          {/* Logout */}
          <Button
            variant="ghost"
            className="w-full justify-center gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300 rounded-xl py-5"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border/50 px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logo} alt="Skoolife" className="h-9 w-auto rounded-xl shadow-sm" />
          <span className="font-bold text-lg text-foreground font-heading">Skoolife</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href="https://chat.whatsapp.com/KZaZ5cmGBoM60V5Qmqned5?mode=hqrc"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#25D366]" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/profile')}
            className="w-9 h-9 rounded-xl bg-primary/10 hover:bg-primary/20"
          >
            <User className="w-4 h-4 text-primary" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background/98 backdrop-blur-md pt-16 animate-fade-in">
          <nav className="p-6 space-y-2">
            {NAV_ITEMS.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300",
                  isActive(item.path)
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "text-muted-foreground hover:bg-secondary"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-xl",
                  isActive(item.path) ? "bg-primary-foreground/20" : "bg-primary/10"
                )}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-lg font-medium">{item.label}</span>
              </Link>
            ))}
            
            <div className="pt-6 mt-6 border-t border-border">
              <Button
                variant="ghost"
                className="w-full justify-start gap-4 px-5 py-4 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-2xl"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSignOut();
                }}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-destructive/10">
                  <LogOut className="w-5 h-5" />
                </div>
                <span className="text-lg font-medium">Déconnexion</span>
              </Button>
            </div>
          </nav>
        </div>
      )}

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default AppSidebar;
