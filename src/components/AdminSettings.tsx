import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, AlertCircle, CheckCircle, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { saveSitemap } from '../lib/sitemap';
import PushNotificationSettings from './PushNotificationSettings';

const AdminSettings: React.FC = () => {
  const [ga4MeasurementId, setGa4MeasurementId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generatingSitemap, setGeneratingSitemap] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'ga4_measurement_id')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setGa4MeasurementId(data.setting_value || '');
      }
    } catch (err) {
      console.error('Error loading settings:', err);
      setMessage({ type: 'error', text: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          setting_key: 'ga4_measurement_id',
          setting_value: ga4MeasurementId.trim()
        }, {
          onConflict: 'setting_key'
        });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      setTimeout(() => setMessage(null), 5000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateSitemap = async () => {
    setGeneratingSitemap(true);
    setMessage(null);

    try {
      await saveSitemap();
      setMessage({ type: 'success', text: 'Sitemap generated and downloaded successfully!' });
      setTimeout(() => setMessage(null), 5000);
    } catch (err) {
      console.error('Error generating sitemap:', err);
      setMessage({ type: 'error', text: 'Failed to generate sitemap' });
    } finally {
      setGeneratingSitemap(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <SettingsIcon className="w-6 h-6 text-primary-blue" />
        <h2 className="text-2xl font-semibold text-gray-900">Site Settings</h2>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          {message && (
            <div
              className={`p-4 rounded-lg flex items-center gap-3 ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics</h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="ga4_measurement_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Google Analytics 4 Measurement ID
                </label>
                <input
                  type="text"
                  id="ga4_measurement_id"
                  value={ga4MeasurementId}
                  onChange={(e) => setGa4MeasurementId(e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Enter your GA4 Measurement ID to enable tracking. Format: G-XXXXXXXXXX
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">How to find your GA4 Measurement ID:</h4>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Go to Google Analytics</li>
                  <li>Click Admin (gear icon) in the bottom left</li>
                  <li>Select your property</li>
                  <li>Click Data Streams</li>
                  <li>Select your web stream</li>
                  <li>Copy the Measurement ID (starts with "G-")</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO & Sitemap</h3>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Generate an XML sitemap for search engines. The sitemap will automatically include all published blog posts that are not marked as noindex.
              </p>

              <button
                onClick={handleGenerateSitemap}
                disabled={generatingSitemap}
                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                {generatingSitemap ? 'Generating...' : 'Generate & Download Sitemap'}
              </button>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">Sitemap Information:</h4>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Includes all published blog posts with scheduled dates in the past</li>
                  <li>Excludes posts marked as "noindex"</li>
                  <li>Automatically updates with latest post modification dates</li>
                  <li>Upload the generated sitemap.xml to your website root</li>
                  <li>Submit to Google Search Console for faster indexing</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              onClick={saveSettings}
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      )}

      {!loading && (
        <div className="mt-6">
          <PushNotificationSettings />
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
