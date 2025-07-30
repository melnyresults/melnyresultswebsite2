import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, User, Calendar, Heart } from 'lucide-react';

interface Comment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
}

interface BlogCommentsProps {
  postSlug: string;
  initialLikes?: number;
}

const BlogComments: React.FC<BlogCommentsProps> = ({ postSlug, initialLikes = 0 }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [liking, setLiking] = useState(false);
  const [formData, setFormData] = useState({
    author_name: '',
    author_email: '',
    content: ''
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // API configuration
  const API_BASE_URL = 'http://localhost:3001';

  useEffect(() => {
    fetchComments();
    fetchLikes();
    checkIfLiked();
  }, [postSlug]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/comments/${postSlug}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setComments(data.comments);
      } else {
        console.error('Failed to fetch comments:', data.error);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      // For now, just set empty comments if API fails
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLikes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/likes/${postSlug}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setLikes(data.likes);
      } else {
        console.error('Failed to fetch likes:', data.error);
      }
    } catch (error) {
      console.error('Error fetching likes:', error);
      // Keep the initial likes count if API fails
    }
  };

  const checkIfLiked = () => {
    // Check localStorage to see if user has liked this post
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
    setHasLiked(likedPosts.includes(postSlug));
  };

  const handleLike = async () => {
    if (hasLiked || liking) return;

    setLiking(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/likes/${postSlug}/like`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setLikes(data.likes);
        setHasLiked(true);
        
        // Store in localStorage
        const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
        likedPosts.push(postSlug);
        localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to like post' });
      }
    } catch (error) {
      console.error('Error liking post:', error);
      // Fallback to local like functionality if API fails
      setLikes(prev => prev + 1);
      setHasLiked(true);
      
      // Store in localStorage
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
      likedPosts.push(postSlug);
      localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
      
      setMessage({ type: 'success', text: 'Post liked! (Note: Backend API not available)' });
    } finally {
      setLiking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/comments/${postSlug}`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: 'Comment submitted successfully! It will appear after approval.' 
        });
        setFormData({ author_name: '', author_email: '', content: '' });
      } else {
        setMessage({ 
          type: 'error', 
          text: data.errors?.[0]?.msg || 'Failed to submit comment' 
        });
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      // Check if it's a network error (backend not running)
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        setMessage({ 
          type: 'error', 
          text: 'Unable to connect to server. Please try again later or contact support if the problem persists.' 
        });
      } else {
        setMessage({ 
          type: 'error', 
          text: 'Failed to submit comment. Please try again.' 
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  return (
    <div className="mt-12 border-t border-gray-200 pt-12">
      {/* Like Button */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={handleLike}
          disabled={hasLiked || liking}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            hasLiked
              ? 'bg-red-100 text-red-600 cursor-not-allowed'
              : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:scale-105'
          }`}
        >
          <Heart className={`w-5 h-5 ${hasLiked ? 'fill-current' : ''}`} />
          <span>{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
          {liking && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>}
        </button>
      </div>

      {/* Comments Section */}
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-6 h-6 text-primary-blue" />
          <h3 className="text-2xl font-semibold text-gray-900">
            Comments ({comments.length})
          </h3>
        </div>

        {/* Comment Form */}
        <div className="bg-gray-50 p-6 rounded-2xl">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Leave a Comment</h4>
          
          {message && (
            <div className={`mb-4 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="author_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="author_name"
                  name="author_name"
                  required
                  value={formData.author_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                  placeholder="Your name"
                  disabled={submitting}
                />
              </div>
              <div>
                <label htmlFor="author_email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="author_email"
                  name="author_email"
                  required
                  value={formData.author_email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                  placeholder="your@email.com"
                  disabled={submitting}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Comment *
              </label>
              <textarea
                id="content"
                name="content"
                required
                rows={4}
                value={formData.content}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent resize-none"
                placeholder="Share your thoughts..."
                disabled={submitting}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Submitting...' : 'Submit Comment'}
            </button>
          </form>

          <p className="mt-4 text-sm text-gray-500">
            Your email will not be published. Comments are moderated and will appear after approval.
          </p>
        </div>

        {/* Comments List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue mx-auto mb-4"></div>
              <p className="text-gray-600">Loading comments...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-2xl">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No comments yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="bg-white p-6 rounded-2xl border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-blue rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h5 className="font-medium text-gray-900">{comment.author}</h5>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(comment.createdAt)}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogComments;