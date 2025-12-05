import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { generateFingerprint } from '../lib/fingerprint';

export const useBlogEngagement = (postSlug: string) => {
  const [postId, setPostId] = useState<string | null>(null);
  const [views, setViews] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (postSlug) {
      initializePost();
    }
  }, [postSlug]);

  const initializePost = async () => {
    try {
      let { data: existingPost, error: fetchError } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', postSlug)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching post:', fetchError);
        setLoading(false);
        return;
      }

      if (!existingPost) {
        const { data: newPost, error: createError } = await supabase
          .from('blog_posts')
          .insert([{
            title: postSlug,
            slug: postSlug,
            content: '',
            excerpt: '',
            author: 'Ivan Melnychenko',
            published_at: new Date().toISOString()
          }])
          .select('id')
          .single();

        if (createError) {
          console.error('Error creating post:', createError);
          setLoading(false);
          return;
        }

        existingPost = newPost;
      }

      if (existingPost) {
        setPostId(existingPost.id);
        await trackView(existingPost.id);
        await loadViews(existingPost.id);
      }
    } catch (err) {
      console.error('Error initializing post:', err);
    } finally {
      setLoading(false);
    }
  };

  const trackView = async (id: string) => {
    const fingerprint = generateFingerprint();
    try {
      await supabase
        .from('blog_views')
        .insert([{
          post_id: id,
          user_fingerprint: fingerprint
        }]);
    } catch (err) {
      console.log('View already tracked or error:', err);
    }
  };

  const loadViews = async (id: string) => {
    try {
      const { count, error } = await supabase
        .from('blog_views')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', id);

      if (error) throw error;
      setViews(count || 0);
    } catch (err) {
      console.error('Error loading views:', err);
    }
  };

  return { postId, views, loading };
};
