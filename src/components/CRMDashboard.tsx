import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, TrendingUp, Edit3, Calendar, LogOut, User, Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { usePageMeta } from '../hooks/usePageMeta';
import { useRealtimeNotifications } from '../hooks/useRealtimeNotifications';
import DashboardMetrics from './DashboardMetrics';
import OpportunitiesView from './OpportunitiesView';
import MarketingView from './MarketingView';
import AdminDashboard from './AdminDashboard';
import NotificationBell from './NotificationBell';
import { EventTypesManager } from './EventTypesManager';
import { AvailabilityManager } from './AvailabilityManager';
import { BookingsManager } from './BookingsManager';
import { BookingAnalytics } from './BookingAnalytics';
import { ProfileSettings } from './ProfileSettings';

type SidebarSection = 'dashboard' | 'opportunities' | 'marketing' | 'blog' | 'bookings';

const CRMDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<SidebarSection>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useRealtimeNotifications();

  usePageMeta({
    title: 'CRM Dashboard - Melny Results',
    description: 'Manage your sales pipeline, opportunities, and marketing campaigns.',
    keywords: 'crm, sales pipeline, opportunities, marketing dashboard',
    ogTitle: 'CRM Dashboard',
    ogDescription: 'Comprehensive CRM and marketing management platform.',
  });

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const sidebarItems = [
    { id: 'dashboard' as SidebarSection, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'opportunities' as SidebarSection, label: 'Opportunities', icon: Briefcase },
    { id: 'marketing' as SidebarSection, label: 'Marketing', icon: TrendingUp },
    { id: 'blog' as SidebarSection, label: 'Blog Builder', icon: Edit3 },
    { id: 'bookings' as SidebarSection, label: 'Bookings', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isMobileSidebarOpen ? (
            <X className="w-6 h-6 text-gray-700" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700" />
          )}
        </button>
        <Link to="/">
          <img
            src="/melny-results-logo.png"
            alt="Melny Results Logo"
            className="h-8 w-auto"
          />
        </Link>
        <NotificationBell />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-200 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo & Notifications - Desktop Only */}
        <div className="hidden md:flex h-16 items-center justify-between px-6 border-b border-gray-200">
          <Link to="/">
            <img
              src="/melny-results-logo.png"
              alt="Melny Results Logo"
              className="h-8 w-auto"
            />
          </Link>
          <NotificationBell />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-primary-blue'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3 px-2 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary-blue flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {activeSection === 'dashboard' && <DashboardMetrics />}
        {activeSection === 'opportunities' && <OpportunitiesView />}
        {activeSection === 'marketing' && <MarketingView />}
        {activeSection === 'blog' && <AdminDashboard />}
        {activeSection === 'bookings' && <BookingsSection />}
      </main>
    </div>
  );
};

const BookingsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'event-types' | 'availability' | 'bookings' | 'analytics' | 'settings'>('event-types');

  const tabs = [
    { id: 'event-types' as const, label: 'Event Types' },
    { id: 'availability' as const, label: 'Availability' },
    { id: 'bookings' as const, label: 'Bookings' },
    { id: 'analytics' as const, label: 'Analytics' },
    { id: 'settings' as const, label: 'Settings' },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking System</h1>
        <p className="text-gray-600">Manage your meeting types, availability, and bookings</p>
      </div>

      <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        {activeTab === 'event-types' && <EventTypesManager />}
        {activeTab === 'availability' && <AvailabilityManager />}
        {activeTab === 'bookings' && <BookingsManager />}
        {activeTab === 'analytics' && <BookingAnalytics />}
        {activeTab === 'settings' && <ProfileSettings />}
      </div>
    </div>
  );
};

export default CRMDashboard;
