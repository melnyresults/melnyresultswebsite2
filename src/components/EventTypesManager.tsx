import React, { useState } from 'react';
import { useEventTypes, EventType } from '../hooks/useEventTypes';
import { Plus, Edit2, Trash2, Copy, ExternalLink, Power, PowerOff, Calendar } from 'lucide-react';
import { EventTypeModal } from './EventTypeModal';
import { formatDuration } from '../lib/timeUtils';

export const EventTypesManager: React.FC = () => {
  const { eventTypes, loading, deleteEventType, toggleActive } = useEventTypes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventType, setEditingEventType] = useState<EventType | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreate = () => {
    setEditingEventType(null);
    setIsModalOpen(true);
  };

  const handleEdit = (eventType: EventType) => {
    setEditingEventType(eventType);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event type? This action cannot be undone.')) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteEventType(id);
    } catch (error) {
      alert('Failed to delete event type');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await toggleActive(id, !isActive);
    } catch (error) {
      alert('Failed to update event type status');
    }
  };

  const copyBookingLink = (username: string, slug: string) => {
    const link = `${window.location.origin}/book/${username}/${slug}`;
    navigator.clipboard.writeText(link);
    alert('Booking link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading event types...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Event Types</h2>
          <p className="text-gray-600 mt-1">Create and manage your meeting types</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>New Event Type</span>
        </button>
      </div>

      {eventTypes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No event types yet</h3>
          <p className="text-gray-600 mb-6">Create your first event type to start accepting bookings</p>
          <button
            onClick={handleCreate}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Create Event Type</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {eventTypes.map((eventType) => (
            <div
              key={eventType.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: eventType.color }}
                  ></div>
                  <h3 className="font-semibold text-gray-900">{eventType.name}</h3>
                </div>
                <button
                  onClick={() => handleToggleActive(eventType.id, eventType.is_active)}
                  className={`p-1 rounded ${
                    eventType.is_active
                      ? 'text-green-600 hover:bg-green-50'
                      : 'text-gray-400 hover:bg-gray-100'
                  }`}
                  title={eventType.is_active ? 'Active' : 'Inactive'}
                >
                  {eventType.is_active ? (
                    <Power className="w-5 h-5" />
                  ) : (
                    <PowerOff className="w-5 h-5" />
                  )}
                </button>
              </div>

              {eventType.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {eventType.description}
                </p>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium text-gray-900">
                    {formatDuration(eventType.duration)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {eventType.location_type.replace('_', ' ')}
                  </span>
                </div>
                {eventType.requires_confirmation && (
                  <div className="flex items-center text-sm text-amber-600">
                    <span>Requires confirmation</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => copyBookingLink('username', eventType.slug)}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  title="Copy booking link"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Link</span>
                </button>
                <button
                  onClick={() => handleEdit(eventType)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(eventType.id)}
                  disabled={deletingId === eventType.id}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <EventTypeModal
          eventType={editingEventType}
          onClose={() => {
            setIsModalOpen(false);
            setEditingEventType(null);
          }}
        />
      )}
    </div>
  );
};
