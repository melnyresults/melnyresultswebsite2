import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Eye, Edit, ArrowLeft, Share2, Calendar, User, ExternalLink } from 'lucide-react';
import { getBlogPosts } from '../lib/localStorage';
import { BlogPost } from '../lib/localStorage';
import { usePageMeta } from '../hooks/usePageMeta';

const BlogPublishConfirmation: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  
  usePageMeta({
    title: 'Blog Post Published - Melny Results Admin',
    description: 'Your blog post has been successfully published and is now live on your website.',
    keywords: 'blog published, post confirmation, content management',
    ogTitle: 'Blog Post Published Successfully',
    ogDescription: 'Your blog post is now live and ready for readers.',
  });

  useEffect(() => {
    if (id) {
      const posts = getBlogPosts();
      const foundPost = posts.find(p => p.id === id);
      if (foundPost) {
        setPost(foundPost);
      } else {
        // If post not found, redirect to dashboard
        navigate('/admin/dashboard');
      }
    } else {
      navigate('/admin/dashboard');
    }
    setLoading(false);
  }, [id, navigate]);

  const createSlug = (title: string, id: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return `${slug}-${id.slice(0, 8)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const plainText = content.replace(/<[^>]*>/g, '');
    const wordCount = plainText.split(' ').length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  const handleShare = () => {
    if (post) {
      const postUrl = `${import.meta.env.VITE_APP_URL || window.location.origin}/blog/${createSlug(post.title, post.id)}`;
      if (navigator.share) {
        navigator.share({
          title: post.title,
          text: post.excerpt,
          url: postUrl,
        });
      } else {
        navigator.clipboard.writeText(postUrl);
        alert('Post URL copied to clipboard!');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <Link 
            to="/admin/dashboard"
            className="inline-flex items-center px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
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
              <Link 
                to="/admin/dashboard"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>Admin</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          {/* Success Animation */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle className="w-14 h-14 text-white" strokeWidth={3} />
            </div>
          </div>

          {/* Congratulations Message */}
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            🎉 Congratulations!
          </h1>
          
          <h2 className="text-2xl font-semibold text-gray-700 mb-8">
            Your blog post has been published successfully!
          </h2>

          {/* Post Preview Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8 max-w-2xl mx-auto">
            {/* Post Image */}
            {post.image_url && (
              <div className="mb-6">
                <img 
                  src={post.image_url}
                  alt={`Featured image for: ${post.title}`}
                  className="w-full h-48 object-cover rounded-lg"
                  loading="lazy"
                />
              </div>
            )}

            {/* Post Details */}
            <div className="text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 line-clamp-2">
                {post.title}
              </h3>
              
              <p className="text-gray-600 mb-6 line-clamp-3">
                {post.excerpt}
              </p>

              {/* Meta Information */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-6 flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(post.published_at)}</span>
                  </div>
                </div>
                <div className="text-primary-blue font-medium">
                  {getReadTime(post.content)}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to={`/blog/${createSlug(post.title, post.id)}`}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  View Live Post
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Link>
                
                <Link
                  to={`/admin/posts/edit/${post.id}`}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  <Edit className="w-5 h-5 mr-2" />
                  Edit Post
                </Link>
              </div>
            </div>
          </div>

          {/* Additional Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleShare}
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share Post
            </button>
            
            <Link
              to="/admin/posts/new"
              className="inline-flex items-center px-6 py-3 bg-primary-red text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              Write Another Post
            </Link>
          </div>

          {/* Success Message */}
          <div className="mt-12 p-6 bg-green-50 border border-green-200 rounded-lg max-w-2xl mx-auto">
            <h4 className="text-lg font-semibold text-green-800 mb-2">
              🚀 Your post is now live!
            </h4>
            <p className="text-green-700">
              Your blog post is now published and visible to all visitors on your website. 
              You can share the link with your audience or continue creating more content.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlogPublishConfirmation;