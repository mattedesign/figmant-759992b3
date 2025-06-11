
-- Create the design-uploads storage bucket with proper configuration
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('design-uploads', 'design-uploads', false, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'])
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can upload their own designs" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own designs" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own designs" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own designs" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access for signed URLs" ON storage.objects;

-- Create comprehensive RLS policies for the design-uploads bucket
CREATE POLICY "Users can upload their own designs"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'design-uploads' 
  AND auth.uid() IS NOT NULL
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own designs"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'design-uploads' 
  AND auth.uid() IS NOT NULL
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own designs"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'design-uploads' 
  AND auth.uid() IS NOT NULL
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own designs"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'design-uploads' 
  AND auth.uid() IS NOT NULL
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public access for signed URLs (needed for Claude AI to access images)
CREATE POLICY "Allow public access for signed URLs"
ON storage.objects FOR SELECT
USING (bucket_id = 'design-uploads');
