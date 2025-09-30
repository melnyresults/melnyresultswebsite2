import { useState, useEffect } from 'react';
import { BoltDatabase, BlogPost } from '../lib/boltDatabase';

export const useBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const blogPosts = await BoltDatabase.getBlogPosts();
      setPosts(blogPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const createPost = async (postData: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'likes_count'>) => {
    try {
      const newPost = await BoltDatabase.createBlogPost(postData);
      await fetchPosts(); // Refresh the list
      return { data: newPost, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const updatePost = async (id: string, postData: Partial<BlogPost>) => {
    try {
      const updatedPost = await BoltDatabase.updateBlogPost(id, postData);
      if (!updatedPost) {
        return { data: null, error: 'Post not found' };
      }
      await fetchPosts(); // Refresh the list
      return { data: updatedPost, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const deletePost = async (id: string) => {
    try {
      const success = await BoltDatabase.deleteBlogPost(id);
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
      const result = await BoltDatabase.likeBlogPost(postId);
      if (result.success) {
        await fetchPosts(); // Refresh to show updated like count
      }
      return result;
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  return {
    posts,
    loading,
    error,
    createPost,
    updatePost,
    deletePost,
    likePost,
    refetch: fetchPosts,
  };
};

export type { BlogPost };