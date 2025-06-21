
-- Create storage bucket for design uploads with proper configuration
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('design-uploads', 'design-uploads', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'application/pdf', 'text/html'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'application/pdf', 'text/html'];

-- Create comprehensive storage policies for public read access
DROP POLICY IF EXISTS "Public read access to design-uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to design-uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete their own files" ON storage.objects;

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
