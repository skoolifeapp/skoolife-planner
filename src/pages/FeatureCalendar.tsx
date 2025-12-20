import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import calendarScreenshot from '@/assets/calendar-screenshot.png';

// Static Calendar Card Component - Using screenshot image
const StaticCalendarCard = () => (
  <div className="rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-border/20">
    <img 
      src={calendarScreenshot} 
      alt="Interface calendrier Skoolife" 
      className="w-full h-auto"
    />
  </div>
);

const FeatureCalendar = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-5 md:left-10 w-48 md:w-72 h-48 md:h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute top-40 right-5 md:right-20 w-64 md:w-96 h-64 md:h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-soft delay-1000" />
      </div>

      {/* Hero Section */}
      <main className="relative pt-24 md:pt-32">
        <div className="max-w-5xl mx-auto px-4 text-center">
          {/* Main heading */}
          <div className="space-y-4 md:space-y-6 mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight font-heading">
              Calendrier
              <br />
              <span className="gradient-text-animated font-heading">
                Intelligent
              </span>
            </h1>
          </div>

          {/* Description */}
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Planifie tes sessions de révisions avec une planification intelligente. 
            Suis les échéances, gère ton calendrier académique et reçois des rappels 
            intelligents pour optimiser ta routine d'apprentissage.
          </p>

          {/* CTA Button */}
          <div>
            <Link to="/auth?mode=signup">
              <Button variant="outline" size="lg" className="rounded-full px-6">
                Commencer à organiser tes études
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Static Calendar Preview */}
        <div className="relative max-w-6xl mx-auto px-4 mt-16 pb-16">
          <div>
            <StaticCalendarCard />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FeatureCalendar;
