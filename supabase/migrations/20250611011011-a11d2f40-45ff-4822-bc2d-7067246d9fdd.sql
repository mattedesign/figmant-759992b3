
-- Add analysis_goals field to design_uploads table to store user context
ALTER TABLE public.design_uploads 
ADD COLUMN analysis_goals TEXT;

-- Create a new table for batch analysis results
CREATE TABLE public.design_batch_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_id UUID NOT NULL,
  user_id UUID NOT NULL,
  analysis_type TEXT NOT NULL,
  prompt_used TEXT NOT NULL,
  analysis_results JSONB NOT NULL,
  winner_upload_id UUID,
  key_metrics JSONB,
  recommendations JSONB,
  confidence_score NUMERIC DEFAULT 0.8,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for batch analysis
ALTER TABLE public.design_batch_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own batch analyses" 
  ON public.design_batch_analysis 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own batch analyses" 
  ON public.design_batch_analysis 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own batch analyses" 
  ON public.design_batch_analysis 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own batch analyses" 
  ON public.design_batch_analysis 
  FOR DELETE 
  USING (auth.uid() = user_id);
