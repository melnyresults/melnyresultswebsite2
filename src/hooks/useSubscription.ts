import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

interface Subscription {
  customer_id: string;
  subscription_id: string | null;
  subscription_status: string;
  price_id: string | null;
  current_period_start: number | null;
  current_period_end: number | null;
  cancel_at_period_end: boolean;
  payment_method_brand: string | null;
  payment_method_last4: string | null;
}

interface Order {
  customer_id: string;
  order_id: number;
  checkout_session_id: string;
  payment_intent_id: string;
  amount_subtotal: number;
  amount_total: number;
  currency: string;
  payment_status: string;
  order_status: string;
  order_date: string;
}

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchSubscription = async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .maybeSingle();

      if (error) throw error;
      setSubscription(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    if (!user) {
      setOrders([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('stripe_user_orders')
        .select('*')
        .order('order_date', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  useEffect(() => {
    fetchSubscription();
    fetchOrders();
  }, [user]);

  const hasActiveSubscription = () => {
    return subscription?.subscription_status === 'active';
  };

  const hasValidSubscription = () => {
    return subscription?.subscription_status && 
           ['active', 'trialing', 'past_due'].includes(subscription.subscription_status);
  };

  const getCurrentPlan = () => {
    if (!subscription?.price_id) return null;
    
    // You can map price IDs to plan names here
    const planNames: Record<string, string> = {
      'price_1RHo7lRoGKTuFXtOpnK24v5L': 'GEO Audit',
      // Add more price ID mappings as needed
    };

    return planNames[subscription.price_id] || 'Unknown Plan';
  };

  return {
    subscription,
    orders,
    loading,
    error,
    hasActiveSubscription,
    hasValidSubscription,
    getCurrentPlan,
    refetch: () => {
      fetchSubscription();
      fetchOrders();
    },
  };
};