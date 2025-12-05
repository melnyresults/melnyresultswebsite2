import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, User, Calendar, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { generateFingerprint } from '../lib/fingerprint';

interface Comment {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
}

interface BlogCommentsProps {
  postId: string;
  postSlug: string;
}

const BlogComments: React.FC<BlogCommentsProps> = ({ postId, postSlug }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [liking, setLiking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    content: ''
  });

  useEffect(() => {
    if (postId) {
      loadComments();
      loadLikes();
      checkIfLiked();
    }
  }, [postId]);

  const loadComments = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_comments')
        .select('*')
        .eq('post_id', postId)
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (err) {
      console.error('Error loading comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadLikes = async () => {
    try {
      const { count, error } = await supabase
        .from('blog_likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId);

      if (error) throw error;
      setLikes(count || 0);
    } catch (err) {
      console.error('Error loading likes:', err);
    }
  };

  const checkIfLiked = async () => {
    const fingerprint = generateFingerprint();
    try {
      const { data, error } = await supabase
        .from('blog_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_fingerprint', fingerprint)
        .maybeSingle();

      if (error) throw error;
      setHasLiked(!!data);
    } catch (err) {
      console.error('Error checking like status:', err);
    }
  };

  const handleLike = async () => {
    if (hasLiked || liking) return;

    setLiking(true);
    const fingerprint = generateFingerprint();

    try {
      const { error } = await supabase
        .from('blog_likes')
        .insert([{ post_id: postId, user_fingerprint: fingerprint }]);

      if (error) throw error;

      setLikes(prev => prev + 1);
      setHasLiked(true);
    } catch (err) {
      console.error('Error liking post:', err);
    } finally {
      setLiking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    const sanitizedName = formData.user_name.trim();
    const sanitizedEmail = formData.user_email.trim().toLowerCase();
    const sanitizedComment = formData.content.trim();

    if (!sanitizedName || !sanitizedEmail || !sanitizedComment) {
      setError('Please fill in all fields');
      setSubmitting(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      setError('Please enter a valid email address');
      setSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('blog_comments')
        .insert([{
          post_id: postId,
          author_name: sanitizedName,
          author_email: sanitizedEmail,
          content: sanitizedComment,
          approved: false
        }]);

      if (error) throw error;

      setSuccess(true);
      setFormData({ user_name: '', user_email: '', content: '' });

      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error('Error submitting comment:', err);
      setError('Failed to submit comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="mt-12 border-t border-gray-200 pt-12">
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

      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-6 h-6 text-primary-blue" />
          <h3 className="text-2xl font-semibold text-gray-900">
            Comments ({comments.length})
          </h3>
        </div>

        <div className="bg-gray-50 p-6 rounded-2xl">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Leave a Comment</h4>

          {success && (
            <div className="mb-4 p-4 rounded-lg bg-green-50 text-green-700 border border-green-200">
              Thank you! Your comment has been submitted and is pending approval.
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="user_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="user_name"
                  name="user_name"
                  required
                  value={formData.user_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="user_email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="user_email"
                  name="user_email"
                  required
                  value={formData.user_email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                  placeholder="your@email.com"
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
        </div>

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
              <div key={comment.id} className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-blue rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{comment.author_name}</h4>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(comment.created_at)}</span>
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
