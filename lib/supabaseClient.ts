import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Check if environment variables are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: supabaseUrl ? '✅' : '❌',
    anonKey: supabaseAnonKey ? '✅' : '❌'
  })
}

// Client-side instance (for browser) - with fallback
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

// Server-side instance (for API routes with elevated privileges)
export const supabaseAdmin = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseServiceKey || 'placeholder-service-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Database types
export interface User {
  id: string
  clerk_id: string
  name: string
  roll_number: string
  department: string
  year: number
  skills: string[]
  bio: string
  profile_pic?: string
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  user_id: string
  skill_name: string
  description?: string
  image_url?: string
  created_at: string
  user_name?: string
  user_pic?: string
  roll_number?: string
}

export interface Connection {
  id: string
  sender_id: string
  receiver_id: string
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
  updated_at: string
}

export interface Chat {
  id: string
  connection_id: string
  sender_id: string
  message: string
  created_at: string
}

export interface Session {
  id: string
  connection_id: string
  date: string
  time: string
  place?: string
  session_count: number
  created_at: string
}
