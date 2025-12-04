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
        <div className="max-w-5xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Connect Google Analytics
              </h2>
              <p className="text-gray-600 mb-6">
                Follow the step-by-step guide below to connect your Google Analytics account
              </p>
            </div>

            <div className="space-y-8">
              <div className="border-l-4 border-primary-blue pl-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Step 1: Access Google Analytics
                </h3>
                <p className="text-gray-700 mb-3">
                  Start by logging into your Google Analytics account where your website data is tracked
                </p>
                <ul className="space-y-2 text-sm text-gray-600 ml-4">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Go to <a href="https://analytics.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary-blue hover:underline">https://analytics.google.com/</a></span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Sign in with the Google account that has access to your Analytics property</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Make sure you can see your website data in the dashboard</span>
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-primary-blue pl-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Step 2: Find Your GA4 Property ID
                </h3>
                <p className="text-gray-700 mb-3">
                  Locate your unique Property ID that identifies your website in Google Analytics
                </p>
                <ul className="space-y-2 text-sm text-gray-600 ml-4">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>In Google Analytics, click the gear icon (Admin) in the bottom left corner</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>In the middle column, select the Property you want to connect</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Click on "Property Settings" in the Property column</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Find the "PROPERTY ID" field at the top of the page</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span className="font-semibold">Copy ONLY the numeric Property ID (e.g., 123456789)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span className="font-semibold text-red-600">IMPORTANT: Do NOT include "properties/" prefix or any other text</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Save this number - you will need it in the final step</span>
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-primary-blue pl-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Step 3: Create a Google Cloud Project
                </h3>
                <p className="text-gray-700 mb-3">
                  Set up a new project in Google Cloud Console to manage API access
                </p>
                <ul className="space-y-2 text-sm text-gray-600 ml-4">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary-blue hover:underline">https://console.cloud.google.com/</a></span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Click "Select a project" at the top of the page</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Click "New Project" in the popup window</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Enter a project name (e.g., "My Analytics Integration")</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Leave organization blank unless you have one</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Click "Create" and wait for the project to be created</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Make sure your new project is selected in the top dropdown</span>
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-primary-blue pl-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Step 4: Enable Google Analytics Data API
                </h3>
                <p className="text-gray-700 mb-3">
                  Activate the API that allows this application to read your Analytics data
                </p>
                <ul className="space-y-2 text-sm text-gray-600 ml-4">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Go to <a href="https://console.cloud.google.com/apis/library" target="_blank" rel="noopener noreferrer" className="text-primary-blue hover:underline">https://console.cloud.google.com/apis/library</a></span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Make sure your project is selected at the top</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>In the search bar, type "Google Analytics Data API"</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Click on "Google Analytics Data API" from the results</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Click the blue "Enable" button</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Wait for the API to be enabled (takes a few seconds)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>You should see "API enabled" confirmation</span>
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-primary-blue pl-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Step 5: Configure OAuth Consent Screen
                </h3>
                <p className="text-gray-700 mb-3">
                  Set up the consent screen that will appear when authorizing access
                </p>
                <ul className="space-y-2 text-sm text-gray-600 ml-4">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Go to <a href="https://console.cloud.google.com/apis/credentials/consent" target="_blank" rel="noopener noreferrer" className="text-primary-blue hover:underline">https://console.cloud.google.com/apis/credentials/consent</a></span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Select "External" as User Type and click "Create"</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Fill in required fields: App name (e.g., "My Analytics App")</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Add your email address for User support email</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Add your email address for Developer contact information</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Click "Save and Continue" at the bottom</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>On the Scopes page, click "Save and Continue" (we will add scopes later)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>On Test users page, click "Add Users" and add your email</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Click "Save and Continue" and then "Back to Dashboard"</span>
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-primary-blue pl-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Step 6: Create OAuth 2.0 Credentials
                </h3>
                <p className="text-gray-700 mb-3">
                  Generate the Client ID and Secret needed for authentication
                </p>
                <ul className="space-y-2 text-sm text-gray-600 ml-4">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-primary-blue hover:underline">https://console.cloud.google.com/apis/credentials</a></span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Click "Create Credentials" at the top</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Select "OAuth client ID" from the dropdown</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Choose "Web application" as the Application type</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Enter a name (e.g., "Analytics OAuth Client")</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Under "Authorized redirect URIs", click "Add URI"</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span className="font-semibold">Enter: https://developers.google.com/oauthplayground</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Click "Create" at the bottom</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>A popup will show your Client ID and Client Secret</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span className="font-semibold">IMPORTANT: Copy both and save them somewhere safe</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Click "OK" to close the popup</span>
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-primary-blue pl-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Step 7: Generate Your Access Token
                </h3>
                <p className="text-gray-700 mb-3">
                  Use Google OAuth Playground to create an access token with the correct permissions
                </p>
                <ul className="space-y-2 text-sm text-gray-600 ml-4">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Go to <a href="https://developers.google.com/oauthplayground/" target="_blank" rel="noopener noreferrer" className="text-primary-blue hover:underline">https://developers.google.com/oauthplayground/</a></span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Click the gear icon (Settings) in the top right corner</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Check the box "Use your own OAuth credentials"</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Paste your Client ID in the "OAuth Client ID" field</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Paste your Client Secret in the "OAuth Client secret" field</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Close the settings panel</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>In the left panel under "Step 1", scroll down or search for "Google Analytics Data API v1"</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span className="font-semibold">Expand it and select "https://www.googleapis.com/auth/analytics.readonly"</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Click the blue "Authorize APIs" button</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Sign in with your Google account if prompted</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Click "Allow" to grant access to your Analytics data</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>You will be redirected back to OAuth Playground</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>In "Step 2", click "Exchange authorization code for tokens"</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>You will see an "Access token" appear in the response</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span className="font-semibold text-red-600">IMPORTANT: Copy the "Access token" value (NOT the refresh token)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>This is the token you will paste into the connection form</span>
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-6 bg-green-50 p-4 rounded">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Step 8: Connect to This Application
                </h3>
                <p className="text-gray-700 mb-3">
                  Now you're ready to connect! Go to the integrations page to enter your credentials.
                </p>
                <Link
                  to="/crm/integrations"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <span>Go to Integrations Page</span>
                </Link>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>Important Notes</span>
                </h4>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Access tokens expire after 1 hour - you will need to regenerate them by repeating Step 7</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Make sure the Google account you use has Viewer access (or higher) to your Analytics property</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Use GA4 properties only - Universal Analytics (UA-XXXXX) properties are deprecated</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Keep your Client ID, Client Secret, and Access Token secure and never share them publicly</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>The Property ID should be only numbers - if you see "properties/123456789" in the URL, use only "123456789"</span>
                  </li>
                </ul>
              </div>
            </div>
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
        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Error Loading Data</h3>
              <p className="text-red-700 text-sm">{error}</p>
              <p className="text-red-600 text-xs mt-2">
                This may be due to expired credentials. Please follow the setup guide below to reconnect.
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Google Analytics Setup Guide
            </h2>

            <div className="space-y-8">
              <div className="border-l-4 border-primary-blue pl-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Step 1: Access Google Analytics
                </h3>
                <p className="text-gray-700 mb-3">
                  Start by logging into your Google Analytics account where your website data is tracked
                </p>
                <ul className="space-y-2 text-sm text-gray-600 ml-4">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Go to <a href="https://analytics.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary-blue hover:underline">https://analytics.google.com/</a></span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Sign in with the Google account that has access to your Analytics property</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Make sure you can see your website data in the dashboard</span>
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-primary-blue pl-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Step 2: Find Your GA4 Property ID
                </h3>
                <p className="text-gray-700 mb-3">
                  Locate your unique Property ID that identifies your website in Google Analytics
                </p>
                <ul className="space-y-2 text-sm text-gray-600 ml-4">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>In Google Analytics, click the gear icon (Admin) in the bottom left corner</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>In the middle column, select the Property you want to connect</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Click on "Property Settings" in the Property column</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Find the "PROPERTY ID" field at the top of the page</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span className="font-semibold">Copy ONLY the numeric Property ID (e.g., 123456789)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span className="font-semibold text-red-600">IMPORTANT: Do NOT include "properties/" prefix or any other text</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Save this number - you will need it in the final step</span>
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-primary-blue pl-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Step 3: Create a Google Cloud Project
                </h3>
                <p className="text-gray-700 mb-3">
                  Set up a new project in Google Cloud Console to manage API access
                </p>
                <ul className="space-y-2 text-sm text-gray-600 ml-4">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary-blue hover:underline">https://console.cloud.google.com/</a></span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Click "Select a project" at the top of the page</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Click "New Project" in the popup window</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Enter a project name (e.g., "My Analytics Integration")</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Leave organization blank unless you have one</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Click "Create" and wait for the project to be created</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Make sure your new project is selected in the top dropdown</span>
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-primary-blue pl-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Step 4: Enable Google Analytics Data API
                </h3>
                <p className="text-gray-700 mb-3">
                  Activate the API that allows this application to read your Analytics data
                </p>
                <ul className="space-y-2 text-sm text-gray-600 ml-4">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Go to <a href="https://console.cloud.google.com/apis/library" target="_blank" rel="noopener noreferrer" className="text-primary-blue hover:underline">https://console.cloud.google.com/apis/library</a></span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Make sure your project is selected at the top</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>In the search bar, type "Google Analytics Data API"</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Click on "Google Analytics Data API" from the results</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Click the blue "Enable" button</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Wait for the API to be enabled (takes a few seconds)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>You should see "API enabled" confirmation</span>
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-primary-blue pl-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Step 5: Configure OAuth Consent Screen
                </h3>
                <p className="text-gray-700 mb-3">
                  Set up the consent screen that will appear when authorizing access
                </p>
                <ul className="space-y-2 text-sm text-gray-600 ml-4">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Go to <a href="https://console.cloud.google.com/apis/credentials/consent" target="_blank" rel="noopener noreferrer" className="text-primary-blue hover:underline">https://console.cloud.google.com/apis/credentials/consent</a></span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Select "External" as User Type and click "Create"</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Fill in required fields: App name (e.g., "My Analytics App")</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Add your email address for User support email</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Add your email address for Developer contact information</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Click "Save and Continue" at the bottom</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>On the Scopes page, click "Save and Continue" (we will add scopes later)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>On Test users page, click "Add Users" and add your email</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Click "Save and Continue" and then "Back to Dashboard"</span>
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-primary-blue pl-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Step 6: Create OAuth 2.0 Credentials
                </h3>
                <p className="text-gray-700 mb-3">
                  Generate the Client ID and Secret needed for authentication
                </p>
                <ul className="space-y-2 text-sm text-gray-600 ml-4">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-primary-blue hover:underline">https://console.cloud.google.com/apis/credentials</a></span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Click "Create Credentials" at the top</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Select "OAuth client ID" from the dropdown</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Choose "Web application" as the Application type</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Enter a name (e.g., "Analytics OAuth Client")</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Under "Authorized redirect URIs", click "Add URI"</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span className="font-semibold">Enter: https://developers.google.com/oauthplayground</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Click "Create" at the bottom</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>A popup will show your Client ID and Client Secret</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span className="font-semibold">IMPORTANT: Copy both and save them somewhere safe</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Click "OK" to close the popup</span>
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-primary-blue pl-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Step 7: Generate Your Access Token
                </h3>
                <p className="text-gray-700 mb-3">
                  Use Google OAuth Playground to create an access token with the correct permissions
                </p>
                <ul className="space-y-2 text-sm text-gray-600 ml-4">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Go to <a href="https://developers.google.com/oauthplayground/" target="_blank" rel="noopener noreferrer" className="text-primary-blue hover:underline">https://developers.google.com/oauthplayground/</a></span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Click the gear icon (Settings) in the top right corner</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Check the box "Use your own OAuth credentials"</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Paste your Client ID in the "OAuth Client ID" field</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Paste your Client Secret in the "OAuth Client secret" field</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Close the settings panel</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>In the left panel under "Step 1", scroll down or search for "Google Analytics Data API v1"</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span className="font-semibold">Expand it and select "https://www.googleapis.com/auth/analytics.readonly"</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Click the blue "Authorize APIs" button</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Sign in with your Google account if prompted</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Click "Allow" to grant access to your Analytics data</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>You will be redirected back to OAuth Playground</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>In "Step 2", click "Exchange authorization code for tokens"</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>You will see an "Access token" appear in the response</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span className="font-semibold text-red-600">IMPORTANT: Copy the "Access token" value (NOT the refresh token)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>This is the token you will paste into the connection form</span>
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-6 bg-green-50 p-4 rounded">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Step 8: Connect to This Application
                </h3>
                <p className="text-gray-700 mb-3">
                  Now you're ready to connect! Go to the integrations page to enter your credentials.
                </p>
                <Link
                  to="/crm/integrations"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <span>Go to Integrations Page</span>
                </Link>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>Important Notes</span>
                </h4>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Access tokens expire after 1 hour - you will need to regenerate them by repeating Step 7</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Make sure the Google account you use has Viewer access (or higher) to your Analytics property</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Use GA4 properties only - Universal Analytics (UA-XXXXX) properties are deprecated</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Keep your Client ID, Client Secret, and Access Token secure and never share them publicly</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>The Property ID should be only numbers - if you see "properties/123456789" in the URL, use only "123456789"</span>
                  </li>
                </ul>
              </div>
            </div>
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
