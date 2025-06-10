
-- Create table to track Claude API usage for monitoring and billing
CREATE TABLE public.claude_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  request_type TEXT NOT NULL, -- 'insights', 'analysis', etc.
  tokens_used INTEGER DEFAULT 0,
  cost_usd DECIMAL(10,4) DEFAULT 0,
  request_data JSONB,
  response_data JSONB,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table to store Claude-generated insights
CREATE TABLE public.claude_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  insight_type TEXT NOT NULL, -- 'improvement', 'trend', 'issue', 'opportunity'
  priority TEXT NOT NULL DEFAULT 'medium', -- 'critical', 'high', 'medium', 'low'
  impact_area TEXT, -- 'conversion', 'engagement', 'revenue', 'ux'
  confidence_score DECIMAL(3,2) DEFAULT 0.0, -- 0.0 to 1.0
  data_source JSONB, -- What data was analyzed
  recommendations JSONB, -- Specific recommendations
  status TEXT DEFAULT 'new', -- 'new', 'reviewed', 'implemented', 'dismissed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.claude_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claude_insights ENABLE ROW LEVEL SECURITY;

-- RLS policies for claude_usage_logs
CREATE POLICY "Users can view their own usage logs" 
  ON public.claude_usage_logs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Owners can view all usage logs" 
  ON public.claude_usage_logs 
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'owner'));

CREATE POLICY "System can insert usage logs" 
  ON public.claude_usage_logs 
  FOR INSERT 
  WITH CHECK (true);

-- RLS policies for claude_insights
CREATE POLICY "Users can view their own insights" 
  ON public.claude_insights 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own insights" 
  ON public.claude_insights 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Owners can view all insights" 
  ON public.claude_insights 
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'owner'));

CREATE POLICY "System can insert insights" 
  ON public.claude_insights 
  FOR INSERT 
  WITH CHECK (true);

-- Create function to get Claude settings for authenticated users
CREATE OR REPLACE FUNCTION public.get_claude_settings()
RETURNS TABLE (
  claude_ai_enabled BOOLEAN,
  claude_model TEXT,
  claude_system_prompt TEXT
) 
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT 
    COALESCE((SELECT setting_value::boolean FROM public.admin_settings WHERE setting_key = 'claude_ai_enabled'), false) as claude_ai_enabled,
    COALESCE((SELECT setting_value::text FROM public.admin_settings WHERE setting_key = 'claude_model'), 'claude-3-haiku-20240307') as claude_model,
    COALESCE((SELECT setting_value::text FROM public.admin_settings WHERE setting_key = 'claude_system_prompt'), 'You are a UX analytics expert that provides insights on user behavior and experience patterns.') as claude_system_prompt
$$;
