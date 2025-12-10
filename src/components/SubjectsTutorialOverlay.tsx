import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface SubjectsTutorialOverlayProps {
  onComplete: () => void;
}

export const SubjectsTutorialOverlay = ({ onComplete }: SubjectsTutorialOverlayProps) => {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const updateTargetRect = () => {
      const element = document.querySelector('[data-add-subject-button]');
      if (element) {
        setTargetRect(element.getBoundingClientRect());
      } else {
        setTargetRect(null);
      }
    };

    updateTargetRect();
    window.addEventListener('resize', updateTargetRect);
    window.addEventListener('scroll', updateTargetRect, true);

    return () => {
      window.removeEventListener('resize', updateTargetRect);
      window.removeEventListener('scroll', updateTargetRect, true);
    };
  }, []);

  const padding = 8;
  const holeX = targetRect ? targetRect.left - padding : 0;
  const holeY = targetRect ? targetRect.top - padding : 0;
  const holeWidth = targetRect ? targetRect.width + padding * 2 : 0;
  const holeHeight = targetRect ? targetRect.height + padding * 2 : 0;

  // Calculate card position
  let cardStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 10002,
  };

  if (targetRect) {
    const cardWidth = 320;
    const cardHeight = 180;
    const gap = 16;

    // Position card below or above the target
    if (targetRect.bottom + cardHeight + gap < window.innerHeight) {
      cardStyle.top = targetRect.bottom + gap;
    } else {
      cardStyle.top = targetRect.top - cardHeight - gap;
    }

    // Center horizontally relative to target
    let left = targetRect.left + targetRect.width / 2 - cardWidth / 2;
    left = Math.max(16, Math.min(left, window.innerWidth - cardWidth - 16));
    cardStyle.left = left;
    cardStyle.width = cardWidth;
  } else {
    cardStyle.top = '50%';
    cardStyle.left = '50%';
    cardStyle.transform = 'translate(-50%, -50%)';
    cardStyle.width = 320;
  }

  return (
    <div className="fixed inset-0 z-[10000] pointer-events-none">
      {/* SVG Overlay with hole */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-auto"
        style={{ zIndex: 10000 }}
      >
        <defs>
          <mask id="subjects-tutorial-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect
                x={holeX}
                y={holeY}
                width={holeWidth}
                height={holeHeight}
                rx={12}
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.7)"
          mask="url(#subjects-tutorial-mask)"
        />
      </svg>

      {/* Pulsing border around target */}
      {targetRect && (
        <div
          className="absolute border-2 border-primary rounded-xl animate-pulse pointer-events-none"
          style={{
            left: holeX,
            top: holeY,
            width: holeWidth,
            height: holeHeight,
            zIndex: 10001,
          }}
        />
      )}

      {/* Tutorial Card */}
      <Card 
        className="pointer-events-auto shadow-2xl border-primary/20"
        style={cardStyle}
      >
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Plus className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground mb-1">Ajoute ta première matière</h3>
              <p className="text-sm text-muted-foreground">Renseigne tes matières et leurs examens pour que Skoolife puisse générer ton planning de révisions.</p>
            </div>
          </div>
          
          <div className="flex items-center justify-end mt-4 pt-4 border-t border-border">
            <Button
              size="sm"
              onClick={onComplete}
            >
              Compris
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
