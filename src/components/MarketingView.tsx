import React from 'react';
import { TrendingUp, Target, BarChart3, Globe } from 'lucide-react';

const MarketingView: React.FC = () => {
  const integrations = [
    {
      name: 'Google Ads',
      description: 'Track and manage your Google Ads campaigns',
      icon: Target,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      name: 'Meta Ads',
      description: 'Monitor Facebook and Instagram ad performance',
      icon: TrendingUp,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      name: 'Google Analytics',
      description: 'View website traffic and user behavior insights',
      icon: BarChart3,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      name: 'YouTube',
      description: 'Track video performance and engagement',
      icon: Globe,
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
    },
    {
      name: 'Instagram',
      description: 'Monitor social media metrics and engagement',
      icon: TrendingUp,
      color: 'pink',
      bgColor: 'bg-pink-100',
      textColor: 'text-pink-600',
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketing Integrations</h1>
        <p className="text-gray-600">
          Connect your marketing platforms to track performance and ROI in one place
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => {
          const Icon = integration.icon;
          return (
            <div
              key={integration.name}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-primary-blue transition-colors"
            >
              <div className={`w-12 h-12 rounded-lg ${integration.bgColor} flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 ${integration.textColor}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{integration.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{integration.description}</p>
              <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                Connect
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon</h3>
        <p className="text-gray-700">
          Marketing integrations are currently being developed. You'll be able to connect all your marketing
          platforms and view unified analytics, ROI tracking, and campaign performance metrics from this dashboard.
        </p>
      </div>
    </div>
  );
};

export default MarketingView;
