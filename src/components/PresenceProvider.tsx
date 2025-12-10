import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

/**
 * Detect if user is on mobile device
 */
const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
    || window.innerWidth < 768;
};

/**
 * Simple presence provider using Supabase Presence.
 * No manual heartbeat, no polling - Supabase handles everything.
 * Tracks device type (desktop/mobile) for admin visibility.
 */
export const PresenceProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const channel = supabase.channel('skoolife-presence', {
      config: {
        presence: { key: user.id }
      }
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        // Nothing to do here for students, counting happens on admin side
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            userId: user.id,
            email: user.email,
            device: isMobileDevice() ? 'mobile' : 'desktop',
            connectedAt: new Date().toISOString(),
          });
        }
      });

    // Cleanup on unmount or user change
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return <>{children}</>;
};
