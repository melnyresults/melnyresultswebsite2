import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export type PlatformIntegration = {
  id: string;
  platform_type: string;
  platform_name: string;
  is_connected: boolean;
  credentials: Record<string, any>;
  config: Record<string, any>;
  last_synced_at: string | null;
  connected_at: string | null;
  error_message: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export const usePlatformIntegrations = () => {
  const { user } = useAuth();
  const [integrations, setIntegrations] = useState<PlatformIntegration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('platform_integrations')
        .select('*')
        .order('platform_name');

      if (error) throw error;

      setIntegrations(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch integrations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const connectPlatform = async (
    platformType: string,
    credentials: Record<string, any>,
    config?: Record<string, any>
  ) => {
    try {
      const { data, error } = await supabase
        .from('platform_integrations')
        .update({
          is_connected: true,
          credentials,
          config: config || {},
          connected_at: new Date().toISOString(),
          created_by: user?.id,
          error_message: null,
        })
        .eq('platform_type', platformType)
        .select()
        .single();

      if (error) throw error;

      setIntegrations((prev) =>
        prev.map((integration) =>
          integration.platform_type === platformType ? data : integration
        )
      );

      return { success: true, data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect platform';
      return { success: false, error: errorMessage };
    }
  };

  const disconnectPlatform = async (platformType: string) => {
    try {
      const { data, error } = await supabase
        .from('platform_integrations')
        .update({
          is_connected: false,
          credentials: {},
          config: {},
          connected_at: null,
          last_synced_at: null,
          error_message: null,
        })
        .eq('platform_type', platformType)
        .select()
        .single();

      if (error) throw error;

      setIntegrations((prev) =>
        prev.map((integration) =>
          integration.platform_type === platformType ? data : integration
        )
      );

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to disconnect platform';
      return { success: false, error: errorMessage };
    }
  };

  const updateSyncStatus = async (platformType: string) => {
    try {
      const { data, error } = await supabase
        .from('platform_integrations')
        .update({
          last_synced_at: new Date().toISOString(),
        })
        .eq('platform_type', platformType)
        .select()
        .single();

      if (error) throw error;

      setIntegrations((prev) =>
        prev.map((integration) =>
          integration.platform_type === platformType ? data : integration
        )
      );

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update sync status';
      return { success: false, error: errorMessage };
    }
  };

  return {
    integrations,
    loading,
    error,
    connectPlatform,
    disconnectPlatform,
    updateSyncStatus,
    refetch: fetchIntegrations,
  };
};
