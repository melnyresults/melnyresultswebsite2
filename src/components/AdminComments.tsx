import React, { useState, useEffect } from 'react';
import { MessageCircle, Check, Trash2, Eye, Calendar, User, Filter } from 'lucide-react';

interface Comment {
  id: number;
  post_slug: string;
  author_name: string;
  author_email: string;
  content: string;
  ip_address: string;
  status: 'pending' | 'approved';
  created_at: string;
}

interface AdminCommentsProps {
  token: string;
}

const AdminComments: React.FC<AdminCommentsProps> = ({ token }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set());

  const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://api.melnyresults.com' 
    : 'http://localhost:3001';

  useEffect(() => {
    fetchComments();
  }, [filter]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/comments?status=${filter}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setComments(data.comments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveComment = async (id: number) => {
    setProcessingIds(prev => new Set(prev).add(id));
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/comments/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setComments(prev => 
          prev.map(comment => 
            comment.id === id 
              ? { ...comment, status: 'approved' as const }
              : comment
          )
        );
      }
    } catch (error) {
      console.error('Error approving comment:', error);
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const deleteComment = async (id: number) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    setProcessingIds(prev => new Set(prev).add(id));
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/comments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setComments(prev => prev.filter(comment => comment.id !== id));
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredComments = comments.filter(comment => {
    if (filter === 'all') return true;
    return comment.status === filter;
  });

  const pendingCount = comments.filter(c => c.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-6 h-6 text-primary-blue" />
          <h2 className="text-2xl font-semibold text-gray-900">Comments Management</h2>
          {pendingCount > 0 && (
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
              {pendingCount} pending
            </span>
          )}
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
              {status === 'pending' && pendingCount > 0 && (
                <span className="ml-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading comments...</p>
        </div>
      ) : filteredComments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            {filter === 'all' ? 'No comments yet' : `No ${filter} comments`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredComments.map((comment) => (
            <div key={comment.id} className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-blue rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{comment.author_name}</h4>
                    <p className="text-sm text-gray-500">{comment.author_email}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(comment.status)}`}>
                  {comment.status}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 leading-relaxed">{comment.content}</p>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(comment.created_at)}</span>
                  </div>
                  <span>Post: {comment.post_slug}</span>
                  <span>IP: {comment.ip_address}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {comment.status === 'pending' && (
                  <button
                    onClick={() => approveComment(comment.id)}
                    disabled={processingIds.has(comment.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    {processingIds.has(comment.id) ? 'Approving...' : 'Approve'}
                  </button>
                )}
                
                <button
                  onClick={() => deleteComment(comment.id)}
                  disabled={processingIds.has(comment.id)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  {processingIds.has(comment.id) ? 'Deleting...' : 'Delete'}
                </button>

                <a
                  href={`/blog/${comment.post_slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View Post
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminComments;