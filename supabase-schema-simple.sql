-- Simple ThaparSkills Schema - Run this in Supabase SQL Editor

-- Enable pgcrypto
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.sessions CASCADE;
DROP TABLE IF EXISTS public.chats CASCADE;
DROP TABLE IF EXISTS public.connections CASCADE;
DROP TABLE IF EXISTS public.skills CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Create users table
CREATE TABLE public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id text UNIQUE,
  name text NOT NULL,
  roll_number text UNIQUE NOT NULL,
  department text NOT NULL,
  year integer NOT NULL,
  skills text[] DEFAULT '{}',
  bio text DEFAULT '',
  profile_pic text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create skills table
CREATE TABLE public.skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  skill_name text NOT NULL,
  description text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Create connections table
CREATE TABLE public.connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('pending','accepted','rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create chats table
CREATE TABLE public.chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id uuid REFERENCES public.connections(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create sessions table
CREATE TABLE public.sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id uuid REFERENCES public.connections(id) ON DELETE CASCADE,
  date date NOT NULL,
  time time NOT NULL,
  place text,
  session_count integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_skills_created_at ON public.skills (created_at DESC);
CREATE INDEX idx_connections_status ON public.connections (receiver_id, status);
CREATE INDEX idx_chats_conn_created ON public.chats (connection_id, created_at DESC);
CREATE INDEX idx_users_clerk_id ON public.users (clerk_id);

-- Create skill_feed view
CREATE OR REPLACE VIEW public.skill_feed AS
SELECT 
  s.id,
  s.user_id,
  s.skill_name,
  s.description,
  s.image_url,
  s.created_at,
  u.name AS user_name,
  u.profile_pic AS user_pic,
  u.roll_number,
  u.department
FROM public.skills s
LEFT JOIN public.users u ON s.user_id = u.id
ORDER BY s.created_at DESC;

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (allow all for now)
CREATE POLICY "users_policy" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "skills_policy" ON public.skills FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "connections_policy" ON public.connections FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "chats_policy" ON public.chats FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "sessions_policy" ON public.sessions FOR ALL USING (true) WITH CHECK (true);

-- Success message
SELECT 'Database schema created successfully!' as status;
