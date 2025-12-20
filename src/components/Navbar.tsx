import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.png';

const Navbar = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isPricing = location.pathname === '/pricing';

  // Build anchor links: use hash directly on home page, otherwise prefix with /
  const featuresLink = isHome ? '#fonctionnalites' : '/#fonctionnalites';
  const aboutLink = isHome ? '#a-propos' : '/#a-propos';

  return (
    <header className="fixed left-0 right-0 z-50 top-0 flex justify-center px-4 py-4">
      <nav className="flex items-center gap-2 px-3 py-2 bg-white/95 dark:bg-card/95 backdrop-blur-md rounded-full border border-border/50 shadow-lg">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity px-2">
          <img src={logo} alt="Skoolife" className="w-8 h-8 rounded-xl" />
          <span className="text-lg font-bold text-foreground font-heading">Skoolife</span>
        </Link>
        
        {/* Navigation Links - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-1 ml-4">
          <Link 
            to="/pricing" 
            className={`px-3 py-1.5 text-sm transition-colors rounded-full ${
              isPricing 
                ? 'text-foreground font-medium bg-muted/50' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            Tarifs
          </Link>
          <a 
            href={featuresLink} 
            className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted/50"
          >
            Fonctionnalités
          </a>
          <a 
            href={aboutLink} 
            className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted/50"
          >
            À propos
          </a>
        </div>
        
        {/* CTA Button */}
        <Link to="/auth" className="ml-2">
          <Button variant="default" size="sm" className="rounded-full text-xs md:text-sm px-4">
            Se connecter
          </Button>
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;
