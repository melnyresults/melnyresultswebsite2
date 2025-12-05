import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface AvailabilitySchedule {
  id: string;
  user_id: string;
  name: string;
  timezone: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface AvailabilitySlot {
  id: string;
  schedule_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  created_at: string;
}

export interface DateOverride {
  id: string;
  user_id: string;
  date: string;
  is_available: boolean;
  start_time?: string;
  end_time?: string;
  created_at: string;
}

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function useAvailability() {
  const [schedules, setSchedules] = useState<AvailabilitySchedule[]>([]);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [dateOverrides, setDateOverrides] = useState<DateOverride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setSchedules([]);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('availability_schedules')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('name');

      if (fetchError) throw fetchError;
      setSchedules(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch schedules');
    } finally {
      setLoading(false);
    }
  };

  const fetchSlots = async (scheduleId: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('availability_slots')
        .select('*')
        .eq('schedule_id', scheduleId)
        .order('day_of_week')
        .order('start_time');

      if (fetchError) throw fetchError;
      setSlots(data || []);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch slots');
      return [];
    }
  };

  const fetchDateOverrides = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error: fetchError } = await supabase
        .from('date_overrides')
        .select('*')
        .eq('user_id', user.id)
        .order('date');

      if (fetchError) throw fetchError;
      setDateOverrides(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch date overrides');
    }
  };

  const createSchedule = async (scheduleData: Partial<AvailabilitySchedule>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error: createError } = await supabase
        .from('availability_schedules')
        .insert({
          user_id: user.id,
          ...scheduleData,
        })
        .select()
        .single();

      if (createError) throw createError;
      setSchedules(prev => [...prev, data]);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create schedule';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateSchedule = async (id: string, updates: Partial<AvailabilitySchedule>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('availability_schedules')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      setSchedules(prev => prev.map(s => s.id === id ? data : s));
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update schedule';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteSchedule = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('availability_schedules')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setSchedules(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete schedule';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const createSlot = async (slotData: Partial<AvailabilitySlot>) => {
    try {
      const { data, error: createError } = await supabase
        .from('availability_slots')
        .insert(slotData)
        .select()
        .single();

      if (createError) throw createError;
      setSlots(prev => [...prev, data]);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create slot';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateSlot = async (id: string, updates: Partial<AvailabilitySlot>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('availability_slots')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      setSlots(prev => prev.map(s => s.id === id ? data : s));
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update slot';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteSlot = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('availability_slots')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setSlots(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete slot';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const createDateOverride = async (overrideData: Partial<DateOverride>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error: createError } = await supabase
        .from('date_overrides')
        .insert({
          user_id: user.id,
          ...overrideData,
        })
        .select()
        .single();

      if (createError) throw createError;
      setDateOverrides(prev => [...prev, data]);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create date override';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteDateOverride = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('date_overrides')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setDateOverrides(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete date override';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const setDefaultSchedule = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      await supabase
        .from('availability_schedules')
        .update({ is_default: false })
        .eq('user_id', user.id);

      await updateSchedule(id, { is_default: true });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to set default schedule';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    schedules,
    slots,
    dateOverrides,
    loading,
    error,
    fetchSchedules,
    fetchSlots,
    fetchDateOverrides,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    createSlot,
    updateSlot,
    deleteSlot,
    createDateOverride,
    deleteDateOverride,
    setDefaultSchedule,
    DAYS_OF_WEEK,
  };
}
