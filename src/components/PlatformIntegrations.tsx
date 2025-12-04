import React, { useState } from 'react';
import { usePlatformIntegrations } from '../hooks/usePlatformIntegrations';
import {
  Search,
  Settings,
  Check,
  X,
  ExternalLink,
  Book,
  Plug,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import ConnectionGuideModal from './ConnectionGuideModal';

const platformIcons: Record<string, string> = {
  google_ads: '🎯',
  meta_ads: '📘',
  google_analytics: '📊',
  youtube: '📺',
  instagram: '📸',
  facebook: '👥',
  google_my_business: '📍',
  tiktok: '🎵',
  pinterest: '📌',
  reddit: '🤖',
};

const platformColors: Record<string, string> = {
  google_ads: 'bg-blue-500',
  meta_ads: 'bg-blue-600',
  google_analytics: 'bg-orange-500',
  youtube: 'bg-red-600',
  instagram: 'bg-pink-500',
  facebook: 'bg-blue-700',
  google_my_business: 'bg-green-600',
  tiktok: 'bg-black',
  pinterest: 'bg-red-500',
  reddit: 'bg-orange-600',
};

const PlatformIntegrations: React.FC = () => {
  const { integrations, loading, disconnectPlatform } = usePlatformIntegrations();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);

  const filteredIntegrations = integrations.filter((integration) =>
    integration.platform_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConnect = (platformType: string) => {
    setSelectedPlatform(platformType);
    setShowGuideModal(true);
  };

  const handleDisconnect = async (platformType: string) => {
    if (!confirm('Are you sure you want to disconnect this platform?')) return;

    setDisconnecting(platformType);
    await disconnectPlatform(platformType);
    setDisconnecting(null);
  };

  const connectedCount = integrations.filter((i) => i.is_connected).length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Platform Integrations</h1>
        <p className="text-gray-600">
          Connect your marketing platforms to sync data and manage campaigns
        </p>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search platforms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
          />
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{connectedCount}</span> of{' '}
          {integrations.length} platforms connected
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary-blue" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIntegrations.map((integration) => {
            const isConnected = integration.is_connected;
            const icon = platformIcons[integration.platform_type] || '🔗';
            const color = platformColors[integration.platform_type] || 'bg-gray-500';

            return (
              <div
                key={integration.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-2xl`}
                    >
                      {icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {integration.platform_name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {isConnected ? 'Connected' : 'Not connected'}
                      </p>
                    </div>
                  </div>
                  {isConnected && (
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                  )}
                </div>

                {isConnected && integration.last_synced_at && (
                  <div className="mb-4 text-xs text-gray-500">
                    Last synced:{' '}
                    {new Date(integration.last_synced_at).toLocaleDateString()}
                  </div>
                )}

                {integration.error_message && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-red-700">{integration.error_message}</p>
                  </div>
                )}

                <div className="flex space-x-2">
                  {isConnected ? (
                    <>
                      <button
                        onClick={() => handleConnect(integration.platform_type)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </button>
                      <button
                        onClick={() => handleDisconnect(integration.platform_type)}
                        disabled={disconnecting === integration.platform_type}
                        className="flex-1 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium flex items-center justify-center space-x-2 disabled:opacity-50"
                      >
                        {disconnecting === integration.platform_type ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Disconnecting...</span>
                          </>
                        ) : (
                          <>
                            <X className="w-4 h-4" />
                            <span>Disconnect</span>
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleConnect(integration.platform_type)}
                      className="flex-1 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
                    >
                      <Plug className="w-4 h-4" />
                      <span>Connect</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedPlatform(integration.platform_type);
                      setShowGuideModal(true);
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Book className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showGuideModal && selectedPlatform && (
        <ConnectionGuideModal
          platformType={selectedPlatform}
          isConnected={
            integrations.find((i) => i.platform_type === selectedPlatform)?.is_connected ||
            false
          }
          onClose={() => {
            setShowGuideModal(false);
            setSelectedPlatform(null);
          }}
        />
      )}
    </div>
  );
};

export default PlatformIntegrations;
