import { createClient } from '@supabase/supabase-js'

// Supabase configuration - credentials are handled securely via Edge Functions
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  // Don't throw error, just log it for development
}
// Only create client if we have the required variables
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Note: Authentication is handled via Edge Functions for security
// No auth API exposed here to prevent credential leakage

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