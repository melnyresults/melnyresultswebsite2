import React, { useState } from 'react';
import { X, ExternalLink, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { usePlatformIntegrations } from '../hooks/usePlatformIntegrations';
import { platformGuides } from '../lib/platform-guides';

type ConnectionGuideModalProps = {
  platformType: string;
  isConnected: boolean;
  onClose: () => void;
};

const ConnectionGuideModal: React.FC<ConnectionGuideModalProps> = ({
  platformType,
  isConnected,
  onClose,
}) => {
  const { connectPlatform } = usePlatformIntegrations();
  const [showGuide, setShowGuide] = useState(!isConnected);
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const guide = platformGuides[platformType];

  if (!guide) {
    return null;
  }

  const handleConnect = async () => {
    const missingFields = guide.fields.filter((field) => !credentials[field.name]);

    if (missingFields.length > 0) {
      setError(`Please fill in: ${missingFields.map((f) => f.label).join(', ')}`);
      return;
    }

    setConnecting(true);
    setError(null);

    const result = await connectPlatform(platformType, credentials);

    setConnecting(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      setError(result.error || 'Failed to connect platform');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`text-3xl`}>{guide.icon}</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{guide.name}</h2>
              <p className="text-sm text-gray-600">
                {isConnected ? 'Update connection settings' : 'Connect your account'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!isConnected && (
            <div className="mb-6">
              <button
                onClick={() => setShowGuide(!showGuide)}
                className="flex items-center space-x-2 text-primary-blue hover:text-blue-700 font-medium text-sm"
              >
                <span>{showGuide ? 'Hide' : 'Show'} Setup Guide</span>
              </button>
            </div>
          )}

          {showGuide && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                How to Connect {guide.name}
              </h3>

              <div className="space-y-6">
                {guide.steps.map((step, index) => (
                  <div key={index} className="flex space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-blue text-white rounded-full flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
                      <p className="text-gray-600 text-sm mb-2">{step.description}</p>
                      {step.url && (
                        <a
                          href={step.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-primary-blue hover:text-blue-700 text-sm font-medium"
                        >
                          <span>Open {guide.name} Settings</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {step.substeps && (
                        <ul className="mt-2 space-y-1">
                          {step.substeps.map((substep, subIndex) => (
                            <li
                              key={subIndex}
                              className="text-sm text-gray-600 pl-4 flex items-start"
                            >
                              <span className="mr-2">•</span>
                              <span>{substep}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {guide.notes && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">Important Notes</h4>
                      <ul className="space-y-1">
                        {guide.notes.map((note, index) => (
                          <li key={index} className="text-sm text-blue-800">
                            • {note}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {isConnected ? 'Update Credentials' : 'Enter Credentials'}
            </h3>

            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-green-800 font-medium">Successfully connected!</p>
              </div>
            )}

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-800">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              {guide.fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={credentials[field.name] || ''}
                      onChange={(e) =>
                        setCredentials({ ...credentials, [field.name]: e.target.value })
                      }
                      placeholder={field.placeholder}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={credentials[field.name] || ''}
                      onChange={(e) =>
                        setCredentials({ ...credentials, [field.name]: e.target.value })
                      }
                      placeholder={field.placeholder}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                    />
                  )}
                  {field.description && (
                    <p className="mt-1 text-xs text-gray-500">{field.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleConnect}
            disabled={connecting || success}
            className="px-6 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 flex items-center space-x-2"
          >
            {connecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Connecting...</span>
              </>
            ) : success ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Connected!</span>
              </>
            ) : (
              <span>{isConnected ? 'Update' : 'Connect'}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectionGuideModal;
