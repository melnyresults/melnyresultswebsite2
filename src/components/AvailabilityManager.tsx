import React, { useState, useEffect } from 'react';
import { useAvailability } from '../hooks/useAvailability';
import { Plus, Trash2, Clock } from 'lucide-react';

export const AvailabilityManager: React.FC = () => {
  const {
    schedules,
    slots,
    loading,
    fetchSlots,
    createSchedule,
    createSlot,
    deleteSlot,
    setDefaultSchedule,
    DAYS_OF_WEEK,
  } = useAvailability();

  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
  const [addingSlot, setAddingSlot] = useState(false);
  const [newSlot, setNewSlot] = useState({
    day_of_week: 1,
    start_time: '09:00',
    end_time: '17:00',
  });

  useEffect(() => {
    if (schedules.length > 0 && !selectedScheduleId) {
      const defaultSchedule = schedules.find(s => s.is_default) || schedules[0];
      setSelectedScheduleId(defaultSchedule.id);
    }
  }, [schedules, selectedScheduleId]);

  useEffect(() => {
    if (selectedScheduleId) {
      fetchSlots(selectedScheduleId);
    }
  }, [selectedScheduleId]);

  const handleCreateSchedule = async () => {
    const name = prompt('Enter schedule name:');
    if (!name) return;

    try {
      const schedule = await createSchedule({
        name,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      setSelectedScheduleId(schedule.id);
    } catch (error) {
      alert('Failed to create schedule');
    }
  };

  const handleAddSlot = async () => {
    if (!selectedScheduleId) return;

    try {
      await createSlot({
        schedule_id: selectedScheduleId,
        ...newSlot,
      });
      setAddingSlot(false);
      setNewSlot({ day_of_week: 1, start_time: '09:00', end_time: '17:00' });
    } catch (error) {
      alert('Failed to add time slot');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultSchedule(id);
    } catch (error) {
      alert('Failed to set default schedule');
    }
  };

  const groupedSlots = slots.reduce((acc, slot) => {
    if (!acc[slot.day_of_week]) {
      acc[slot.day_of_week] = [];
    }
    acc[slot.day_of_week].push(slot);
    return acc;
  }, {} as Record<number, typeof slots>);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading availability...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Availability</h2>
          <p className="text-gray-600 mt-1">Manage your available hours</p>
        </div>
        <button
          onClick={handleCreateSchedule}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>New Schedule</span>
        </button>
      </div>

      {schedules.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No schedules yet</h3>
          <p className="text-gray-600 mb-6">Create a schedule to set your available hours</p>
          <button
            onClick={handleCreateSchedule}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Create Schedule</span>
          </button>
        </div>
      ) : (
        <div>
          <div className="flex space-x-2 mb-6">
            {schedules.map((schedule) => (
              <button
                key={schedule.id}
                onClick={() => setSelectedScheduleId(schedule.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedScheduleId === schedule.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {schedule.name}
                {schedule.is_default && ' (Default)'}
              </button>
            ))}
          </div>

          {selectedScheduleId && (
            <div className="space-y-4">
              {!schedules.find(s => s.id === selectedScheduleId)?.is_default && (
                <button
                  onClick={() => handleSetDefault(selectedScheduleId)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Set as default schedule
                </button>
              )}

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Weekly Hours</h3>

                <div className="space-y-3">
                  {DAYS_OF_WEEK.map((day, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-24 font-medium text-gray-700">{day}</div>
                      <div className="flex-1">
                        {groupedSlots[index] && groupedSlots[index].length > 0 ? (
                          <div className="space-y-2">
                            {groupedSlots[index].map((slot) => (
                              <div
                                key={slot.id}
                                className="flex items-center justify-between bg-white rounded-lg px-4 py-2 border border-gray-200"
                              >
                                <span className="text-sm text-gray-900">
                                  {slot.start_time} - {slot.end_time}
                                </span>
                                <button
                                  onClick={() => deleteSlot(slot.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Unavailable</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  {!addingSlot ? (
                    <button
                      onClick={() => setAddingSlot(true)}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Add time slot</span>
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Day
                          </label>
                          <select
                            value={newSlot.day_of_week}
                            onChange={(e) =>
                              setNewSlot({ ...newSlot, day_of_week: Number(e.target.value) })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          >
                            {DAYS_OF_WEEK.map((day, index) => (
                              <option key={index} value={index}>
                                {day}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Time
                          </label>
                          <input
                            type="time"
                            value={newSlot.start_time}
                            onChange={(e) =>
                              setNewSlot({ ...newSlot, start_time: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Time
                          </label>
                          <input
                            type="time"
                            value={newSlot.end_time}
                            onChange={(e) =>
                              setNewSlot({ ...newSlot, end_time: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleAddSlot}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => setAddingSlot(false)}
                          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
