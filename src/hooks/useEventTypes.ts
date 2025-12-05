import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface EventType {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  description?: string;
  duration: number;
  color: string;
  location_type: 'phone' | 'zoom' | 'google_meet' | 'custom' | 'in_person';
  location_value?: string;
  is_active: boolean;
  buffer_before: number;
  buffer_after: number;
  max_bookings_per_day?: number;
  min_notice: number;
  max_future_days: number;
  requires_confirmation: boolean;
  redirect_url?: string;
  confirmation_message: string;
  created_at: string;
  updated_at: string;
}

export function useEventTypes() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEventTypes();
  }, []);

  const fetchEventTypes = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setEventTypes([]);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('event_types')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setEventTypes(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch event types');
    } finally {
      setLoading(false);
    }
  };

  const createEventType = async (eventTypeData: Partial<EventType>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const slug = eventTypeData.slug || generateSlug(eventTypeData.name || 'meeting');

      const { data, error: createError } = await supabase
        .from('event_types')
        .insert({
          user_id: user.id,
          slug,
          ...eventTypeData,
        })
        .select()
        .single();

      if (createError) throw createError;
      setEventTypes(prev => [data, ...prev]);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create event type';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateEventType = async (id: string, updates: Partial<EventType>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('event_types')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      setEventTypes(prev => prev.map(et => et.id === id ? data : et));
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update event type';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteEventType = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('event_types')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setEventTypes(prev => prev.filter(et => et.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete event type';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    return updateEventType(id, { is_active: isActive });
  };

  const checkSlugAvailability = async (slug: string, excludeId?: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const query = supabase
        .from('event_types')
        .select('slug')
        .eq('user_id', user.id)
        .eq('slug', slug);

      if (excludeId) {
        query.neq('id', excludeId);
      }

      const { data } = await query.maybeSingle();
      return !data;
    } catch {
      return false;
    }
  };

  return {
    eventTypes,
    loading,
    error,
    fetchEventTypes,
    createEventType,
    updateEventType,
    deleteEventType,
    toggleActive,
    checkSlugAvailability,
  };
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
