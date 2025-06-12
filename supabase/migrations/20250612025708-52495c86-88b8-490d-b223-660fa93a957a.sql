
-- Make the design-uploads bucket public for logo access
UPDATE storage.buckets 
SET public = true 
WHERE id = 'design-uploads';
