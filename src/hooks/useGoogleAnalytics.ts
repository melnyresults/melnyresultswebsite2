import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export type GoogleAnalyticsData = {
  activeUsers: number;
  sessions: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
  conversions: number;
  chartData: Array<{
    date: string;
    users: number;
    sessions: number;
    pageViews: number;
  }>;
};

export type DateRange = {
  startDate: string;
  endDate: string;
};

export const useGoogleAnalytics = (initialDateRange?: DateRange) => {
  const [data, setData] = useState<GoogleAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>(
    initialDateRange || {
      startDate: '30daysAgo',
      endDate: 'today',
    }
  );

  const checkConnection = async () => {
    try {
      const { data: integration, error } = await supabase
        .from('platform_integrations')
        .select('is_connected, last_synced_at')
        .eq('platform_type', 'google_analytics')
        .maybeSingle();

      if (error) throw error;

      setIsConnected(integration?.is_connected || false);
      setLastSynced(integration?.last_synced_at || null);
      return integration?.is_connected || false;
    } catch (err) {
      console.error('Error checking GA connection:', err);
      return false;
    }
  };

  const fetchAnalyticsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const connected = await checkConnection();
      if (!connected) {
        setError('Google Analytics not connected');
        setLoading(false);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sync-google-analytics?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`;

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch analytics data');
      }

      const result = await response.json();

      if (result.success && result.data) {
        const rawData = result.data;

        const totals = {
          activeUsers: 0,
          sessions: 0,
          pageViews: 0,
          bounceRate: 0,
          avgSessionDuration: 0,
          conversions: 0,
        };

        const chartData: Array<{
          date: string;
          users: number;
          sessions: number;
          pageViews: number;
        }> = [];

        if (rawData.rows && rawData.rows.length > 0) {
          rawData.rows.forEach((row: any) => {
            const dateValue = row.dimensionValues?.[0]?.value || '';
            const metrics = row.metricValues || [];

            const users = parseInt(metrics[0]?.value || '0');
            const sessions = parseInt(metrics[1]?.value || '0');
            const pageViews = parseInt(metrics[2]?.value || '0');
            const bounceRate = parseFloat(metrics[3]?.value || '0');
            const duration = parseFloat(metrics[4]?.value || '0');
            const conversions = parseInt(metrics[5]?.value || '0');

            totals.activeUsers += users;
            totals.sessions += sessions;
            totals.pageViews += pageViews;
            totals.bounceRate += bounceRate;
            totals.avgSessionDuration += duration;
            totals.conversions += conversions;

            chartData.push({
              date: dateValue,
              users,
              sessions,
              pageViews,
            });
          });

          const rowCount = rawData.rows.length;
          totals.bounceRate = totals.bounceRate / rowCount;
          totals.avgSessionDuration = totals.avgSessionDuration / rowCount;
        }

        setData({
          ...totals,
          chartData,
        });
        setLastSynced(result.lastSynced);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  const refresh = () => {
    fetchAnalyticsData();
  };

  const updateDateRange = (newRange: DateRange) => {
    setDateRange(newRange);
  };

  return {
    data,
    loading,
    error,
    isConnected,
    lastSynced,
    dateRange,
    updateDateRange,
    refresh,
  };
};
