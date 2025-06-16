
-- Create chat_analysis_history table to store Figmant chat analysis results
CREATE TABLE public.chat_analysis_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  prompt_used TEXT NOT NULL,
  prompt_template_used TEXT,
  analysis_results JSONB NOT NULL DEFAULT '{}',
  confidence_score NUMERIC DEFAULT 0.8,
  analysis_type TEXT NOT NULL DEFAULT 'figmant_chat',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.chat_analysis_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own chat analysis history" 
  ON public.chat_analysis_history 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chat analysis history" 
  ON public.chat_analysis_history 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat analysis history" 
  ON public.chat_analysis_history 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat analysis history" 
  ON public.chat_analysis_history 
  FOR DELETE 
  USING (auth.uid() = user_id);
