
-- Add context_files table to store additional context files for analysis
CREATE TABLE public.design_context_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  upload_id UUID NOT NULL REFERENCES public.design_uploads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  content_preview TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for context files
ALTER TABLE public.design_context_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own context files" 
  ON public.design_context_files 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own context files" 
  ON public.design_context_files 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own context files" 
  ON public.design_context_files 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own context files" 
  ON public.design_context_files 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add analysis_preferences to design_uploads for storing analysis settings
ALTER TABLE public.design_uploads 
ADD COLUMN analysis_preferences JSONB DEFAULT '{"auto_comparative": true, "context_integration": true}'::jsonb;

-- Update design_batch_analysis to include context summary
ALTER TABLE public.design_batch_analysis 
ADD COLUMN context_summary TEXT,
ADD COLUMN analysis_settings JSONB DEFAULT '{}'::jsonb;
