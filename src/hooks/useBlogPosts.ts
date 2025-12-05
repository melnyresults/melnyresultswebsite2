import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { generateFingerprint } from '../lib/fingerprint';

export type BlogPost = {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  slug?: string;
  image_url?: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  is_published: boolean;
  likes_count: number;
  views_count: number;
  meta_title?: string;
  meta_description?: string;
  keywords?: string;
  tags?: string;
  canonical_url?: string;
  scheduled_publish_date?: string;
  noindex?: boolean;
  schema_type?: 'blog' | 'custom';
  custom_schema?: object;
  related_post_ids?: string[];
  author_id?: string;
};

type CreatePostData = Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'likes_count' | 'views_count'>;
type UpdatePostData = Partial<CreatePostData>;

export const useBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async (includeUnpublished = false) => {
    try {
      setLoading(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      const isAuthenticated = !!session;

      let query = supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false });

      if (!isAuthenticated && !includeUnpublished) {
        const now = new Date().toISOString();
        query = query
          .eq('is_published', true)
          .or(`scheduled_publish_date.is.null,scheduled_publish_date.lte.${now}`);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setPosts(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch posts';
      setError(errorMessage);
      console.error('Fetch posts error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const createPost = async (postData: CreatePostData) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        return {
          data: null,
          error: 'You must be logged in to create a post'
        };
      }

      const { data, error: insertError } = await supabase
        .from('blog_posts')
        .insert([{
          ...postData,
          author_id: session.user.id,
        }])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      await fetchPosts();
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create post';
      console.error('Create post error:', err);
      return { data: null, error: errorMessage };
    }
  };

  const updatePost = async (id: string, postData: UpdatePostData) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        return {
          data: null,
          error: 'You must be logged in to update a post'
        };
      }

      const { data, error: updateError } = await supabase
        .from('blog_posts')
        .update(postData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      await fetchPosts();
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update post';
      console.error('Update post error:', err);
      return { data: null, error: errorMessage };
    }
  };

  const deletePost = async (id: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        return { error: 'You must be logged in to delete a post' };
      }

      const { error: deleteError } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      await fetchPosts();
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete post';
      console.error('Delete post error:', err);
      return { error: errorMessage };
    }
  };

  const likePost = async (postId: string) => {
    try {
      const fingerprint = generateFingerprint();

      const { data: existingLike } = await supabase
        .from('blog_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_fingerprint', fingerprint)
        .maybeSingle();

      if (existingLike) {
        return { error: 'You have already liked this post' };
      }

      const { error: insertError } = await supabase
        .from('blog_likes')
        .insert([{
          post_id: postId,
          user_fingerprint: fingerprint
        }]);

      if (insertError) {
        throw insertError;
      }

      await fetchPosts();
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to like post';
      console.error('Like post error:', err);
      return { error: errorMessage };
    }
  };

  const getPostBySlug = async (slug: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch post';
      console.error('Get post by slug error:', err);
      return { data: null, error: errorMessage };
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
    getPostBySlug,
    refetch: fetchPosts,
  };
};
