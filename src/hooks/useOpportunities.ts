import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export type Opportunity = {
  id: string;
  pipeline_id: string;
  stage_id: string | null;
  lead_name: string;
  business_name: string;
  value: number;
  location: string;
  city: string;
  phone_number: string;
  email: string;
  tags: string[];
  source: string;
  source_owner: string;
  notes: string;
  status: 'open' | 'won' | 'lost';
  closed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type OpportunityPayment = {
  id: string;
  opportunity_id: string;
  amount: number;
  payment_date: string;
  payment_method: string;
  notes: string;
  created_at: string;
  updated_at: string;
};

export const useOpportunities = (pipelineId?: string) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [payments, setPayments] = useState<OpportunityPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('opportunities')
        .select('*')
        .order('created_at', { ascending: false });

      if (pipelineId) {
        query = query.eq('pipeline_id', pipelineId);
      }

      const { data, error } = await query;
      if (error) throw error;
      setOpportunities(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async (opportunityId?: string) => {
    try {
      let query = supabase
        .from('opportunity_payments')
        .select('*')
        .order('payment_date', { ascending: false });

      if (opportunityId) {
        query = query.eq('opportunity_id', opportunityId);
      }

      const { data, error } = await query;
      if (error) throw error;
      setPayments(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  useEffect(() => {
    fetchOpportunities();
    fetchPayments();
  }, [pipelineId]);

  const createOpportunity = async (opportunityData: Omit<Opportunity, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .insert([opportunityData])
        .select()
        .single();

      if (error) throw error;
      await fetchOpportunities();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const updateOpportunity = async (id: string, opportunityData: Partial<Opportunity>) => {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .update(opportunityData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchOpportunities();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const deleteOpportunity = async (id: string) => {
    try {
      const { error } = await supabase
        .from('opportunities')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchOpportunities();
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const createPayment = async (paymentData: Omit<OpportunityPayment, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('opportunity_payments')
        .insert([paymentData])
        .select()
        .single();

      if (error) throw error;
      await fetchPayments();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const updatePayment = async (id: string, paymentData: Partial<OpportunityPayment>) => {
    try {
      const { data, error } = await supabase
        .from('opportunity_payments')
        .update(paymentData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchPayments();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const deletePayment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('opportunity_payments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchPayments();
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  return {
    opportunities,
    payments,
    loading,
    error,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
    createPayment,
    updatePayment,
    deletePayment,
    refetchOpportunities: fetchOpportunities,
    refetchPayments: fetchPayments,
  };
};
