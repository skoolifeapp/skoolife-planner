import { useState } from 'react';
import { 
  Calendar, 
  BarChart3, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  Target, 
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Upload,
  TrendingUp,
  Settings,
  GraduationCap,
  RefreshCw
} from 'lucide-react';

interface CardData {
  id: number;
  title: string;
  content: React.ReactNode;
}

const StackedCardsLayout = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const cards: CardData[] = [
    {
      id: 0,
      title: 'Calendrier',
      content: <CalendarCard />,
    },
    {
      id: 1,
      title: 'Progression',
      content: <ProgressionCard />,
    },
    {
      id: 2,
      title: 'Matières',
      content: <MatieresCard />,
    },
  ];

  const getCardStyle = (index: number) => {
    const position = (index - activeIndex + cards.length) % cards.length;
    
    if (position === 0) {
      return {
        zIndex: 30,
        transform: 'translateY(0) translateX(0) scale(1)',
        opacity: 1,
        filter: 'blur(0px)',
      };
    } else if (position === 1) {
      return {
        zIndex: 20,
        transform: 'translateY(-20px) translateX(16px) scale(0.96)',
        opacity: 0.9,
        filter: 'blur(0.5px)',
      };
    } else {
      return {
        zIndex: 10,
        transform: 'translateY(-40px) translateX(32px) scale(0.92)',
        opacity: 0.75,
        filter: 'blur(1px)',
      };
    }
  };

  const handleCardClick = (index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  return (
    <div className="relative w-full max-w-[900px] mx-auto" style={{ perspective: '1200px' }}>
      <div className="relative h-[500px] md:h-[560px]">
        {cards.map((card, index) => {
          const style = getCardStyle(index);
          const isActive = index === activeIndex;
          
          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(index)}
              className={`absolute inset-0 rounded-3xl bg-[#FFFDF8] dark:bg-card border border-border/20 overflow-hidden
                transition-all duration-500 ease-out
                ${!isActive ? 'cursor-pointer hover:opacity-95' : ''}`}
              style={{
                zIndex: style.zIndex,
                transform: style.transform,
                opacity: style.opacity,
                filter: style.filter,
                boxShadow: isActive 
                  ? '0 25px 60px -15px rgba(0, 0, 0, 0.12), 0 10px 30px -8px rgba(0, 0, 0, 0.06)'
                  : '0 15px 40px -12px rgba(0, 0, 0, 0.08)',
              }}
            >
              {card.content}
            </div>
          );
        })}
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {cards.map((card, index) => (
          <button
            key={card.id}
            onClick={() => setActiveIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === activeIndex 
                ? 'bg-primary w-8' 
                : 'bg-border hover:bg-primary/50 w-2'
            }`}
            aria-label={`Voir ${card.title}`}
          />
        ))}
      </div>
    </div>
  );
};

// ===== CALENDAR CARD - EXACT REPLICA =====
const CalendarCard = () => (
  <div className="h-full flex flex-col bg-[#FFFDF8] dark:bg-card">
    {/* Header */}
    <div className="flex items-center justify-between px-6 py-4">
      <h2 className="text-2xl font-bold text-foreground">Semaine du 15 déc.</h2>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-sm">
          <Plus className="w-4 h-4" />
          Ajouter un évènement
        </button>
        <button className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:bg-muted/50 bg-white dark:bg-card">
          <Upload className="w-4 h-4" />
        </button>
        <button className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center text-red-500">
          <Trash2 className="w-4 h-4" />
        </button>
        <button className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:bg-muted/50 bg-white dark:bg-card">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button className="px-5 py-2.5 rounded-full border border-primary/40 text-primary text-sm font-medium bg-white dark:bg-card">
          Aujourd'hui
        </button>
        <button className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:bg-muted/50 bg-white dark:bg-card">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>

    {/* Content */}
    <div className="flex-1 flex px-6 pb-6 gap-4 overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-60 flex flex-col gap-4">
        {/* Stats Card */}
        <div className="p-5 rounded-2xl border border-border/30 bg-white dark:bg-card shadow-sm">
          <p className="text-base font-semibold text-foreground mb-4">Cette semaine</p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground leading-tight">6h</p>
                <p className="text-sm text-muted-foreground">planifiées</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground leading-tight">2</p>
                <p className="text-sm text-muted-foreground">sessions terminées</p>
              </div>
            </div>
          </div>
        </div>

        {/* Exams */}
        <div className="p-5 rounded-2xl border border-border/30 bg-white dark:bg-card shadow-sm flex-1">
          <p className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <Settings className="w-4 h-4 text-muted-foreground" />
            Prochains examens
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="w-3 h-3 rounded-full bg-red-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">FINANCE <span className="text-muted-foreground font-normal">(Partiel)</span></p>
                <p className="text-sm text-muted-foreground">14 janv.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-3 h-3 rounded-full bg-green-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">MCG <span className="text-muted-foreground font-normal">(Partiel)</span></p>
                <p className="text-sm text-muted-foreground">14 janv.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-3 h-3 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">MSI <span className="text-muted-foreground font-normal">(Partiel)</span></p>
                <p className="text-sm text-muted-foreground">16 janv.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-primary text-primary-foreground font-medium shadow-sm">
          <RefreshCw className="w-4 h-4" />
          Générer mon planning
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 rounded-2xl border border-border/30 bg-white dark:bg-card overflow-hidden shadow-sm">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-border/20">
          {[
            { day: 'LUN.', num: '15' },
            { day: 'MAR.', num: '16' },
            { day: 'MER.', num: '17' },
            { day: 'JEU.', num: '18' },
            { day: 'VEN.', num: '19' },
            { day: 'SAM.', num: '20', today: true },
            { day: 'DIM.', num: '21' },
          ].map((d, i) => (
            <div key={i} className={`py-3 text-center border-r border-border/10 last:border-r-0`}>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide">{d.day}</p>
              <p className={`text-xl font-semibold mt-0.5 ${d.today ? 'text-red-500' : 'text-foreground'}`}>{d.num}</p>
            </div>
          ))}
        </div>

        {/* Time Grid */}
        <div className="relative h-[340px] overflow-hidden">
          {/* Hour rows */}
          <div className="h-full">
            {['7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00'].map((time, i) => (
              <div key={i} className="h-[42px] flex border-b border-border/10">
                <div className="w-14 text-right pr-3 pt-0.5 text-xs text-muted-foreground">{time}</div>
                <div className="flex-1 grid grid-cols-7">
                  {[0, 1, 2, 3, 4, 5, 6].map((col) => (
                    <div key={col} className="border-r border-border/10 last:border-r-0" />
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Events overlay */}
          <div className="absolute inset-0 pl-14">
            {/* TEC 535 - Thursday (col 3) 9:00-12:30 */}
            <div 
              className="absolute rounded-lg bg-blue-400 p-2 text-white text-xs overflow-hidden"
              style={{
                left: `calc(3 * 100% / 7 + 2px)`,
                width: `calc(100% / 7 - 4px)`,
                top: '84px',
                height: '147px',
              }}
            >
              <p className="font-semibold truncate">TEC 535 M...</p>
              <p className="opacity-80 text-[10px]">09:00 - 12:30</p>
            </div>
            
            {/* MSI - Saturday (col 5) 9:00-10:00 with checkmark */}
            <div 
              className="absolute rounded-lg bg-green-200 dark:bg-green-800/50 border border-green-300 dark:border-green-700 p-2 text-xs overflow-hidden flex items-start justify-between"
              style={{
                left: `calc(5 * 100% / 7 + 2px)`,
                width: `calc(100% / 7 - 4px)`,
                top: '84px',
                height: '42px',
              }}
            >
              <div>
                <p className="font-semibold text-green-700 dark:text-green-300">MSI</p>
                <p className="text-green-600 dark:text-green-400 text-[10px]">09:00 - 10:00</p>
              </div>
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            
            {/* Cours d'arabe - Sunday (col 6) 9:00-12:00 */}
            <div 
              className="absolute rounded-lg bg-yellow-400 p-2 text-white text-xs overflow-hidden"
              style={{
                left: `calc(6 * 100% / 7 + 2px)`,
                width: `calc(100% / 7 - 4px)`,
                top: '84px',
                height: '126px',
              }}
            >
              <p className="font-semibold truncate">Cours d'ara...</p>
              <p className="opacity-80 text-[10px]">09:00 - 12:00</p>
            </div>
            
            {/* TEC 535 - Thursday (col 3) 13:30-17:00 */}
            <div 
              className="absolute rounded-lg bg-blue-400 p-2 text-white text-xs overflow-hidden"
              style={{
                left: `calc(3 * 100% / 7 + 2px)`,
                width: `calc(100% / 7 - 4px)`,
                top: '273px',
                height: '60px',
              }}
            >
              <p className="font-semibold truncate">TEC 535 M...</p>
              <p className="opacity-80 text-[10px]">13:30 - 17:00</p>
            </div>
            
            {/* FINANCE - Saturday (col 5) 14:00-16:00 */}
            <div 
              className="absolute rounded-lg bg-red-400 p-2 text-white text-xs overflow-hidden"
              style={{
                left: `calc(5 * 100% / 7 + 2px)`,
                width: `calc(100% / 7 - 4px)`,
                top: '294px',
                height: '42px',
              }}
            >
              <p className="font-semibold">FINANCE</p>
              <p className="opacity-80 text-[10px]">14:00 - 16:00</p>
            </div>
            
            {/* Current time indicator - Saturday around 11:30 */}
            <div 
              className="absolute h-0.5 bg-red-500"
              style={{
                left: `calc(5 * 100% / 7)`,
                width: `calc(100% / 7)`,
                top: '189px',
              }}
            >
              <div className="absolute -left-1.5 -top-1.5 w-3 h-3 rounded-full bg-red-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ===== PROGRESSION CARD - EXACT REPLICA =====
const ProgressionCard = () => (
  <div className="h-full flex flex-col bg-[#FFFDF8] dark:bg-card">
    {/* Header */}
    <div className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Tableau de Bord des Progrès</h2>
      </div>
      <div className="flex items-center gap-1">
        <button className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground bg-white dark:bg-card">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm text-foreground px-4 py-2 border border-border/50 rounded-full bg-white dark:bg-card">Cette semaine</span>
        <button className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground bg-white dark:bg-card">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>

    {/* Content */}
    <div className="flex-1 px-6 pb-6 space-y-5 overflow-y-auto">
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-border/30 bg-white dark:bg-card shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Clock className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Heures d'étude</p>
            <p className="text-3xl font-bold text-foreground">3h</p>
          </div>
        </div>
        <div className="p-5 rounded-2xl border border-border/30 bg-white dark:bg-card shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Taux de complétion</p>
            <p className="text-3xl font-bold text-foreground">33%</p>
          </div>
        </div>
        <div className="p-5 rounded-2xl border border-border/30 bg-white dark:bg-card shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Sessions réalisées</p>
            <p className="text-3xl font-bold text-foreground">2</p>
          </div>
        </div>
      </div>

      {/* Progress by Subject */}
      <div>
        <p className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          Progrès par Matière
        </p>
        <div className="grid grid-cols-3 gap-4">
          {/* MSI Card - Blue */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/40 dark:to-blue-900/20 border-l-4 border-blue-400 relative">
            <span className="absolute top-4 right-4 w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-xs font-semibold bg-blue-500 text-white px-2.5 py-1 rounded">MSI</span>
            <p className="text-2xl font-bold mt-3 text-foreground">MSI</p>
            <div className="flex gap-8 mt-4">
              <div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <Clock className="w-3 h-3" />
                  Temps d'étude
                </div>
                <p className="text-xl font-bold text-foreground">3h</p>
              </div>
              <div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <BookOpen className="w-3 h-3" />
                  Sessions
                </div>
                <p className="text-xl font-bold text-foreground">2</p>
              </div>
            </div>
          </div>
          
          {/* FINANCE Card - Red */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/40 dark:to-red-900/20 border-l-4 border-red-400 relative">
            <span className="absolute top-4 right-4 w-3 h-3 rounded-full bg-red-500" />
            <span className="text-xs font-semibold bg-red-500 text-white px-2.5 py-1 rounded">FIN</span>
            <p className="text-2xl font-bold mt-3 text-foreground">FINANCE</p>
            <div className="flex gap-8 mt-4">
              <div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <Clock className="w-3 h-3" />
                  Temps d'étude
                </div>
                <p className="text-xl font-bold text-foreground">0h</p>
              </div>
              <div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <BookOpen className="w-3 h-3" />
                  Sessions
                </div>
                <p className="text-xl font-bold text-foreground">0</p>
              </div>
            </div>
          </div>
          
          {/* MCG Card - Green */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/40 dark:to-green-900/20 border-l-4 border-green-400 relative">
            <span className="absolute top-4 right-4 w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs font-semibold bg-green-500 text-white px-2.5 py-1 rounded">MCG</span>
            <p className="text-2xl font-bold mt-3 text-foreground">MCG</p>
            <div className="flex gap-8 mt-4">
              <div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <Clock className="w-3 h-3" />
                  Temps d'étude
                </div>
                <p className="text-xl font-bold text-foreground">0h</p>
              </div>
              <div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <BookOpen className="w-3 h-3" />
                  Sessions
                </div>
                <p className="text-xl font-bold text-foreground">0</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cumulative Hours */}
      <div>
        <p className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Heures cumulées par Matière
        </p>
        <div className="p-5 rounded-2xl border border-border/30 bg-white dark:bg-card shadow-sm space-y-5">
          {/* MSI Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm font-medium text-foreground">MSI</span>
              </div>
              <span className="text-sm text-muted-foreground">3h / 19h</span>
            </div>
            <div className="h-2.5 bg-muted rounded-full overflow-hidden relative">
              <div className="absolute inset-y-0 right-0 w-[95%] bg-green-100 dark:bg-green-900/30 rounded-full" />
              <div className="h-full bg-blue-500 rounded-full relative z-10" style={{ width: '16%' }} />
            </div>
            <p className="text-xs text-blue-500 mt-1.5">16% effectué</p>
          </div>
          
          {/* FINANCE Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm font-medium text-foreground">FINANCE</span>
              </div>
              <span className="text-sm text-muted-foreground">0h / 32h</span>
            </div>
            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-red-500 rounded-full" style={{ width: '0%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ===== MATIERES CARD - EXACT REPLICA =====
const MatieresCard = () => (
  <div className="h-full flex flex-col bg-[#FFFDF8] dark:bg-card">
    {/* Header */}
    <div className="flex items-center justify-between px-6 py-5">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Mes matières & examens</h2>
        <p className="text-sm text-muted-foreground mt-1">Ajoute tes matières, leurs dates d'examen et ton objectif d'heures de révision.</p>
      </div>
      <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-sm">
        <Plus className="w-4 h-4" />
        Ajouter une matière
      </button>
    </div>

    {/* Content */}
    <div className="flex-1 px-6 pb-6 space-y-5 overflow-y-auto">
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-border/30 bg-white dark:bg-card shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Matières actives</p>
            <p className="text-3xl font-bold text-foreground">4</p>
          </div>
        </div>
        <div className="p-5 rounded-2xl border border-border/30 bg-white dark:bg-card shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Prochain examen</p>
            <p className="text-lg font-bold text-foreground">FINANCE <span className="text-red-500">J-24</span></p>
          </div>
        </div>
        <div className="p-5 rounded-2xl border border-border/30 bg-white dark:bg-card shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Heures totales visées</p>
            <p className="text-3xl font-bold text-foreground">90h</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <button className="px-4 py-2 rounded-full text-sm font-medium bg-foreground text-background border border-foreground">
          Toutes (4)
        </button>
        <button className="px-4 py-2 rounded-full text-sm font-medium border border-primary/40 text-primary bg-white dark:bg-card hover:bg-primary/5">
          Partiel (4)
        </button>
        <button className="px-4 py-2 rounded-full text-sm font-medium border border-primary/40 text-primary bg-white dark:bg-card hover:bg-primary/5">
          Contrôle continu (0)
        </button>
        <button className="px-4 py-2 rounded-full text-sm font-medium border border-primary/40 text-primary bg-white dark:bg-card hover:bg-primary/5">
          Oral (0)
        </button>
        <button className="px-4 py-2 rounded-full text-sm font-medium border border-primary/40 text-primary bg-white dark:bg-card hover:bg-primary/5">
          Projet (0)
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border/30 bg-white dark:bg-card overflow-hidden shadow-sm">
        {/* Table Header */}
        <div className="grid grid-cols-[1.2fr,1fr,0.8fr,0.8fr,0.7fr,40px] gap-4 px-6 py-4 text-sm text-muted-foreground font-medium border-b border-border/20">
          <span>Matière</span>
          <span>Date d'examen</span>
          <span>Objectif</span>
          <span>Priorité</span>
          <span>Statut</span>
          <span></span>
        </div>
        
        {/* Table Rows */}
        <div className="divide-y divide-border/20">
          {/* FINANCE */}
          <div className="grid grid-cols-[1.2fr,1fr,0.8fr,0.8fr,0.7fr,40px] gap-4 px-6 py-4 items-center hover:bg-muted/20 transition-colors">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="font-semibold text-foreground">FINANCE</span>
            </div>
            <span className="text-muted-foreground">14/01/2026</span>
            <span className="text-muted-foreground">35h</span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 w-fit">
              Haute
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 w-fit">
              Active
            </span>
            <button className="text-muted-foreground hover:text-foreground">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          {/* MCG */}
          <div className="grid grid-cols-[1.2fr,1fr,0.8fr,0.8fr,0.7fr,40px] gap-4 px-6 py-4 items-center hover:bg-muted/20 transition-colors">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-green-500" />
              <span className="font-semibold text-foreground">MCG</span>
            </div>
            <span className="text-muted-foreground">14/01/2026</span>
            <span className="text-muted-foreground">25h</span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 w-fit">
              Haute
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 w-fit">
              Active
            </span>
            <button className="text-muted-foreground hover:text-foreground">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          {/* MSI */}
          <div className="grid grid-cols-[1.2fr,1fr,0.8fr,0.8fr,0.7fr,40px] gap-4 px-6 py-4 items-center hover:bg-muted/20 transition-colors">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="font-semibold text-foreground">MSI</span>
            </div>
            <span className="text-muted-foreground">16/01/2026</span>
            <span className="text-muted-foreground">20h</span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 w-fit">
              Moyenne
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 w-fit">
              Active
            </span>
            <button className="text-muted-foreground hover:text-foreground">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          {/* Anglais */}
          <div className="grid grid-cols-[1.2fr,1fr,0.8fr,0.8fr,0.7fr,40px] gap-4 px-6 py-4 items-center hover:bg-muted/20 transition-colors">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="font-semibold text-foreground">Anglais</span>
            </div>
            <span className="text-muted-foreground">16/01/2026</span>
            <span className="text-muted-foreground">10h</span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 w-fit">
              Basse
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 w-fit">
              Active
            </span>
            <button className="text-muted-foreground hover:text-foreground">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default StackedCardsLayout;
