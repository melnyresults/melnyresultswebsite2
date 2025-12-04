import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export const useRealtimeNotifications = () => {
  const { user } = useAuth();
  const hasPermissionRef = useRef(false);

  useEffect(() => {
    if (!user) return;

    if ('Notification' in window) {
      hasPermissionRef.current = Notification.permission === 'granted';
    }

    const channel = supabase
      .channel('opportunities-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'opportunities',
        },
        (payload) => {
          handleNewOpportunity(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleNewOpportunity = (opportunity: any) => {
    if (!hasPermissionRef.current || !opportunity) return;

    const notification = new Notification('New Lead Generated!', {
      body: `${opportunity.lead_name} from ${opportunity.business_name || 'Unknown Company'}\nValue: $${Number(opportunity.value).toLocaleString()}`,
      icon: '/melny-results-logo.png',
      badge: '/melny-results-logo.png',
      tag: `opportunity-${opportunity.id}`,
      requireInteraction: false,
      timestamp: Date.now(),
      data: {
        url: '/admin/dashboard',
        opportunityId: opportunity.id,
      },
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    setTimeout(() => {
      notification.close();
    }, 10000);
  };
};
