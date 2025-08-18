import React, { useState } from 'react';
import { MessageCircle, Filter } from 'lucide-react';

interface AdminCommentsProps {
  token?: string;
}

const AdminComments: React.FC<AdminCommentsProps> = () => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-6 h-6 text-primary-blue" />
          <h2 className="text-2xl font-semibold text-gray-900">Comments Management</h2>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <Filter className="w-5 h-5 text-gray-500" />
        <div className="flex bg-gray-100 rounded-lg p-1">
          {(['all', 'pending', 'approved'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-white text-primary-blue shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Disabled Message */}
      <div className="text-center py-12 bg-gray-50 rounded-2xl">
        <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">
          Comment management is currently disabled while we focus on frontend development.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Database integration will be added later.
        </p>
      </div>
    </div>
  );
};

export default AdminComments;