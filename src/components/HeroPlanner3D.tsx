import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const HeroPlanner3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring physics
  const springConfig = { damping: 30, stiffness: 120 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), springConfig);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set((e.clientX - centerX) / rect.width);
    mouseY.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  // Sessions data
  const sessions = [
    { subject: 'Mathématiques', time: '14:00 • 15:30', color: '#2F80ED' },
    { subject: 'Physique', time: '16:00 • 17:00', color: '#9B51E0' },
    { subject: 'Anglais', time: '18:00 • 19:00', color: '#27AE60' },
  ];

  // Floating cards data
  const floatingCards = [
    { text: '+6h planifiées cette semaine', position: { x: -15, y: -25 }, delay: 0 },
    { text: 'Examen de Comptabilité – J-12', position: { x: 75, y: 15 }, delay: 1.5 },
    { text: 'Priorité : Maths & Compta', position: { x: -10, y: 85 }, delay: 3 },
  ];

  // Grid hours
  const hours = ['8h', '10h', '12h', '14h', '16h', '18h', '20h'];
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'];

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[450px] md:h-[520px] perspective-[1200px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
    >
      {/* Main 3D Container */}
      <motion.div
        className="relative w-full h-full"
        style={{
          rotateX: isMobile ? 0 : rotateX,
          rotateY: isMobile ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Layer 1: Background Grid (furthest back) */}
        <motion.div
          className="absolute left-1/2 top-1/2 w-[340px] md:w-[420px] h-[280px] md:h-[340px]"
          style={{
            transform: 'translate(-50%, -50%) translateZ(-30px)',
            transformStyle: 'preserve-3d',
          }}
          animate={{
            scale: [1, 1.008, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm border border-white/40 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden">
            {/* Grid pattern */}
            <div className="absolute inset-0 p-4">
              {/* Days header */}
              <div className="flex mb-2 pl-10">
                {days.map((day) => (
                  <div key={day} className="flex-1 text-center text-[10px] md:text-xs text-muted-foreground/60 font-medium">
                    {day}
                  </div>
                ))}
              </div>
              {/* Grid rows */}
              <div className="flex-1 relative">
                {hours.map((hour, idx) => (
                  <div key={hour} className="flex items-center h-[30px] md:h-[38px] border-t border-border/20">
                    <span className="w-10 text-[9px] md:text-[10px] text-muted-foreground/50 pr-2 text-right">{hour}</span>
                    <div className="flex-1 flex">
                      {days.map((day, dayIdx) => (
                        <div 
                          key={`${day}-${hour}`} 
                          className="flex-1 border-l border-border/10 h-full"
                        >
                          {/* Random colored blocks to simulate events */}
                          {idx === 2 && dayIdx === 1 && (
                            <div className="h-full w-[90%] mx-auto rounded-sm bg-blue-400/20" />
                          )}
                          {idx === 3 && dayIdx === 3 && (
                            <div className="h-full w-[90%] mx-auto rounded-sm bg-purple-400/20" />
                          )}
                          {idx === 4 && dayIdx === 0 && (
                            <div className="h-full w-[90%] mx-auto rounded-sm bg-green-400/20" />
                          )}
                          {idx === 5 && dayIdx === 4 && (
                            <div className="h-full w-[90%] mx-auto rounded-sm bg-primary/20" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent pointer-events-none" />
          </div>
        </motion.div>

        {/* Layer 2: Main Planning Card (middle) */}
        <motion.div
          className="absolute left-1/2 top-1/2 w-[280px] md:w-[320px]"
          style={{
            transform: 'translate(-50%, -50%) translateZ(40px)',
            transformStyle: 'preserve-3d',
          }}
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="relative bg-white rounded-2xl border border-border/30 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] p-5 overflow-hidden">
            {/* Scan line effect */}
            <motion.div
              className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"
              animate={{
                top: ['0%', '100%'],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-foreground">Planning de révisions</h3>
              <motion.span 
                className="px-2.5 py-1 text-xs font-bold bg-primary text-primary-foreground rounded-lg shadow-[0_0_15px_rgba(255,213,74,0.4)]"
                animate={{
                  boxShadow: [
                    '0 0 15px rgba(255,213,74,0.4)',
                    '0 0 25px rgba(255,213,74,0.6)',
                    '0 0 15px rgba(255,213,74,0.4)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                IA
              </motion.span>
            </div>

            {/* Sessions */}
            <div className="space-y-3.5">
              {sessions.map((session, idx) => (
                <motion.div 
                  key={session.subject}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.12 }}
                >
                  <div 
                    className="w-1 h-10 rounded-full" 
                    style={{ backgroundColor: session.color }}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm text-foreground">{session.subject}</p>
                    <p className="text-xs text-muted-foreground">{session.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom stats */}
            <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">3 sessions aujourd'hui</span>
              <span className="text-primary font-semibold">4h30 de révisions</span>
            </div>
          </div>
        </motion.div>

        {/* Layer 3: Floating Hologram Cards (front) */}
        {floatingCards.map((card, idx) => (
          <motion.div
            key={idx}
            className="absolute"
            style={{
              left: `${card.position.x}%`,
              top: `${card.position.y}%`,
              transform: `translateZ(${70 + idx * 15}px)`,
              transformStyle: 'preserve-3d',
            }}
            animate={{
              y: [0, -8, 0],
              x: [0, idx % 2 === 0 ? 5 : -5, 0],
            }}
            transition={{
              duration: 6 + idx * 0.8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: card.delay,
            }}
          >
            <div className="px-3 py-2 bg-white/70 backdrop-blur-xl rounded-xl border border-white/50 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.1)] text-xs font-medium text-foreground/80 whitespace-nowrap">
              {card.text}
            </div>
          </motion.div>
        ))}

        {/* Orbiting IA Badge */}
        <motion.div
          className="absolute left-1/2 top-1/2"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            width: 320,
            height: 320,
            marginLeft: -160,
            marginTop: -160,
            transformStyle: 'preserve-3d',
          }}
        >
          <motion.div
            className="absolute -top-3 left-1/2 -translate-x-1/2"
            style={{
              transform: 'translateZ(90px)',
            }}
            animate={{
              rotate: -360,
              scale: [1, 1.08, 1],
            }}
            transition={{
              rotate: { duration: 25, repeat: Infinity, ease: 'linear' },
              scale: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            <div 
              className="relative w-11 h-11 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(255,213,74,0.5)] cursor-pointer"
              title="Planning généré automatiquement"
            >
              <span className="text-sm font-bold text-primary-foreground">IA</span>
              {/* Glow rings */}
              <div className="absolute inset-0 rounded-xl border-2 border-primary/30 animate-ping" style={{ animationDuration: '3s' }} />
            </div>
          </motion.div>
        </motion.div>

        {/* Secondary orbiting dot */}
        <motion.div
          className="absolute left-1/2 top-1/2"
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            width: 380,
            height: 380,
            marginLeft: -190,
            marginTop: -190,
          }}
        >
          <motion.div className="absolute top-1/2 -right-1">
            <div className="w-2.5 h-2.5 bg-primary/50 rounded-full shadow-[0_0_10px_rgba(255,213,74,0.6)]" />
          </motion.div>
        </motion.div>

        {/* Ambient particles */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-primary/30 rounded-full"
            style={{
              left: `${15 + i * 22}%`,
              top: `${25 + (i % 2) * 50}%`,
              transform: `translateZ(${20 + i * 10}px)`,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4 + i * 0.7,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          />
        ))}
      </motion.div>

      {/* Hover label */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs text-muted-foreground/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered && !isMobile ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        Exemple de planning généré par l'IA Skoolife
      </motion.div>
    </div>
  );
};

export default HeroPlanner3D;
