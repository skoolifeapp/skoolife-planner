import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const Hero3DModule = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring physics
  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);

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
  };

  // Sessions data
  const sessions = [
    { subject: 'Mathématiques', time: '14:00 • 15:30', progress: 75, color: 'bg-blue-500' },
    { subject: 'Physique', time: '16:00 • 17:00', progress: 45, color: 'bg-purple-500' },
    { subject: 'Anglais', time: '18:00 • 19:00', progress: 20, color: 'bg-green-500' },
  ];

  // Floating cards data
  const floatingCards = [
    { text: '+6h planifiées cette semaine', delay: 0 },
    { text: 'Examen de Comptabilité – J-12', delay: 2 },
    { text: 'Priorité : Maths & Comptabilité', delay: 4 },
  ];

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[400px] md:h-[500px] perspective-[1200px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main 3D Card */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] md:w-[380px]"
        style={{
          rotateX: isMobile ? 0 : rotateX,
          rotateY: isMobile ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={isMobile ? {
          y: [0, -8, 0],
          scale: [1, 1.01, 1],
        } : {
          scale: [1, 1.015, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="relative bg-card/95 backdrop-blur-xl rounded-2xl border border-border shadow-2xl p-6 transform-gpu"
          style={{ transform: 'translateZ(50px)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-foreground">Planning de révisions</h3>
            <span className="px-2 py-1 text-xs font-bold bg-primary text-primary-foreground rounded-md shadow-glow">
              IA
            </span>
          </div>

          {/* Sessions */}
          <div className="space-y-4">
            {sessions.map((session, idx) => (
              <motion.div 
                key={session.subject}
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.15 }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground text-sm">{session.subject}</span>
                  <span className="text-xs text-muted-foreground">{session.time}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    className={`h-full ${session.color} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${session.progress}%` }}
                    transition={{ duration: 1, delay: 0.5 + idx * 0.2, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom stats */}
          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <span>3 sessions aujourd'hui</span>
            <span className="text-primary font-medium">4h30 de révisions</span>
          </div>
        </div>
      </motion.div>

      {/* Floating Cards */}
      {floatingCards.map((card, idx) => (
        <motion.div
          key={idx}
          className="absolute"
          style={{
            left: idx === 0 ? '5%' : idx === 1 ? '70%' : '10%',
            top: idx === 0 ? '15%' : idx === 1 ? '20%' : '75%',
            transform: `translateZ(${30 + idx * 20}px)`,
          }}
          animate={{
            y: [0, -12, 0],
            x: [0, idx % 2 === 0 ? 8 : -8, 0],
            rotate: [0, idx % 2 === 0 ? 2 : -2, 0],
          }}
          transition={{
            duration: 5 + idx,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: card.delay,
          }}
        >
          <div className="px-4 py-2.5 bg-card/80 backdrop-blur-lg rounded-xl border border-border/50 shadow-lg text-sm font-medium text-foreground whitespace-nowrap">
            {card.text}
          </div>
        </motion.div>
      ))}

      {/* Orbiting AI Badge */}
      <motion.div
        className="absolute left-1/2 top-1/2"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          width: 280,
          height: 280,
          marginLeft: -140,
          marginTop: -140,
        }}
      >
        <motion.div
          className="absolute -top-4 left-1/2 -translate-x-1/2"
          animate={{
            rotate: -360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
            scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <div 
            className="relative w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-glow cursor-pointer group"
            title="Planning généré automatiquement"
          >
            <span className="text-sm font-bold text-primary-foreground">IA</span>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-primary rounded-xl blur-lg opacity-50 -z-10" />
          </div>
        </motion.div>
      </motion.div>

      {/* Secondary orbiting element */}
      <motion.div
        className="absolute left-1/2 top-1/2"
        animate={{
          rotate: -360,
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          width: 340,
          height: 340,
          marginLeft: -170,
          marginTop: -170,
        }}
      >
        <motion.div
          className="absolute top-1/2 -right-2"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <div className="w-3 h-3 bg-primary/60 rounded-full shadow-glow" />
        </motion.div>
      </motion.div>

      {/* Decorative particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-primary/40 rounded-full"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 3) * 20}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  );
};

export default Hero3DModule;
