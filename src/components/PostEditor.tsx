import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Calendar, User, Image } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useBlogPosts } from '../hooks/useBlogPosts';
import { BlogPost } from '../lib/supabase';
import RichTextEditor from './RichTextEditor';

const PostEditor: React.FC = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { posts, createPost, updatePost } = useBlogPosts();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    author: 'Ivan Melnychenko',
    image_url: '',
    published_at: new Date().toISOString().split('T')[0],
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing && id) {
      const post = posts.find(p => p.id === id);
      if (post) {
        setFormData({
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          author: post.author,
          image_url: post.image_url || '',
          published_at: post.published_at.split('T')[0],
        });
      }
    }
  }, [isEditing, id, posts]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  };

  const generateExcerpt = (content: string) => {
    // Remove HTML tags and get plain text
    const plainText = content.replace(/<[^>]*>/g, '');
    return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const postData = {
      ...formData,
      excerpt: formData.excerpt || generateExcerpt(formData.content),
      published_at: new Date(formData.published_at).toISOString(),
    };

    let result;
    if (isEditing && id) {
      result = await updatePost(id, postData);
    } else {
      result = await createPost(postData as Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'likes_count'>);
    }

    if (result.error) {
      setError(result.error);
    } else {
      navigate('/admin/dashboard');
    }

    setLoading(false);
  };

  const getRandomImage = () => {
    const images = [
      'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
      'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
      'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
      'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
      'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
    ];
    return images[Math.floor(Math.random() * images.length)];
  };

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
              <div className="hidden md:block">
                <h1 className="text-xl font-semibold text-gray-900">
                  {isEditing ? 'Edit Post' : 'New Post'}
                </h1>
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
                Preview Blog
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Post Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 text-2xl font-bold border-0 focus:ring-0 focus:outline-none resize-none"
              placeholder="Enter your post title..."
            />
          </div>

          {/* Meta Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Post Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                  Author
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="published_at" className="block text-sm font-medium text-gray-700 mb-2">
                  Publish Date
                </label>
                <input
                  type="date"
                  id="published_at"
                  name="published_at"
                  value={formData.published_at}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
                Featured Image URL
              </label>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, image_url: getRandomImage() }))}
                className="inline-flex items-center px-3 py-1 text-xs font-medium text-primary-blue bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
              >
                <Image className="w-3 h-3 mr-1" />
                Random Image
              </button>
            </div>
            <input
              type="url"
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
            {formData.image_url && (
              <div className="mt-4">
                <img
                  src={formData.image_url}
                  alt="Featured image preview"
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Excerpt */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt (Optional)
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows={3}
              value={formData.excerpt}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent resize-none"
              placeholder="Brief description of your post (will be auto-generated if left empty)"
            />
          </div>

          {/* Rich Text Content Editor */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Content *
            </label>
            <RichTextEditor
              content={formData.content}
              onChange={handleContentChange}
              placeholder="Start writing your blog post..."
            />
            <p className="mt-4 text-sm text-gray-500">
              💡 <strong>Pro Tips:</strong> Select text to format it • Use headings to structure your content • Add links by selecting text and clicking the link button
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Link
              to="/admin/dashboard"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : (isEditing ? 'Update Post' : 'Publish Post')}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default PostEditor;