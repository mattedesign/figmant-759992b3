
-- Add columns to design_uploads table to support batch modification workflow
ALTER TABLE public.design_uploads 
ADD COLUMN original_batch_id uuid,
ADD COLUMN is_replacement boolean DEFAULT false,
ADD COLUMN replaced_upload_id uuid;

-- Add foreign key constraint for replaced_upload_id (references the id column which has a primary key)
ALTER TABLE public.design_uploads 
ADD CONSTRAINT fk_replaced_upload_id 
FOREIGN KEY (replaced_upload_id) REFERENCES public.design_uploads(id);

-- Note: We don't add a foreign key for original_batch_id since batch_id doesn't have a unique constraint
-- Instead, we'll handle this relationship logically in the application

-- Add columns to design_batch_analysis table to support re-run workflow
ALTER TABLE public.design_batch_analysis 
ADD COLUMN parent_analysis_id uuid,
ADD COLUMN modification_summary text,
ADD COLUMN version_number integer DEFAULT 1;

-- Add foreign key constraint for parent analysis
ALTER TABLE public.design_batch_analysis 
ADD CONSTRAINT fk_parent_analysis_id 
FOREIGN KEY (parent_analysis_id) REFERENCES public.design_batch_analysis(id);

-- Create index for better performance on batch queries
CREATE INDEX idx_design_uploads_original_batch_id ON public.design_uploads(original_batch_id);
CREATE INDEX idx_design_batch_analysis_parent_id ON public.design_batch_analysis(parent_analysis_id);

-- Add comments to document the new columns
COMMENT ON COLUMN public.design_uploads.original_batch_id IS 'References the batch_id of the original batch this upload is modifying';
COMMENT ON COLUMN public.design_uploads.is_replacement IS 'Indicates if this upload is replacing another upload in a batch modification';
COMMENT ON COLUMN public.design_uploads.replaced_upload_id IS 'References the upload being replaced in a batch modification';
COMMENT ON COLUMN public.design_batch_analysis.parent_analysis_id IS 'References the original analysis this is a re-run of';
COMMENT ON COLUMN public.design_batch_analysis.modification_summary IS 'Summary of what was changed in this re-run';
COMMENT ON COLUMN public.design_batch_analysis.version_number IS 'Version number of this analysis iteration';
