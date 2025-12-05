# Booking System Documentation

## Overview

A comprehensive Calendly-like booking system built with React, TypeScript, and Supabase. This system allows users to create event types, manage availability schedules, accept bookings, and track analytics.

## Features

### Core Features

1. **User Profiles**
   - Customizable profile with username, bio, company info
   - Public booking page URL (e.g., `/book/username/event-slug`)
   - Timezone support
   - Welcome messages for booking pages

2. **Event Types Management**
   - Create multiple event types (meetings, consultations, etc.)
   - Customizable duration (15-120 minutes)
   - Buffer time before/after meetings
   - Multiple location types (Google Meet, Zoom, Phone, In-Person, Custom)
   - Color coding for visual organization
   - Minimum notice period (prevent last-minute bookings)
   - Maximum future booking window
   - Optional manual confirmation requirement
   - URL slug-based booking links

3. **Availability Scheduling**
   - Multiple availability schedules
   - Weekly recurring hours
   - Day-specific time slots
   - Date-specific overrides (special availability or blocking dates)
   - Default schedule setting
   - Timezone-aware scheduling

4. **Booking Management**
   - Real-time availability checking
   - Guest information collection (name, email, phone, notes)
   - Booking status tracking (pending, confirmed, cancelled, completed)
   - Cancellation with reason tracking
   - Manual confirmation workflow
   - Booking details with guest information

5. **Public Booking Interface**
   - Clean, Calendly-inspired UI
   - Calendar date picker
   - Available time slots display
   - Guest information form
   - Timezone selection
   - Booking confirmation
   - Mobile-responsive design

6. **Analytics Dashboard**
   - Total bookings count
   - Status breakdown (confirmed, pending, cancelled)
   - Upcoming meetings counter
   - Visual progress indicators
   - Performance metrics

## Database Schema

### Tables

- **user_profiles**: Extended user information
- **event_types**: Meeting type configurations
- **availability_schedules**: Named schedule templates
- **availability_slots**: Weekly recurring time slots
- **event_type_availability**: Links event types to schedules
- **bookings**: All scheduled meetings
- **booking_form_fields**: Custom form fields (extensible)
- **booking_form_responses**: Collected responses
- **google_calendar_connections**: OAuth tokens (ready for integration)
- **date_overrides**: Date-specific availability exceptions
- **booking_analytics**: Metrics tracking

## Pages and Routes

### Admin Routes (Protected)

The booking system is integrated into the main CRM dashboard at `/admin/dashboard`.

**Access:** Click "Bookings" in the left sidebar (appears after Dashboard, Opportunities, Marketing, and Blog Builder).

The Bookings section contains 5 tabs:
  - **Event Types**: Create and manage meeting types
  - **Availability**: Set weekly hours and date overrides
  - **Bookings**: View and manage scheduled meetings
  - **Analytics**: View booking performance metrics
  - **Settings**: Update profile information

### Public Routes

- `/book/:username/:slug` - Public booking page where guests can:
  - View host profile and event details
  - Select available date from calendar
  - Choose from available time slots
  - Enter their information
  - Complete booking

## User Workflow

### Setting Up Your Booking System

1. **Access the Booking System**
   - Log in to your admin dashboard at `/admin/dashboard`
   - Click "Bookings" in the left sidebar (fifth menu item with calendar icon)

2. **Create Profile** (One-time setup)
   - Go to the Settings tab in Bookings section
   - Complete your profile
   - Choose a unique username
   - Set your timezone
   - Add bio and welcome message

3. **Create Availability Schedule**
   - Go to Availability tab
   - Create a schedule (e.g., "Working Hours")
   - Add time slots for each day
   - Set as default schedule

4. **Create Event Types**
   - Go to Event Types tab
   - Click "New Event Type"
   - Configure:
     - Name (e.g., "30 Minute Consultation")
     - Duration
     - Location type
     - Buffer times
     - Booking rules
   - Activate the event type

5. **Share Your Booking Link**
   - Copy the booking link from event type card
   - Share with clients: `/book/your-username/event-slug`

