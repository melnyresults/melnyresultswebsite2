import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, User, Calendar, Heart } from 'lucide-react';
import { likeBlogPost, getLikedPosts } from '../lib/localStorage';

interface Comment {
  id: number;
  author_name: string;
  content: string;
  created_at: string;
}

interface BlogCommentsProps {
  postSlug: string;
  initialLikes?: number;
}

const BlogComments: React.FC<BlogCommentsProps> = ({ postSlug, initialLikes = 0 }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [liking, setLiking] = useState(false);
  const [formData, setFormData] = useState({
    author_name: '',
    author_email: '',
    content: ''
  });

  useEffect(() => {
    checkIfLiked();
    setLoading(false);
  }, [postSlug]);

  const checkIfLiked = () => {
    const likedPosts = getLikedPosts();
    setHasLiked(likedPosts.includes(postSlug));
  };

  const handleLike = async () => {
    if (hasLiked || liking) return;

    setLiking(true);
    try {
      likeBlogPost(postSlug);
      setLikes(prev => prev + 1);
      setHasLiked(true);
    } catch (error) {
      console.error('Error liking post:', error);
    } finally {
      setLiking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Comments are currently disabled - focusing on frontend visuals
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
          
          <div className="mb-4 p-4 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
            Comments are currently disabled while we focus on improving the site experience.
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 opacity-50 pointer-events-none">
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
                  disabled
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
                  disabled
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
                disabled
              />
            </div>

            <button
              type="submit"
              disabled
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              Submit Comment
            </button>
          </form>
        </div>

        {/* Comments List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue mx-auto mb-4"></div>
              <p className="text-gray-600">Loading comments...</p>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-2xl">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Comments are temporarily disabled while we improve the site.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogComments;