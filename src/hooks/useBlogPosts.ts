import { useState, useEffect } from 'react';

export type BlogPost = {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  image_url?: string;
  likes_count: number;
};

export type {
  BlogPost, 
  getBlogPosts, 
  createBlogPost as createPost, 
  updateBlogPost as updatePost, 
  deleteBlogPost as deletePost, 
  likeBlogPost,
  initializeSampleData
} from '../lib/localStorage';

export const useBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      // Initialize sample data if needed
      const { initializeSampleData, getBlogPosts } = await import('../lib/localStorage');
      initializeSampleData();
      const blogPosts = getBlogPosts();
      setPosts(blogPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const createBlogPost = async (postData: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'likes_count'>) => {
    try {
      const { createBlogPost: createPost } = await import('../lib/localStorage');
      const newPost = createPost(postData);
      await fetchPosts(); // Refresh the list
      return { data: newPost, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const updateBlogPost = async (id: string, postData: Partial<BlogPost>) => {
    try {
      const { updateBlogPost: updatePost } = await import('../lib/localStorage');
      const updatedPost = updatePost(id, postData);
      if (!updatedPost) {
        return { data: null, error: 'Post not found' };
      }
      await fetchPosts(); // Refresh the list
      return { data: updatedPost, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const deleteBlogPost = async (id: string) => {
    try {
      const { deleteBlogPost: deletePost } = await import('../lib/localStorage');
      const success = deletePost(id);
      if (!success) {
        return { error: 'Post not found' };
      }
      await fetchPosts(); // Refresh the list
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const likePost = async (postId: string) => {
    try {
      const { likeBlogPost } = await import('../lib/localStorage');
      const result = likeBlogPost(postId);
      if (!result.success) {
        return { error: result.error || 'Failed to like post' };
      }
      await fetchPosts(); // Refresh to get updated like count
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const unlikePost = async (postId: string) => {
    // For simplicity, we'll just return an error since unlike functionality
    // would require more complex tracking
    return { error: 'Unlike functionality not implemented in local storage version' };
  };

  return {
    posts,
    loading,
    error,
    createPost: createBlogPost,
    updatePost: updateBlogPost,
    deletePost: deleteBlogPost,
    likePost,
    unlikePost,
    refetch: fetchPosts,
  };
};