import { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LiveUser {
  odliysfuq: string;
  email: string;
  device: 'desktop' | 'mobile';
  connectedAt: string;
}

/**
 * Optimized hook to get real-time list of connected users via Supabase Presence.
 * Uses debouncing and memoization for scalability (20,000+ users).
 */
export function useLiveUsers() {
  const [users, setUsers] = useState<LiveUser[]>([]);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const processPresenceState = useCallback((state: Record<string, unknown[]>) => {
    // Debounce rapid presence updates to prevent UI thrashing
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      const allEntries: LiveUser[] = [];
      Object.values(state).forEach((presences) => {
        (presences as unknown as LiveUser[]).forEach((p) => {
          if (p.odliysfuq && p.email) {
            allEntries.push(p);
          }
        });
      });
      
      setUsers(allEntries);
    }, 100); // 100ms debounce
  }, []);

  useEffect(() => {
    console.log('[LiveUsers] Initializing optimized hook');
    
    // Reuse existing channel if possible
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase.channel('skoolife-presence', {
      config: {
        presence: {
          key: 'admin-observer',
        },
      },
    });
    channelRef.current = channel;

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        processPresenceState(state);
      })
      .subscribe(async (status) => {
        console.log('[LiveUsers] Subscribe status:', status);
        if (status === 'SUBSCRIBED') {
          // Admin tracks with a special marker
          await channel.track({ 
            odliysfuq: 'admin-observer',
            isAdmin: true 
          });
        }
      });

    return () => {
      console.log('[LiveUsers] Cleanup');
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [processPresenceState]);

  // Filter out admin observer from count
  return users.filter(u => u.odliysfuq !== 'admin-observer');
}

/**
 * Simple hook that just returns the count
 */
export function useLiveUserCount() {
  const users = useLiveUsers();
  return users.length;
}
