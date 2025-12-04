import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Check, AlertCircle } from 'lucide-react';
import { usePushNotifications } from '../hooks/usePushNotifications';

const PushNotificationSettings: React.FC = () => {
  const {
    permission,
    isSupported,
    subscription,
    requestPermission,
    unsubscribe,
    sendTestNotification,
  } = usePushNotifications();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (permission === 'granted' && !subscription) {
      requestPermission();
    }
  }, [permission]);

  const handleEnableNotifications = async () => {
    setLoading(true);
    setMessage(null);

    const success = await requestPermission();

    if (success) {
      setMessage({
        type: 'success',
        text: 'Push notifications enabled successfully!',
      });
    } else {
      setMessage({
        type: 'error',
        text: 'Failed to enable push notifications. Please check your browser settings.',
      });
    }

    setLoading(false);
  };

  const handleDisableNotifications = async () => {
    setLoading(true);
    setMessage(null);

    await unsubscribe();

    setMessage({
      type: 'success',
      text: 'Push notifications disabled successfully.',
    });

    setLoading(false);
  };

  const handleTestNotification = () => {
    sendTestNotification(
      'Test Notification',
      'This is a test notification from Melny Results CRM!'
    );
    setMessage({
      type: 'success',
      text: 'Test notification sent! Check your device.',
    });
  };

  if (!isSupported) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-gray-100 rounded-lg">
            <BellOff className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Push Notifications</h3>
            <p className="text-sm text-gray-600">Not supported in this browser</p>
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            Your browser doesn't support push notifications. Please use a modern browser like Chrome, Firefox, or Edge.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${subscription ? 'bg-green-100' : 'bg-gray-100'}`}>
            {subscription ? (
              <Bell className="w-6 h-6 text-green-600" />
            ) : (
              <BellOff className="w-6 h-6 text-gray-600" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Push Notifications</h3>
            <p className="text-sm text-gray-600">
              {subscription ? 'Enabled' : 'Disabled'}
            </p>
          </div>
        </div>
        {subscription && (
          <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            <Check className="w-4 h-4" />
            <span>Active</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Get instant notifications when new leads are generated, deals are won, or important updates occur in your pipeline.
        </p>

        {message && (
          <div
            className={`p-4 rounded-lg border ${
              message.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-start space-x-2">
              {message.type === 'success' ? (
                <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        )}

        {permission === 'denied' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-medium mb-1">Notifications Blocked</p>
                <p>
                  You've blocked notifications for this site. To enable them, click the lock icon in your browser's
                  address bar and allow notifications.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          {!subscription && permission !== 'denied' && (
            <button
              onClick={handleEnableNotifications}
              disabled={loading}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
            >
              <Bell className="w-5 h-5" />
              <span>{loading ? 'Enabling...' : 'Enable Notifications'}</span>
            </button>
          )}

          {subscription && (
            <>
              <button
                onClick={handleTestNotification}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <Bell className="w-5 h-5" />
                <span>Send Test</span>
              </button>
              <button
                onClick={handleDisableNotifications}
                disabled={loading}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 font-medium"
              >
                <BellOff className="w-5 h-5" />
                <span>{loading ? 'Disabling...' : 'Disable'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">What you'll be notified about:</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start space-x-2">
            <span className="text-green-600 mt-0.5">•</span>
            <span>New leads added to your pipeline</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-600 mt-0.5">•</span>
            <span>Deals marked as won or lost</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-600 mt-0.5">•</span>
            <span>Important updates to opportunities</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-600 mt-0.5">•</span>
            <span>Team collaboration notifications</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PushNotificationSettings;
