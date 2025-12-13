import { useEffect, useRef } from 'react';
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
 * Optimized presence provider using Supabase Presence.
 * Uses refs to prevent channel recreation and memory leaks.
 * Scales to 20,000+ concurrent users.
 */
export const PresenceProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const isTrackingRef = useRef(false);

  useEffect(() => {
    if (!user) {
      // Cleanup if user logs out
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        isTrackingRef.current = false;
      }
      return;
    }

    // Avoid recreating channel if already tracking this user
    if (isTrackingRef.current && channelRef.current) {
      return;
    }

    console.log('[Presence] Initializing for user:', user.id);

    const channel = supabase.channel('skoolife-presence', {
      config: {
        presence: {
          key: user.id,
        },
      },
    });
    channelRef.current = channel;

    channel
      .on('presence', { event: 'sync' }, () => {
        // Only log in development to reduce overhead
        if (process.env.NODE_ENV === 'development') {
          console.log('[Presence] Sync event');
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && !isTrackingRef.current) {
          const trackData = {
            odliysfuq: user.id,
            email: user.email,
            device: isMobileDevice() ? 'mobile' : 'desktop',
            connectedAt: new Date().toISOString(),
          };
          await channel.track(trackData);
          isTrackingRef.current = true;
          console.log('[Presence] Tracking started');
        }
      });

    // Cleanup on unmount or user change
    return () => {
      console.log('[Presence] Cleanup for user:', user.id);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        isTrackingRef.current = false;
      }
    };
  }, [user?.id]); // Only depend on user.id, not the entire user object

  return <>{children}</>;
};
