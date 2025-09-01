import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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