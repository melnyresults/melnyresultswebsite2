import React, { useState } from 'react';
import { useGoogleAnalytics } from '../hooks/useGoogleAnalytics';
import {
  Users,
  MousePointerClick,
  Eye,
  TrendingUp,
  Clock,
  Target,
  RefreshCw,
  AlertCircle,
  Calendar,
  Activity,
  BarChart3,
  Loader2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

type MetricCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color: string;
};

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, trend, color }) => (
  <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
        {icon}
      </div>
      {trend && (
        <span className="text-sm font-medium text-green-600 flex items-center space-x-1">
          <TrendingUp className="w-4 h-4" />
          <span>{trend}</span>
        </span>
      )}
    </div>
    <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
  </div>
);

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toLocaleString();
};

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}m ${remainingSeconds}s`;
};

const formatDate = (dateStr: string): string => {
  if (dateStr.length === 8) {
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    return `${month}/${day}`;
  }
  return dateStr;
};

const GoogleAnalyticsDashboard: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState('30daysAgo');
  const { data, loading, error, isConnected, lastSynced, updateDateRange, refresh } =
    useGoogleAnalytics({
      startDate: selectedRange,
      endDate: 'today',
    });

  const handleDateRangeChange = (range: string) => {
    setSelectedRange(range);
    updateDateRange({ startDate: range, endDate: 'today' });
  };

  if (!isConnected && !loading) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Connect Google Analytics
            </h2>
            <p className="text-gray-600 mb-6">
              Connect your Google Analytics account to view website traffic and engagement
              metrics.
            </p>
            <Link
              to="/crm/integrations"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <span>Go to Integrations</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
              <Activity className="w-8 h-8 text-orange-600" />
              <span>Google Analytics</span>
            </h1>
            <p className="text-gray-600 mt-2">
              Monitor your website traffic, user behavior, and conversions
            </p>
          </div>
          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
        {lastSynced && (
          <p className="text-sm text-gray-500">
            Last synced: {new Date(lastSynced).toLocaleString()}
          </p>
        )}
      </div>

      <div className="mb-6 flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Date Range:</span>
        </div>
        <div className="flex space-x-2">
          {[
            { label: 'Last 7 Days', value: '7daysAgo' },
            { label: 'Last 30 Days', value: '30daysAgo' },
            { label: 'Last 90 Days', value: '90daysAgo' },
            { label: 'Last Year', value: '365daysAgo' },
          ].map((range) => (
            <button
              key={range.value}
              onClick={() => handleDateRangeChange(range.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedRange === range.value
                  ? 'bg-primary-blue text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {loading && !data ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary-blue mx-auto mb-4" />
            <p className="text-gray-600">Loading analytics data...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start space-x-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900 mb-1">Error Loading Data</h3>
            <p className="text-red-700 text-sm">{error}</p>
            <p className="text-red-600 text-xs mt-2">
              This may be due to expired credentials. Please reconnect your Google Analytics
              account in the integrations page.
            </p>
          </div>
        </div>
      ) : data ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <MetricCard
              title="Active Users"
              value={formatNumber(data.activeUsers)}
              icon={<Users className="w-6 h-6 text-white" />}
              color="bg-blue-500"
            />
            <MetricCard
              title="Sessions"
              value={formatNumber(data.sessions)}
              icon={<MousePointerClick className="w-6 h-6 text-white" />}
              color="bg-green-500"
            />
            <MetricCard
              title="Page Views"
              value={formatNumber(data.pageViews)}
              icon={<Eye className="w-6 h-6 text-white" />}
              color="bg-purple-500"
            />
            <MetricCard
              title="Bounce Rate"
              value={`${data.bounceRate.toFixed(1)}%`}
              icon={<TrendingUp className="w-6 h-6 text-white" />}
              color="bg-orange-500"
            />
            <MetricCard
              title="Avg. Session Duration"
              value={formatDuration(data.avgSessionDuration)}
              icon={<Clock className="w-6 h-6 text-white" />}
              color="bg-indigo-500"
            />
            <MetricCard
              title="Conversions"
              value={formatNumber(data.conversions)}
              icon={<Target className="w-6 h-6 text-white" />}
              color="bg-pink-500"
            />
          </div>

          {data.chartData && data.chartData.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <BarChart3 className="w-6 h-6 text-primary-blue" />
                  <span>Traffic Trends</span>
                </h2>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">Users</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Sessions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-600">Page Views</span>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <div className="min-w-full">
                  <div className="relative h-64">
                    {data.chartData.map((item, index) => {
                      const maxValue = Math.max(
                        ...data.chartData.map((d) =>
                          Math.max(d.users, d.sessions, d.pageViews)
                        )
                      );
                      const usersHeight = (item.users / maxValue) * 100;
                      const sessionsHeight = (item.sessions / maxValue) * 100;
                      const pageViewsHeight = (item.pageViews / maxValue) * 100;

                      return (
                        <div
                          key={index}
                          className="inline-block align-bottom mr-2"
                          style={{ width: `${Math.max(100 / data.chartData.length, 3)}%` }}
                        >
                          <div className="flex flex-col items-center h-64">
                            <div className="flex-1 flex items-end justify-center space-x-1 w-full">
                              <div
                                className="bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer group relative"
                                style={{
                                  height: `${usersHeight}%`,
                                  width: '30%',
                                  minHeight: usersHeight > 0 ? '4px' : '0',
                                }}
                                title={`Users: ${item.users}`}
                              >
                                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                  {item.users}
                                </div>
                              </div>
                              <div
                                className="bg-green-500 rounded-t hover:bg-green-600 transition-colors cursor-pointer group relative"
                                style={{
                                  height: `${sessionsHeight}%`,
                                  width: '30%',
                                  minHeight: sessionsHeight > 0 ? '4px' : '0',
                                }}
                                title={`Sessions: ${item.sessions}`}
                              >
                                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                  {item.sessions}
                                </div>
                              </div>
                              <div
                                className="bg-purple-500 rounded-t hover:bg-purple-600 transition-colors cursor-pointer group relative"
                                style={{
                                  height: `${pageViewsHeight}%`,
                                  width: '30%',
                                  minHeight: pageViewsHeight > 0 ? '4px' : '0',
                                }}
                                title={`Page Views: ${item.pageViews}`}
                              >
                                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                  {item.pageViews}
                                </div>
                              </div>
                            </div>
                            <div className="text-xs text-gray-600 mt-2 transform -rotate-45 origin-top-left whitespace-nowrap">
                              {formatDate(item.date)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <Activity className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">About This Data</h4>
                <p className="text-blue-800 text-sm">
                  This dashboard shows data from your connected Google Analytics property. Data
                  is fetched in real-time when you load or refresh this page. For the most
                  accurate reporting, please refer to your Google Analytics dashboard.
                </p>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default GoogleAnalyticsDashboard;
