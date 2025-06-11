
-- Check what analytics tables already exist and create only the missing ones

-- Create design upload analytics table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.design_upload_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  upload_id UUID REFERENCES public.design_uploads(id) ON DELETE CASCADE,
  file_size_bytes BIGINT,
  file_type TEXT,
  processing_time_ms INTEGER,
  analysis_success BOOLEAN,
  use_case TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user activity logs table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.user_activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  activity_type TEXT NOT NULL, -- 'login', 'upload', 'analysis', 'chat', 'download'
  page_path TEXT,
  session_duration_seconds INTEGER,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create system performance metrics table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.system_performance_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value DECIMAL(10, 4) NOT NULL,
  metric_unit TEXT, -- 'ms', 'mb', 'percent', 'count'
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for new analytics tables
ALTER TABLE public.design_upload_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_performance_metrics ENABLE ROW LEVEL SECURITY;

-- RLS policies - owners can see all data, users can see their own data
CREATE POLICY "Owners can view all upload analytics" 
  ON public.design_upload_analytics 
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'owner'));

CREATE POLICY "Users can view their own upload analytics" 
  ON public.design_upload_analytics 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert upload analytics" 
  ON public.design_upload_analytics 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Owners can view all activity logs" 
  ON public.user_activity_logs 
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'owner'));

CREATE POLICY "Users can view their own activity logs" 
  ON public.user_activity_logs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert activity logs" 
  ON public.user_activity_logs 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Owners can view system metrics" 
  ON public.system_performance_metrics 
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'owner'));

CREATE POLICY "System can insert performance metrics" 
  ON public.system_performance_metrics 
  FOR INSERT 
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_design_upload_analytics_user_id ON public.design_upload_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_design_upload_analytics_created_at ON public.design_upload_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user_id ON public.user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_created_at ON public.user_activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_system_performance_metrics_timestamp ON public.system_performance_metrics(timestamp);

-- Create a function to log user activity
CREATE OR REPLACE FUNCTION public.log_user_activity(
  p_user_id UUID,
  p_activity_type TEXT,
  p_page_path TEXT DEFAULT NULL,
  p_session_duration_seconds INTEGER DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.user_activity_logs (
    user_id, activity_type, page_path, session_duration_seconds, metadata
  ) VALUES (
    p_user_id, p_activity_type, p_page_path, p_session_duration_seconds, p_metadata
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

-- Create a function to get analytics summary
CREATE OR REPLACE FUNCTION public.get_analytics_summary(days_back INTEGER DEFAULT 30)
RETURNS TABLE(
  total_users BIGINT,
  active_users BIGINT,
  total_uploads BIGINT,
  total_analyses BIGINT,
  avg_response_time DECIMAL,
  total_tokens_used BIGINT,
  total_cost DECIMAL,
  success_rate DECIMAL
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(DISTINCT id) FROM public.profiles) as total_users,
    (SELECT COUNT(DISTINCT user_id) FROM public.user_activity_logs 
     WHERE created_at >= NOW() - INTERVAL '1 day' * days_back) as active_users,
    (SELECT COUNT(*) FROM public.design_uploads 
     WHERE created_at >= NOW() - INTERVAL '1 day' * days_back) as total_uploads,
    (SELECT COUNT(*) FROM public.claude_usage_logs 
     WHERE created_at >= NOW() - INTERVAL '1 day' * days_back) as total_analyses,
    (SELECT COALESCE(AVG(response_time_ms), 0) FROM public.claude_usage_logs 
     WHERE created_at >= NOW() - INTERVAL '1 day' * days_back AND success = true) as avg_response_time,
    (SELECT COALESCE(SUM(tokens_used), 0) FROM public.claude_usage_logs 
     WHERE created_at >= NOW() - INTERVAL '1 day' * days_back) as total_tokens_used,
    (SELECT COALESCE(SUM(cost_usd), 0) FROM public.claude_usage_logs 
     WHERE created_at >= NOW() - INTERVAL '1 day' * days_back) as total_cost,
    (SELECT CASE WHEN COUNT(*) > 0 
            THEN (COUNT(*) FILTER (WHERE success = true) * 100.0 / COUNT(*))
            ELSE 0 END 
     FROM public.claude_usage_logs 
     WHERE created_at >= NOW() - INTERVAL '1 day' * days_back) as success_rate;
END;
$$;
