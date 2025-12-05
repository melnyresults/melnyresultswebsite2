import { AvailabilitySlot, DateOverride } from '../hooks/useAvailability';
import { Booking } from '../hooks/useBookings';
import { EventType } from '../hooks/useEventTypes';
import { getDayOfWeek, isTimeInRange, parseTimeString, getTimeString } from './timeUtils';

export interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
}

export function generateTimeSlots(
  date: Date,
  duration: number,
  availabilitySlots: AvailabilitySlot[],
  existingBookings: Booking[],
  eventType: EventType,
  dateOverrides: DateOverride[]
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const dayOfWeek = getDayOfWeek(date);
  const dateStr = date.toISOString().split('T')[0];

  const override = dateOverrides.find(o => o.date === dateStr);
  if (override && !override.is_available) {
    return [];
  }

  let daySlots = availabilitySlots.filter(s => s.day_of_week === dayOfWeek);

  if (override && override.start_time && override.end_time) {
    daySlots = [{
      id: 'override',
      schedule_id: 'override',
      day_of_week: dayOfWeek,
      start_time: override.start_time,
      end_time: override.end_time,
      created_at: new Date().toISOString(),
    }];
  }

  if (daySlots.length === 0) {
    return [];
  }

  const now = new Date();
  const minNoticeDate = new Date(now.getTime() + eventType.min_notice * 60000);

  daySlots.forEach(slot => {
    const { hours: startHours, minutes: startMinutes } = parseTimeString(slot.start_time);
    const { hours: endHours, minutes: endMinutes } = parseTimeString(slot.end_time);

    let currentSlotTime = new Date(date);
    currentSlotTime.setHours(startHours, startMinutes, 0, 0);

    const slotEndTime = new Date(date);
    slotEndTime.setHours(endHours, endMinutes, 0, 0);

    while (currentSlotTime.getTime() + duration * 60000 <= slotEndTime.getTime()) {
      const slotStart = new Date(currentSlotTime);
      const slotEnd = new Date(currentSlotTime.getTime() + duration * 60000);

      if (slotStart < minNoticeDate) {
        currentSlotTime = new Date(currentSlotTime.getTime() + 15 * 60000);
        continue;
      }

      const hasConflict = existingBookings.some(booking => {
        if (booking.status === 'cancelled') return false;

        const bookingStart = new Date(booking.start_time);
        const bookingEnd = new Date(booking.end_time);

        const bufferStart = new Date(bookingStart.getTime() - eventType.buffer_before * 60000);
        const bufferEnd = new Date(bookingEnd.getTime() + eventType.buffer_after * 60000);

        return (
          (slotStart >= bufferStart && slotStart < bufferEnd) ||
          (slotEnd > bufferStart && slotEnd <= bufferEnd) ||
          (slotStart <= bufferStart && slotEnd >= bufferEnd)
        );
      });

      slots.push({
        start: slotStart,
        end: slotEnd,
        available: !hasConflict,
      });

      currentSlotTime = new Date(currentSlotTime.getTime() + 15 * 60000);
    }
  });

  return slots;
}

export function getAvailableDates(
  startDate: Date,
  endDate: Date,
  availabilitySlots: AvailabilitySlot[],
  dateOverrides: DateOverride[]
): Date[] {
  const availableDates: Date[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const override = dateOverrides.find(o => o.date === dateStr);

    if (override) {
      if (override.is_available) {
        availableDates.push(new Date(currentDate));
      }
    } else {
      const dayOfWeek = getDayOfWeek(currentDate);
      const hasSlots = availabilitySlots.some(s => s.day_of_week === dayOfWeek);

      if (hasSlots) {
        availableDates.push(new Date(currentDate));
      }
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return availableDates;
}

export function checkBookingConflict(
  startTime: Date,
  endTime: Date,
  existingBookings: Booking[],
  bufferBefore: number = 0,
  bufferAfter: number = 0
): boolean {
  const checkStart = new Date(startTime.getTime() - bufferBefore * 60000);
  const checkEnd = new Date(endTime.getTime() + bufferAfter * 60000);

  return existingBookings.some(booking => {
    if (booking.status === 'cancelled') return false;

    const bookingStart = new Date(booking.start_time);
    const bookingEnd = new Date(booking.end_time);

    return (
      (checkStart >= bookingStart && checkStart < bookingEnd) ||
      (checkEnd > bookingStart && checkEnd <= bookingEnd) ||
      (checkStart <= bookingStart && checkEnd >= bookingEnd)
    );
  });
}

export function getBookingsForDate(bookings: Booking[], date: Date): Booking[] {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return bookings.filter(booking => {
    const bookingDate = new Date(booking.start_time);
    return bookingDate >= startOfDay && bookingDate <= endOfDay;
  });
}

export function getBookingCountForDay(bookings: Booking[], date: Date): number {
  return getBookingsForDate(bookings, date).filter(b => b.status !== 'cancelled').length;
}
