
-- Create storage bucket for design uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('design-uploads', 'design-uploads', true);

-- Create RLS policies for design uploads bucket
CREATE POLICY "Users can upload their own designs"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'design-uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own designs"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'design-uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own designs"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'design-uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own designs"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'design-uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
