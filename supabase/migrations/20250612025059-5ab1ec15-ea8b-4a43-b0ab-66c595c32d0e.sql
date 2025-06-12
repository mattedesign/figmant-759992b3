
-- Update the design-uploads bucket to allow SVG files and increase file size limit
UPDATE storage.buckets 
SET 
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'application/pdf']
WHERE id = 'design-uploads';

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can upload their own designs" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own designs" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own designs" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own designs" ON storage.objects;

-- Create more flexible policies that support organized folder structure
CREATE POLICY "Authenticated users can upload to design-uploads"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'design-uploads' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Authenticated users can view design-uploads"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'design-uploads' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Authenticated users can update design-uploads"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'design-uploads' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Authenticated users can delete design-uploads"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'design-uploads' 
  AND auth.uid() IS NOT NULL
);
