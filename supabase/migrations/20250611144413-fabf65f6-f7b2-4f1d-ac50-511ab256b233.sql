
-- Fix the storage INSERT policy for design uploads
DROP POLICY IF EXISTS "Users can upload their own designs" ON storage.objects;

CREATE POLICY "Users can upload their own designs"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'design-uploads' 
  AND auth.uid() IS NOT NULL
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Ensure the bucket exists and has proper configuration
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('design-uploads', 'design-uploads', false, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'])
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
