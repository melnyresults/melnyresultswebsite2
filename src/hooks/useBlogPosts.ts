import { useState, useEffect } from 'react';
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost, likeBlogPost, getLikedPosts, initializeSampleData } from '../lib/localStorage';

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
      initializeSampleData();
      const blogPosts = getBlogPosts();
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
      const newPost = createBlogPost(postData);
      await fetchPosts();
      return { data: newPost, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const updatePost = async (id: string, postData: Partial<BlogPost>) => {
    try {
      const updatedPost = updateBlogPost(id, postData);
      await fetchPosts();
      return { data: updatedPost, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const deletePost = async (id: string) => {
    try {
      deleteBlogPost(id);
      await fetchPosts();
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const likePost = async (postId: string) => {
    try {
      const likedPosts = getLikedPosts();
      if (likedPosts.includes(postId)) {
        return { error: 'You have already liked this post' };
      }

      likeBlogPost(postId);
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