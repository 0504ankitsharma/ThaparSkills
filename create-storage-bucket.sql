-- Storage Bucket Creation Instructions
-- This file contains instructions for creating the user-uploads storage bucket in Supabase

-- IMPORTANT: Storage buckets cannot be created via SQL in Supabase
-- You must create them through the Supabase Dashboard UI

-- Steps to create the user-uploads storage bucket:

-- 1. Go to your Supabase project dashboard
-- 2. Navigate to Storage in the left sidebar
-- 3. Click "Create a new bucket"
-- 4. Enter the following details:
--    - Name: user-uploads
--    - Public bucket: false (unchecked)
--    - File size limit: 5MB (or your preferred limit)
--    - Allowed MIME types: image/* (for profile pics and skill post images)

-- 5. Click "Create bucket"

-- 6. After creating the bucket, you'll need to set up RLS policies for it:

-- Enable RLS on the storage.objects table
-- This is usually already enabled by default

-- Create policy to allow users to upload their own files
-- (This will be handled by your API endpoints that verify Clerk authentication)

-- Note: The actual file uploads will be handled by your Next.js API routes
-- which will use the Supabase service role key to upload files on behalf
-- of authenticated users.
