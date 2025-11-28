import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, CreditCard as Edit, Trash2, LogOut, Eye, Calendar, User, MessageCircle, Heart, Settings, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useBlogPosts } from '../hooks/useBlogPosts';
import { supabase } from '../lib/supabase';
import { usePageMeta } from '../hooks/usePageMeta';
import AdminComments from './AdminComments';
import AdminSettings from './AdminSettings';

const AdminDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const { posts, loading, deletePost, updatePost } = useBlogPosts();
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'posts' | 'comments' | 'settings'>('posts');
  const [stats, setStats] = useState({
    totalPosts: 0,
    thisMonthPosts: 0,
    totalSubmissions: 0,
    totalSignups: 0
  });
  
  // Security check - ensure user is authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin/login');
    }
  }, [user, loading, navigate]);
  
  // Fetch admin statistics
  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      
      try {
        // Calculate total posts from the posts array
        const totalPosts = posts.length;
        
        // Calculate posts published this month
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const thisMonthPosts = posts.filter(post => {
          const postDate = new Date(post.published_at);
          return postDate.getMonth() === currentMonth && postDate.getFullYear() === currentYear;
        }).length;
        
        setStats({
          totalPosts,
          thisMonthPosts,
          totalSubmissions: 0, // Mock data for now
          totalSignups: 0 // Mock data for now
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    
    fetchStats();
  }, [user, posts]);
  
  usePageMeta({
    title: 'Blog Dashboard - Melny Results Admin',
    description: 'Manage your blog posts, view analytics, and create new content for Melny Results.',
    keywords: 'blog dashboard, admin panel, content management, blog analytics',
    ogTitle: 'Blog Dashboard - Admin Panel',
    ogDescription: 'Manage your blog content and view performance metrics.',
  });

  const handleSignOut = async () => {
    // Clear any sensitive data before signing out
    localStorage.removeItem('blog_draft');
    localStorage.removeItem('liked_posts');
    
    // Sign out
    await signOut();
    navigate('/');
  };

  const handleDeletePost = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      setDeletingId(id);
      const { error } = await deletePost(id);
      if (error) {
        console.error('Delete error:', error);
        alert('Failed to delete post. Please try again.');
      }
      setDeletingId(null);
    }
  };

  const handleTogglePublish = async (post: any) => {
    const newStatus = !post.is_published;
    const action = newStatus ? 'publish' : 'unpublish';

    if (window.confirm(`Are you sure you want to ${action} this post?`)) {
      setPublishingId(post.id);
      const { error } = await updatePost(post.id, {
        ...post,
        is_published: newStatus,
        published_at: newStatus && !post.published_at ? new Date().toISOString() : post.published_at
      });

      if (error) {
        console.error('Publish toggle error:', error);
        alert(`Failed to ${action} post. Please try again.`);
      }
      setPublishingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-[0_4px_20px_rgb(0,0,0,0.08)] border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <img 
                  src="/melny-results-logo.png" 
                  alt="Melny Results Logo" 
                  className="h-8 w-auto"
                />
              </Link>
              <div className="hidden md:block">
                <h1 className="text-xl font-semibold text-gray-900">Blog Dashboard</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>
              <Link
                to="/blog"
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Blog
              </Link>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Posts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Published This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.thisMonthPosts}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalSubmissions}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <User className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Newsletter Signups</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalSignups}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mb-8">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'posts'
                  ? 'bg-white text-primary-blue shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Edit className="w-4 h-4" />
              Blog Posts
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'comments'
                  ? 'bg-white text-primary-blue shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              Comments
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'settings'
                  ? 'bg-white text-primary-blue shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'posts' ? (
          <div>
            {/* Posts Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Blog Posts</h2>
              <Link
                to="/admin/posts/new"
                className="inline-flex items-center px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Post
              </Link>
            </div>

            {/* Posts List */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              {posts.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts yet</h3>
                  <p className="text-gray-600 mb-6">Get started by creating your first blog post.</p>
                  <Link
                    to="/admin/posts/new"
                    className="inline-flex items-center px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create First Post
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Author
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {posts.map((post) => (
                        <tr key={post.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{post.title}</div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">{post.excerpt}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              post.is_published
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {post.is_published ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {post.author}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(post.published_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleTogglePublish(post)}
                                disabled={publishingId === post.id}
                                className={`p-1 rounded transition-colors disabled:opacity-50 ${
                                  post.is_published
                                    ? 'text-gray-600 hover:text-gray-700 hover:bg-gray-50'
                                    : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                                }`}
                                title={post.is_published ? 'Unpublish' : 'Publish'}
                              >
                                {post.is_published ? (
                                  <XCircle className="w-4 h-4" />
                                ) : (
                                  <CheckCircle className="w-4 h-4" />
                                )}
                              </button>
                              <Link
                                to={`/admin/posts/edit/${post.id}`}
                                className="text-primary-blue hover:text-blue-700 p-1 rounded hover:bg-blue-50 transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => handleDeletePost(post.id)}
                                disabled={deletingId === post.id}
                                className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'comments' ? (
          <AdminComments />
        ) : (
          <AdminSettings />
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;