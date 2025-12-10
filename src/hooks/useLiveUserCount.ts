import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LiveUser {
  userId: string;
  email: string;
  device: 'desktop' | 'mobile';
  connectedAt: string;
}

/**
 * Hook to get real-time list of connected users via Supabase Presence.
 * No manual heartbeat, no polling - pure Supabase Presence.
 */
export function useLiveUsers() {
  const [users, setUsers] = useState<LiveUser[]>([]);

  useEffect(() => {
    const channel = supabase.channel('skoolife-presence', {
      config: {
        presence: { key: 'admin-observer' }
      }
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        // Get all presence entries and flatten
        const allEntries = Object.values(state).flat() as unknown as Array<LiveUser>;
        // Filter valid users and exclude admin
        const filtered = allEntries.filter(u => u.userId && u.userId !== 'admin-observer');
        setUsers(filtered);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Admin tracks to be able to see others
          await channel.track({ userId: 'admin-observer' });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return users;
}

/**
 * Simple hook that just returns the count
 */
export function useLiveUserCount() {
  const users = useLiveUsers();
  return users.length;
}
