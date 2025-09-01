import { createClient } from '@supabase/supabase-js'

// Create a minimal Supabase client for public operations only
// Authentication is handled via Edge Functions to keep credentials secure
const supabaseUrl = 'https://czgrvkyqsblqhehfjlkw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6Z3J2a3lxc2JscWhlaGZqbGt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NDI2ODQsImV4cCI6MjA3MjMxODY4NH0.HxdFdqTWqseOt8Wnn9wYHj9xJ-q93k0XDCfxi4h5PgU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth API endpoints (handled by Edge Functions)
const AUTH_API_URL = `${supabaseUrl}/functions/v1/auth`

export const authAPI = {
  signIn: async (email: string, password: string) => {
    const response = await fetch(AUTH_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, action: 'signIn' })
    })
    return response.json()
  },

  signOut: async () => {
    const response = await fetch(AUTH_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'signOut' })
    })
    return response.json()
  },

  getUser: async (token: string) => {
    const response = await fetch(AUTH_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ action: 'getUser' })
    })
    return response.json()
  }
}

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