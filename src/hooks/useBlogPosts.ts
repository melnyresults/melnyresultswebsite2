import { useState, useEffect } from 'react';
import { supabase, BlogPost } from '../lib/supabase';

export const useBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const createPost = async (postData: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'likes_count'>) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([{ ...postData, likes_count: 0 }])
        .select()
        .single();

      if (error) throw error;
      await fetchPosts(); // Refresh the list
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const updatePost = async (id: string, postData: Partial<BlogPost>) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .update({ ...postData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchPosts(); // Refresh the list
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const deletePost = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchPosts(); // Refresh the list
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const likePost = async (postId: string) => {
    try {
      // Get user's IP (simplified - in production you'd want a more robust solution)
      const userIp = 'user-' + Math.random().toString(36).substr(2, 9);
      
      const { error } = await supabase
        .from('post_likes')
        .insert([{ post_id: postId, user_ip: userIp }]);

      if (error) {
        // If it's a duplicate key error, the user already liked this post
        if (error.code === '23505') {
          return { error: 'You have already liked this post' };
        }
        throw error;
      }

      await fetchPosts(); // Refresh to get updated like count
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const unlikePost = async (postId: string) => {
    try {
      // Get user's IP (simplified - in production you'd want a more robust solution)
      const userIp = 'user-' + Math.random().toString(36).substr(2, 9);
      
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_ip', userIp);

      if (error) throw error;

      await fetchPosts(); // Refresh to get updated like count
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'An error occurred' };
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
    unlikePost,
    refetch: fetchPosts,
  };
};