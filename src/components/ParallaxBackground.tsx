import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxBackgroundProps {
  className?: string;
}

const ParallaxBackground = ({ className = '' }: ParallaxBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const blob1Y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const blob2Y = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const blob3Y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const blob1X = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const blob2X = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const blob1Scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.15]);
  const blob2Scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <motion.div 
        style={{ y: blob1Y, x: blob1X, scale: blob1Scale }}
        className="absolute top-20 left-5 md:left-10 w-48 md:w-72 h-48 md:h-72 bg-primary/20 rounded-full blur-3xl" 
      />
      <motion.div 
        style={{ y: blob2Y, x: blob2X, scale: blob2Scale }}
        className="absolute top-40 right-5 md:right-20 w-64 md:w-96 h-64 md:h-96 bg-accent/20 rounded-full blur-3xl" 
      />
      <motion.div 
        style={{ y: blob3Y }}
        className="absolute bottom-20 left-1/3 w-40 md:w-64 h-40 md:h-64 bg-primary/10 rounded-full blur-3xl" 
      />
    </div>
  );
};

export default ParallaxBackground;