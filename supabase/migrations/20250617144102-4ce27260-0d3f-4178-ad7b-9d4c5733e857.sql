
-- Update the design-uploads bucket to allow video files and increase file size limit to 50MB
UPDATE storage.buckets 
SET 
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY[
    'image/jpeg', 
    'image/png', 
    'image/gif', 
    'image/webp', 
    'image/svg+xml', 
    'application/pdf',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-matroska'
  ]
WHERE id = 'design-uploads';
