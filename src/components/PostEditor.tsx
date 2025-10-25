import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Calendar, User, Image, Tag, Clock, FileText, Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useBlogPosts } from '../hooks/useBlogPosts';
import { BlogPost, createBlogPost, updateBlogPost } from '../lib/localStorage';
import RichTextEditor from './RichTextEditor';
import { usePageMeta } from '../hooks/usePageMeta';

const PostEditor: React.FC = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { posts, refetch } = useBlogPosts();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    author: 'Ivan Melnychenko',
    image_url: '',
    published_at: new Date().toISOString().split('T')[0],
    category: 'Growth Strategies',
    tags: '',
    meta_description: '',
    meta_title: '',
    scheduled_for: '',
    comments_enabled: true,
    slug: '',
    canonical_url: '',
    keywords: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  
  usePageMeta({
    title: `${isEditing ? 'Edit Post' : 'New Post'} - Melny Results Admin`,
    description: `${isEditing ? 'Edit an existing' : 'Create a new'} blog post for Melny Results marketing blog.`,
    keywords: 'blog editor, content creation, post editor, blog management',
    ogTitle: `${isEditing ? 'Edit Post' : 'New Post'} - Blog Editor`,
    ogDescription: `${isEditing ? 'Edit your' : 'Create a new'} blog post with our rich text editor.`,
  });

  const categories = ['Growth Strategies', 'Success Stories', 'Tips', 'Case Studies'];

  useEffect(() => {
    if (isEditing && id) {
      const post = posts.find(p => p.id === id);
      if (post) {
        setFormData(prev => ({
          ...prev,
          title: post.title || '',
          content: post.content || '',
          excerpt: post.excerpt || '',
          author: post.author || 'Ivan Melnychenko',
          image_url: post.image_url || '',
          published_at: post.published_at ? post.published_at.split('T')[0] : new Date().toISOString().split('T')[0],
          meta_title: post.meta_title || '',
          meta_description: post.meta_description || '',
          slug: post.slug || '',
          canonical_url: post.canonical_url || '',
          keywords: post.keywords || '',
          tags: post.tags || '',
        }));
      }
    }
  }, [isEditing, id, posts]);

  // Auto-save functionality
  useEffect(() => {
    if (formData.title || formData.content) {
      const timer = setTimeout(() => {
        localStorage.setItem('blog_draft', JSON.stringify(formData));
        setAutoSaveStatus('Draft saved');
        setTimeout(() => setAutoSaveStatus(''), 2000);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  };

  const generateExcerpt = (content: string) => {
    const plainText = content.replace(/<[^>]*>/g, '');
    return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
  };

  const generateSEOSuggestions = () => {
    if (formData.title) {
      const metaTitle = formData.title.length > 60 ? formData.title.substring(0, 57) + '...' : formData.title;
      const metaDescription = formData.excerpt || generateExcerpt(formData.content);
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      setFormData(prev => ({
        ...prev,
        meta_title: metaTitle,
        meta_description: metaDescription.length > 160 ? metaDescription.substring(0, 157) + '...' : metaDescription,
        slug: slug,
        canonical_url: `https://melnyresults.com/blog/${slug}`
      }));
    }
  };

  const generateTableOfContents = (content: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const headings = tempDiv.querySelectorAll('h2, h3');
    
    return Array.from(headings).map((heading, index) => ({
      id: `heading-${index}`,
      text: heading.textContent || '',
      level: parseInt(heading.tagName.charAt(1))
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate required fields
    if (!formData.title.trim()) {
      setError('Title is required');
      setLoading(false);
      return;
    }

    if (!formData.content.trim()) {
      setError('Content is required');
      setLoading(false);
      return;
    }
    const postData = {
      ...formData,
      excerpt: formData.excerpt || generateExcerpt(formData.content),
      published_at: new Date(formData.published_at).toISOString(),
    };

    try {
      let postId = id;
      if (isEditing && id) {
        const updatedPost = updateBlogPost(id, postData);
        if (!updatedPost) {
          setError('Post not found');
          setLoading(false);
          return;
        }
      } else {
        const newPost = createBlogPost(postData as Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'likes_count'>);
        postId = newPost.id;
      }

      // Clear draft data after successful save
      localStorage.removeItem('blog_draft');
      await refetch(); // Refresh the posts list
      navigate(`/admin/posts/published/${postId}`);
    } catch (err) {
      console.error('Post save error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
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

  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const plainText = content.replace(/<[^>]*>/g, '');
    const wordCount = plainText.split(' ').length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
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
              {autoSaveStatus && (
                <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  {autoSaveStatus}
                </span>
              )}
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
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
                  className="w-full px-4 py-3 text-2xl font-semibold border-0 focus:ring-0 focus:outline-none resize-none"
                  placeholder="Enter your post title..."
                  aria-describedby="title-help"
                />
                <div id="title-help" className="mt-2 text-sm text-gray-500">
                  {(formData.title || '').length}/60 characters (optimal for SEO)
                </div>
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
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {formData.content.replace(/<[^>]*>/g, '').split(' ').length} words
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {getReadTime(formData.content)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const toc = generateTableOfContents(formData.content);
                      console.log('Table of Contents:', toc);
                    }}
                    className="text-primary-blue hover:text-blue-700 transition-colors"
                  >
                    Generate TOC
                  </button>
                </div>
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Post Settings */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Post Settings</h3>
              
              <div className="space-y-4">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="my-blog-post-title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    URL: /blog/{(formData.slug || 'your-post-slug')}
                  </p>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
                  Featured Image
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
              {formData.image_url && (
                <div className="mt-4">
                  <img
                    src={formData.image_url}
                    alt={`Featured image preview for: ${formData.title || 'new blog post'}`}
                    className="w-full h-32 object-cover rounded-lg"
                    loading="lazy"
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
                Excerpt
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows={3}
                value={formData.excerpt}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent resize-none"
                placeholder="Brief description of your post (will be auto-generated if left empty)"
              />
              <div className="mt-2 text-sm text-gray-500">
                {(formData.excerpt || '').length}/150 characters
              </div>
            </div>

            {/* SEO Settings */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">SEO Settings</h3>
                <button
                  type="button"
                  onClick={generateSEOSuggestions}
                  className="inline-flex items-center px-3 py-1 text-xs font-medium text-primary-blue bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  Auto-generate
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="meta_title" className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    id="meta_title"
                    name="meta_title"
                    value={formData.meta_title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                    placeholder="SEO optimized title (leave empty to use post title)"
                  />
                  <div className="mt-1 text-sm text-gray-500">
                    {(formData.meta_title || '').length}/60 characters
                  </div>
                </div>

                <div>
                  <label htmlFor="meta_description" className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    id="meta_description"
                    name="meta_description"
                    rows={3}
                    value={formData.meta_description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent resize-none"
                    placeholder="Meta description for search engines"
                  />
                  <div className="mt-1 text-sm text-gray-500">
                    {(formData.meta_description || '').length}/160 characters
                  </div>
                </div>

                <div>
                  <label htmlFor="canonical_url" className="block text-sm font-medium text-gray-700 mb-2">
                    Canonical URL
                  </label>
                  <input
                    type="url"
                    id="canonical_url"
                    name="canonical_url"
                    value={formData.canonical_url}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                    placeholder="https://melnyresults.com/blog/your-post-slug"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Leave empty to auto-generate from slug
                  </p>
                </div>

                <div>
                  <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-2">
                    Keywords (comma separated)
                  </label>
                  <input
                    type="text"
                    id="keywords"
                    name="keywords"
                    value={formData.keywords}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                    placeholder="marketing, business growth, lead generation"
                  />
                </div>

                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                    placeholder="tips, strategies, case-study"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Tags for categorization and filtering
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostEditor;