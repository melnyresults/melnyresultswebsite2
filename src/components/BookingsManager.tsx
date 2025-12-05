import React, { useState } from 'react';
import { useBookings } from '../hooks/useBookings';
import { Calendar, Clock, Mail, Phone, X, Check } from 'lucide-react';
import { formatDateLong, formatTimeSlot } from '../lib/timeUtils';

export const BookingsManager: React.FC = () => {
  const { bookings, loading, cancelBooking, confirmBooking } = useBookings();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredBookings =
    selectedStatus === 'all'
      ? bookings
      : bookings.filter((b) => b.status === selectedStatus);

  const handleCancel = async (id: string) => {
    const reason = prompt('Reason for cancellation (optional):');
    try {
      await cancelBooking(id, reason || undefined);
    } catch (error) {
      alert('Failed to cancel booking');
    }
  };

  const handleConfirm = async (id: string) => {
    try {
      await confirmBooking(id);
    } catch (error) {
      alert('Failed to confirm booking');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-gray-100 text-gray-800',
    };
    return styles[status as keyof typeof styles] || styles.confirmed;
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bookings</h2>
          <p className="text-gray-600 mt-1">Manage your scheduled meetings</p>
        </div>
      </div>

      <div className="flex space-x-2 mb-6">
        {['all', 'confirmed', 'pending', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
              selectedStatus === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-600">
            {selectedStatus === 'all'
              ? 'You have no bookings yet'
              : `No ${selectedStatus} bookings`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div
                    className="w-1 h-16 rounded"
                    style={{ backgroundColor: booking.event_types.color }}
                  ></div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {booking.event_types.name}
                    </h3>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDateLong(new Date(booking.start_time), booking.timezone)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          {formatTimeSlot(new Date(booking.start_time), booking.timezone)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                    booking.status
                  )}`}
                >
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm">
                  <span className="font-medium text-gray-700">Guest:</span>
                  <span className="text-gray-900">{booking.guest_name}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <a
                    href={`mailto:${booking.guest_email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {booking.guest_email}
                  </a>
                </div>
                {booking.guest_phone && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{booking.guest_phone}</span>
                  </div>
                )}
                {booking.notes && (
                  <div className="mt-2 p-3 bg-gray-50 rounded text-sm">
                    <span className="font-medium text-gray-700">Notes: </span>
                    <span className="text-gray-900">{booking.notes}</span>
                  </div>
                )}
              </div>

              {(booking.status === 'confirmed' || booking.status === 'pending') && (
                <div className="flex space-x-2 pt-4 border-t border-gray-200">
                  {booking.status === 'pending' && (
                    <button
                      onClick={() => handleConfirm(booking.id)}
                      className="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      <span>Confirm</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleCancel(booking.id)}
                    className="flex items-center space-x-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
