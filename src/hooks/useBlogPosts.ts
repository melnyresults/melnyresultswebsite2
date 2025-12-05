import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { generateFingerprint } from '../lib/fingerprint';

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
  is_published?: boolean;
  scheduled_publish_date?: string;
  noindex?: boolean;
  schema_type?: 'blog' | 'custom';
  custom_schema?: object;
  related_post_ids?: string[];
};

export const useBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async (includeScheduled = false) => {
    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();

      let query = supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false });

      if (!user && !includeScheduled) {
        query = query
          .eq('is_published', true)
          .or(`scheduled_publish_date.is.null,scheduled_publish_date.lte.${new Date().toISOString()}`);
      }

      const { data: blogPosts, error } = await query;

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
          image_url: postData.image_url,
          meta_title: postData.meta_title,
          meta_description: postData.meta_description,
          slug: postData.slug,
          canonical_url: postData.canonical_url,
          keywords: postData.keywords,
          tags: postData.tags,
          is_published: postData.is_published || false,
          scheduled_publish_date: postData.scheduled_publish_date || null,
          noindex: postData.noindex || false,
          schema_type: postData.schema_type || 'blog',
          custom_schema: postData.custom_schema || null,
          related_post_ids: postData.related_post_ids || [],
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }

      await fetchPosts();
      return { data: newPost, error: null };
    } catch (err) {
      console.error('Create post error:', err);
      const errorMessage = err instanceof Error ? err.message : (typeof err === 'object' && err !== null ? JSON.stringify(err) : 'An error occurred');
      return { data: null, error: errorMessage };
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
        console.error('Supabase update error:', error);
        throw error;
      }

      await fetchPosts();
      return { data: updatedPost, error: null };
    } catch (err) {
      console.error('Update post error:', err);
      const errorMessage = err instanceof Error ? err.message : (typeof err === 'object' && err !== null ? JSON.stringify(err) : 'An error occurred');
      return { data: null, error: errorMessage };
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
      const fingerprint = generateFingerprint();

      // Check if user already liked this post
      const { data: existingLike } = await supabase
        .from('blog_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_fingerprint', fingerprint)
        .maybeSingle();

      if (existingLike) {
        return { error: 'You have already liked this post' };
      }

      // Add like
      const { error: likeError } = await supabase
        .from('blog_likes')
        .insert([{ post_id: postId, user_fingerprint: fingerprint }]);

      if (likeError) {
        throw likeError;
      }

      // Fetch updated post to get new likes count
      const { data: updatedPost } = await supabase
        .from('blog_posts')
        .select('likes_count')
        .eq('id', postId)
        .single();

      // Refresh posts list
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