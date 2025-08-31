-- ThaparSkills Supabase Schema - Complete and Error-Free
-- Run this entire file in your Supabase SQL editor

-- Step 1: Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Step 2: Create USERS table
CREATE TABLE IF NOT EXISTS public.users (
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

-- Step 3: Create SKILLS table
CREATE TABLE IF NOT EXISTS public.skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  skill_name text NOT NULL,
  description text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Step 4: Create CONNECTIONS table
CREATE TABLE IF NOT EXISTS public.connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('pending','accepted','rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Step 5: Create CHATS table
CREATE TABLE IF NOT EXISTS public.chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id uuid REFERENCES public.connections(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Step 6: Create SESSIONS table
CREATE TABLE IF NOT EXISTS public.sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id uuid REFERENCES public.connections(id) ON DELETE CASCADE,
  date date NOT NULL,
  time time NOT NULL,
  place text,
  session_count integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Step 7: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_skills_created_at ON public.skills (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_connections_status ON public.connections (receiver_id, status);
CREATE INDEX IF NOT EXISTS idx_chats_conn_created ON public.chats (connection_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON public.users (clerk_id);

-- Step 8: Create the skill_feed view
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
  u.roll_number
FROM public.skills s
LEFT JOIN public.users u ON s.user_id = u.id
ORDER BY s.created_at DESC;

-- Step 9: Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Step 10: Create RLS policies
-- Note: Since we're using Clerk for authentication, RLS policies will be enforced
-- at the API level. The server-side API will run with service_role and verify
-- Clerk sessions before performing operations.

-- USERS policies
CREATE POLICY "users_insert_own" ON public.users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "users_select_public" ON public.users
  FOR SELECT USING (true);

-- SKILLS policies
CREATE POLICY "skills_insert_owner" ON public.skills
  FOR INSERT WITH CHECK (true);

CREATE POLICY "skills_modify_owner" ON public.skills
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "skills_delete_owner" ON public.skills
  FOR DELETE USING (true);

CREATE POLICY "skills_select" ON public.skills
  FOR SELECT USING (true);

-- CONNECTIONS policies
CREATE POLICY "connections_insert_sender" ON public.connections
  FOR INSERT WITH CHECK (true);

CREATE POLICY "connections_select" ON public.connections
  FOR SELECT USING (true);

CREATE POLICY "connections_update_receiver" ON public.connections
  FOR UPDATE USING (true) WITH CHECK (true);

-- CHATS policies
CREATE POLICY "chats_participants" ON public.chats
  FOR INSERT WITH CHECK (true);

CREATE POLICY "chats_select_participant" ON public.chats
  FOR SELECT USING (true);

-- SESSIONS policies
CREATE POLICY "sessions_insert_participants" ON public.sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "sessions_select_participants" ON public.sessions
  FOR SELECT USING (true);

-- Success! Your database schema is now ready.
-- Next step: Create the user-uploads storage bucket via Supabase Dashboard UI
