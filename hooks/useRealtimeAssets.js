import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export const useRealtimeAssets = () => {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    // Subscribe to real-time changes
    const channel = supabase
      .channel('assets-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'assets',
        },
        (payload) => {
          // Update local state based on the change
          setAssets(prev => {
            const updated = [...prev];
            const index = updated.findIndex(a => a.id === payload.new.id);

            if (payload.eventType === 'INSERT') {
              updated.unshift(payload.new);
            } else if (payload.eventType === 'UPDATE') {
              if (index > -1) {
                updated[index] = payload.new;
              }
            } else if (payload.eventType === 'DELETE' && index > -1) {
              updated.splice(index, 1);
            }

            return updated;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return assets;
};
