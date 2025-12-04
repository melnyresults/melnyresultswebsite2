import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, TrendingUp, Edit3, LogOut, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { usePageMeta } from '../hooks/usePageMeta';
import DashboardMetrics from './DashboardMetrics';
import OpportunitiesView from './OpportunitiesView';
import MarketingView from './MarketingView';
import AdminDashboard from './AdminDashboard';
import NotificationBell from './NotificationBell';

type SidebarSection = 'dashboard' | 'opportunities' | 'marketing' | 'blog';

const CRMDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<SidebarSection>('dashboard');

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
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo & Notifications */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
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
        <nav className="flex-1 px-4 py-6 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
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
      </main>
    </div>
  );
};

export default CRMDashboard;