### Guest Booking Flow

1. Guest visits booking link
2. Sees host profile and event details
3. Selects available date from calendar
4. Chooses time slot (filtered by availability)
5. Enters contact information
6. Submits booking
7. Receives confirmation (instant or pending)

### Managing Bookings

1. View all bookings in Bookings tab
2. Filter by status (all, confirmed, pending, cancelled)
3. Confirm pending bookings
4. Cancel bookings with reason
5. View guest details and notes

## Technical Implementation

### Key Hooks

- `useUserProfile()` - Profile management
- `useEventTypes()` - Event type CRUD operations
- `useAvailability()` - Schedule and slot management
- `useBookings()` - Booking operations and queries

### Utility Functions

- **Time Utils**: Timezone conversions, formatting, date arithmetic
- **Availability Utils**: Slot generation, conflict detection, date filtering

### Security

- Row Level Security (RLS) enabled on all tables
- Authenticated users can only manage their own data
- Public read access only for booking pages
- Token-based booking confirmation

## Future Enhancements

### Phase 1 (Ready for implementation)
- **Google Calendar Integration**
  - OAuth 2.0 flow
  - Two-way sync
  - Automatic event creation
  - Conflict checking with external calendars

### Phase 2
- **Email Notifications**
  - Booking confirmations
  - Reminders (24h before, 1h before)
  - Cancellation notices
  - Rescheduling notifications

### Phase 3
- **Advanced Features**
  - Custom booking form fields
  - Team scheduling (round-robin, collective)
  - Payment integration (deposits, full payment)
  - Video conferencing integration
  - SMS notifications
  - Booking limits per day/week
  - Recurring bookings
  - Buffer time between bookings
  - Custom branding

### Phase 4
- **Enterprise Features**
  - Multi-user workspaces
  - Admin roles and permissions
  - Advanced analytics and reporting
  - API access
  - Webhooks
  - Custom integrations

## API Structure

The booking system uses Supabase client for all database operations. Key patterns:

```typescript
// Creating a booking
const { data, error } = await supabase
  .from('bookings')
  .insert({...bookingData})
  .select()
  .single();

// Fetching availability
const { data } = await supabase
  .from('availability_slots')
  .select('*')
  .eq('schedule_id', scheduleId);

// Updating event type
const { data, error } = await supabase
  .from('event_types')
  .update({...updates})
  .eq('id', eventTypeId)
  .select()
  .single();
```

## Configuration

### Required Environment Variables

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Timezone Support

The system includes 18 major timezones by default. Add more in `src/lib/timeUtils.ts`:

```typescript
export const TIMEZONE_LIST = [
  'America/New_York',
  // Add more...
];
```

## Troubleshooting

### Booking Link Not Working
- Verify event type is marked as "active"
- Check username is set in profile
- Ensure availability schedule is configured
- Confirm event type has slots assigned

### No Available Time Slots
- Check availability schedule has slots for the selected day
- Verify minimum notice period isn't blocking all slots
- Check for date overrides that might block the date
- Ensure no conflicting bookings exist

### Profile Not Found
- Complete profile setup in Settings tab
- Ensure username is unique
- Verify profile is marked as active

## Best Practices

1. **Set Realistic Buffer Times**: Allow time between meetings for breaks and preparation
2. **Use Minimum Notice**: Prevent last-minute bookings (e.g., 2-4 hours)
3. **Create Multiple Event Types**: Different durations for different meeting types
4. **Use Descriptive Names**: Help guests understand what they're booking
5. **Test Your Booking Flow**: Book yourself to verify the experience
6. **Set Timezone Correctly**: Ensure your timezone matches your location
7. **Use Date Overrides**: Block holidays and time off
8. **Monitor Analytics**: Track booking patterns and adjust availability

## Support

For issues or questions:
1. Check this documentation
2. Review database schema in migration files
3. Examine component source code
4. Check browser console for errors

## License

This booking system is part of the larger application and follows the same license terms.
