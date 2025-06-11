
-- Add the missing model_used column to claude_usage_logs table
ALTER TABLE public.claude_usage_logs 
ADD COLUMN model_used TEXT;

-- Add response_time_ms column if it doesn't exist (for compatibility)
ALTER TABLE public.claude_usage_logs 
ADD COLUMN IF NOT EXISTS response_time_ms INTEGER;
