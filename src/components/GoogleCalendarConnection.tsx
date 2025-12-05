import React, { useState, useEffect } from 'react';
import { Calendar, Check, X, RefreshCw, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

export const GoogleCalendarConnection: React.FC = () => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkConnection();
  }, [user]);

  const checkConnection = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('google_calendar_connections')
        .select('is_active, last_sync')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setIsConnected(true);
        setLastSync(data.last_sync ? new Date(data.last_sync) : null);
      } else {
        setIsConnected(false);
      }
      setError(null);
    } catch (err) {
      console.error('Error checking connection:', err);
      setError('Failed to check connection status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        throw new Error('No active session');
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/google-oauth?action=get-auth-url`,
        {
          headers: {
            Authorization: `Bearer ${session.data.session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get authorization URL');
      }

      const { authUrl } = await response.json();

      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const popup = window.open(
        authUrl,
        'Google Calendar Authorization',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      const checkInterval = setInterval(async () => {
        if (popup?.closed) {
          clearInterval(checkInterval);
          await checkConnection();
        }
      }, 1000);

      setTimeout(() => {
        clearInterval(checkInterval);
        if (popup && !popup.closed) {
          popup.close();
        }
      }, 120000);

    } catch (err) {
      console.error('Error connecting calendar:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect calendar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect Google Calendar? Future bookings will not be added to your calendar.')) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        throw new Error('No active session');
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/google-oauth?action=disconnect`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.data.session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to disconnect calendar');
      }

      setIsConnected(false);
      setLastSync(null);
    } catch (err) {
      console.error('Error disconnecting calendar:', err);
      setError(err instanceof Error ? err.message : 'Failed to disconnect calendar');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !isConnected) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-center">
          <RefreshCw className="w-5 h-5 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Checking connection...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${isConnected ? 'bg-green-50' : 'bg-gray-50'}`}>
            <Calendar className={`w-6 h-6 ${isConnected ? 'text-green-600' : 'text-gray-400'}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Google Calendar</h3>
            <p className="text-sm text-gray-600 mt-1">
              {isConnected
                ? 'Your calendar is connected and syncing'
                : 'Connect your Google Calendar to sync availability'}
            </p>
            {isConnected && lastSync && (
              <p className="text-xs text-gray-500 mt-2">
                Last synced: {lastSync.toLocaleString()}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isConnected ? (
            <>
              <div className="flex items-center space-x-1 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Connected</span>
              </div>
              <button
                onClick={handleDisconnect}
                disabled={isLoading}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                title="Disconnect"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          ) : (
            <button
              onClick={handleConnect}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <span>Connect Calendar</span>
              )}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-800 font-medium">Error</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {isConnected && !error && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Calendar Integration Active</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Existing calendar events will block booking slots</li>
            <li>• New bookings will automatically create calendar events</li>
            <li>• Guests will be added as attendees</li>
            <li>• Calendar invites will be sent automatically</li>
          </ul>
        </div>
      )}

      {!isConnected && !error && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Why Connect Google Calendar?</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Automatically sync your availability</li>
            <li>• Prevent double bookings</li>
            <li>• Create calendar events for confirmed bookings</li>
            <li>• Send calendar invites to guests</li>
          </ul>
        </div>
      )}
    </div>
  );
};
