import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

// Use placeholder values during development if env vars are not set
const defaultUrl = (supabaseUrl && supabaseUrl !== '') ? supabaseUrl : 'https://placeholder.supabase.co'
const defaultKey = (supabaseAnonKey && supabaseAnonKey !== '') ? supabaseAnonKey : 'placeholder-anon-key'

if (!supabaseUrl || supabaseUrl === '' || !supabaseAnonKey || supabaseAnonKey === '') {
  console.warn('⚠️  Supabase environment variables not configured. Please set up your .env file with actual Supabase credentials.')
}

export const supabase = createClient(defaultUrl, defaultKey)
// Database types
export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  author: string
  published_at: string
  created_at: string
  updated_at: string
  image_url?: string
  likes_count: number
}

export interface Comment {
  id: number
  post_slug: string
  author_name: string
  author_email: string
  content: string
  status: 'pending' | 'approved'
  created_at: string
}

export interface Like {
  id: number
  post_slug: string
  user_id?: string
  ip_address?: string
  created_at: string
}