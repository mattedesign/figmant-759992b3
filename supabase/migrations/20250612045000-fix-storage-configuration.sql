
-- Ensure design-uploads bucket exists with proper configuration
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('design-uploads', 'design-uploads', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'application/pdf', 'text/html'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'application/pdf', 'text/html'];

-- Create assets/branding/logo directory structure if it doesn't exist
-- This will be handled by the application code

-- Drop and recreate storage policies for better permissions
DROP POLICY IF EXISTS "Authenticated users can upload to design-uploads" ON storage.objects;
DROP POLICY IF EXISTS "Public read access to design-uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update design-uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete design-uploads" ON storage.objects;

-- Create comprehensive storage policies
CREATE POLICY "Public read access to design-uploads"
ON storage.objects FOR SELECT
USING (bucket_id = 'design-uploads');

CREATE POLICY "Authenticated users can upload to design-uploads"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'design-uploads' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Authenticated users can update their own files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'design-uploads' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Authenticated users can delete their own files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'design-uploads' 
  AND auth.uid() IS NOT NULL
);

-- Ensure logo_configuration table has proper structure
CREATE TABLE IF NOT EXISTS public.logo_configuration (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  active_logo_url TEXT NOT NULL,
  fallback_logo_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS on logo_configuration if not already enabled
ALTER TABLE public.logo_configuration ENABLE ROW LEVEL SECURITY;

-- Recreate logo configuration policies
DROP POLICY IF EXISTS "Users can view their own logo configuration" ON public.logo_configuration;
DROP POLICY IF EXISTS "Users can insert their own logo configuration" ON public.logo_configuration;
DROP POLICY IF EXISTS "Users can update their own logo configuration" ON public.logo_configuration;
DROP POLICY IF EXISTS "Users can delete their own logo configuration" ON public.logo_configuration;

CREATE POLICY "Users can view their own logo configuration"
  ON public.logo_configuration
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own logo configuration"
  ON public.logo_configuration
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own logo configuration"
  ON public.logo_configuration
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own logo configuration"
  ON public.logo_configuration
  FOR DELETE
  USING (auth.uid() = user_id);
