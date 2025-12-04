import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Users, FileText, Mail, MessageSquare, Target, Award } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useOpportunities } from '../hooks/useOpportunities';

const DashboardMetrics: React.FC = () => {
  const { opportunities } = useOpportunities();
  const [metrics, setMetrics] = useState({
    pipelineValue: 0,
    closedRevenue: 0,
    newLeads: 0,
    postsThisMonth: 0,
    newsletterSignups: 0,
    marketingSubmissions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, [opportunities]);

  const fetchMetrics = async () => {
    try {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const firstDayOfMonth = new Date(currentYear, currentMonth, 1).toISOString();

      // Calculate pipeline value (sum of all open opportunities)
      const pipelineValue = opportunities
        .filter(opp => opp.status === 'open')
        .reduce((sum, opp) => sum + Number(opp.value), 0);

      // Calculate closed revenue (sum of all won opportunities)
      const closedRevenue = opportunities
        .filter(opp => opp.status === 'won')
        .reduce((sum, opp) => sum + Number(opp.value), 0);

      // Count new leads this month
      const newLeads = opportunities.filter(opp => {
        const createdDate = new Date(opp.created_at);
        return createdDate >= new Date(firstDayOfMonth);
      }).length;

      // Fetch blog posts this month
      const { data: posts } = await supabase
        .from('blog_posts')
        .select('id')
        .gte('created_at', firstDayOfMonth);

      // Fetch newsletter signups (mock data for now)
      const newsletterSignups = 0;

      // Fetch marketing submissions (mock data for now)
      const marketingSubmissions = 0;

      setMetrics({
        pipelineValue,
        closedRevenue,
        newLeads,
        postsThisMonth: posts?.length || 0,
        newsletterSignups,
        marketingSubmissions,
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const metricCards = [
    {
      title: 'Pipeline Value',
      value: `$${metrics.pipelineValue.toLocaleString()}`,
      icon: DollarSign,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      title: 'Closed Revenue',
      value: `$${metrics.closedRevenue.toLocaleString()}`,
      icon: Award,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      title: 'New Leads',
      value: metrics.newLeads,
      icon: Users,
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
    },
    {
      title: 'Posts This Month',
      value: metrics.postsThisMonth,
      icon: FileText,
      color: 'orange',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600',
    },
    {
      title: 'Newsletter Signups',
      value: metrics.newsletterSignups,
      icon: Mail,
      color: 'pink',
      bgColor: 'bg-pink-100',
      textColor: 'text-pink-600',
    },
    {
      title: 'Marketing Submissions',
      value: metrics.marketingSubmissions,
      icon: MessageSquare,
      color: 'cyan',
      bgColor: 'bg-cyan-100',
      textColor: 'text-cyan-600',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of your business performance and metrics</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {metricCards.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.title} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`w-6 h-6 ${metric.textColor}`} />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{metric.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
            </div>
          );
        })}
      </div>

      {/* Additional Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Google Ads Placeholder */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-100">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Google Ads</h3>
          </div>
          <p className="text-gray-600 text-sm">Connect your Google Ads account to see performance metrics here.</p>
          <button className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
            Connect Account
          </button>
        </div>

        {/* Meta Ads Placeholder */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-100">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Meta Ads</h3>
          </div>
          <p className="text-gray-600 text-sm">Connect your Meta Ads account to see performance metrics here.</p>
          <button className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
            Connect Account
          </button>
        </div>

        {/* Google Analytics Placeholder */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-lg bg-green-100">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Google Analytics</h3>
          </div>
          <p className="text-gray-600 text-sm">Connect your Google Analytics to see website traffic and behavior metrics.</p>
          <button className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
            Connect Account
          </button>
        </div>

        {/* Blog Performance */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-100">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Blog Performance</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Posts This Month</span>
              <span className="text-sm font-semibold text-gray-900">{metrics.postsThisMonth}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Newsletter Signups</span>
              <span className="text-sm font-semibold text-gray-900">{metrics.newsletterSignups}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Marketing Submissions</span>
              <span className="text-sm font-semibold text-gray-900">{metrics.marketingSubmissions}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMetrics;
