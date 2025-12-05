import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web',
    },
  },
})


// Database Types
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
  meta_title?: string
  meta_description?: string
  slug?: string
  canonical_url?: string
  keywords?: string
  tags?: string
}

export interface Comment {
  id: string
  post_id: string
  author_name: string
  author_email: string
  content: string
  approved: boolean
  created_at: string
}

export interface Like {
  id: string
  post_id: string
  user_ip: string
  created_at: string
}

export interface MarketingSubmission {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  company_name: string
  how_did_you_find_us: string
  monthly_spend: string
  website: string
  created_at: string
}

export interface NewsletterSignup {
  id: string
  email: string
  created_at: string
}