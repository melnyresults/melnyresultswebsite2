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
  meta_title?: string;
  meta_description?: string;
  slug?: string;
  canonical_url?: string;
  keywords?: string;
  tags?: string;
};

export const useBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      const { data: blogPosts, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) {
        throw error;
      }

      setPosts(blogPosts || []);
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
      const { data: newPost, error } = await supabase
        .from('blog_posts')
        .insert([{
          title: postData.title,
          content: postData.content,
          excerpt: postData.excerpt,
          author: postData.author,
          published_at: postData.published_at,
          image_url: postData.image_url
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      await fetchPosts();
      return { data: newPost, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const updatePost = async (id: string, postData: Partial<BlogPost>) => {
    try {
      const { data: updatedPost, error } = await supabase
        .from('blog_posts')
        .update({
          ...postData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      await fetchPosts();
      return { data: updatedPost, error: null };
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

      if (error) {
        throw error;
      }

      await fetchPosts();
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const likePost = async (postId: string) => {
    try {
      // Get user's IP address (simplified - in production you'd want a more robust solution)
      const userIP = 'anonymous-' + Math.random().toString(36).substr(2, 9);
      
      // Check if user already liked this post
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_ip', userIP)
        .single();

      if (existingLike) {
        return { error: 'You have already liked this post' };
      }

      // Add like
      const { error: likeError } = await supabase
        .from('likes')
        .insert([{ post_id: postId, user_ip: userIP }]);

      if (likeError) {
        throw likeError;
      }

      // Update likes count
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({ likes_count: supabase.sql`likes_count + 1` })
        .eq('id', postId);

      if (updateError) {
        throw updateError;
      }

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
    createPost,
    updatePost,
    deletePost,
    likePost,
    refetch: fetchPosts,
  };
};