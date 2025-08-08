import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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
      // Fallback to localStorage for development
      const { initializeSampleData, getBlogPosts } = await import('../lib/localStorage');
      initializeSampleData();
      const blogPosts = getBlogPosts();
      setPosts(blogPosts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const createBlogPost = async (postData: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'likes_count'>) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([{
          ...postData,
          likes_count: 0
        }])
        .select()
        .single();

      if (error) throw error;
      await fetchPosts();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const updateBlogPost = async (id: string, postData: Partial<BlogPost>) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .update(postData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchPosts();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const deleteBlogPost = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchPosts();
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const likePost = async (postId: string) => {
    try {
      // Check if user already liked this post (using localStorage for now)
      const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '[]');
      if (likedPosts.includes(postId)) {
        return { error: 'You have already liked this post' };
      }

      // Insert like record
      const { error: likeError } = await supabase
        .from('post_likes')
        .insert([{ post_id: postId }]);

      if (likeError) throw likeError;

      // Update likes count
      const { error: updateError } = await supabase
        .rpc('increment_post_likes', { post_id: postId });

      if (updateError) throw updateError;

      // Store in localStorage to prevent duplicate likes
      likedPosts.push(postId);
      localStorage.setItem('liked_posts', JSON.stringify(likedPosts));

      await fetchPosts();
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const unlikePost = async (postId: string) => {
    try {
      // Remove like record
      const { error: unlikeError } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId);

      if (unlikeError) throw unlikeError;

      // Update likes count
      const { error: updateError } = await supabase
        .rpc('decrement_post_likes', { post_id: postId });

      if (updateError) throw updateError;

      // Remove from localStorage
      const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '[]');
      const updatedLikedPosts = likedPosts.filter((id: string) => id !== postId);
      localStorage.setItem('liked_posts', JSON.stringify(updatedLikedPosts));

      await fetchPosts();
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'An error occurred' };
    }
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