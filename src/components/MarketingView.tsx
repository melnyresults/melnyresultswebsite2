import React, { useState } from 'react';
import PlatformIntegrations from './PlatformIntegrations';
import GoogleAnalyticsDashboard from './GoogleAnalyticsDashboard';
import { Plug, Activity } from 'lucide-react';

type MarketingTab = 'integrations' | 'analytics';

const MarketingView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MarketingTab>('integrations');

  const tabs = [
    { id: 'integrations' as MarketingTab, label: 'Platform Integrations', icon: Plug },
    { id: 'analytics' as MarketingTab, label: 'Google Analytics', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-8 pt-6 pb-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Marketing</h1>
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 font-medium rounded-t-lg transition-colors ${
                    isActive
                      ? 'bg-gray-50 text-primary-blue border-b-2 border-primary-blue'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-gray-50">
        {activeTab === 'integrations' && <PlatformIntegrations />}
        {activeTab === 'analytics' && <GoogleAnalyticsDashboard />}
      </div>
    </div>
  );
};

export default MarketingView;
