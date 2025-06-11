
-- Create a table to store Claude prompt examples for analysis and improvement
CREATE TABLE public.claude_prompt_examples (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('master', 'competitor', 'visual_hierarchy', 'copy_messaging', 'ecommerce_revenue', 'ab_testing', 'general')),
  original_prompt TEXT NOT NULL,
  claude_response TEXT NOT NULL,
  effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
  use_case_context TEXT,
  business_domain TEXT,
  prompt_variables JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  is_template BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for A/B testing different prompt variations
CREATE TABLE public.claude_prompt_variations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  base_example_id UUID REFERENCES public.claude_prompt_examples(id) ON DELETE CASCADE,
  variation_name TEXT NOT NULL,
  modified_prompt TEXT NOT NULL,
  test_status TEXT DEFAULT 'draft' CHECK (test_status IN ('draft', 'active', 'completed', 'paused')),
  success_metrics JSONB DEFAULT '{}',
  performance_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table to track prompt usage and effectiveness
CREATE TABLE public.claude_prompt_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  example_id UUID REFERENCES public.claude_prompt_examples(id) ON DELETE CASCADE,
  variation_id UUID REFERENCES public.claude_prompt_variations(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.profiles(id),
  usage_context TEXT NOT NULL,
  response_quality_score INTEGER CHECK (response_quality_score >= 1 AND response_quality_score <= 5),
  response_time_ms INTEGER,
  tokens_used INTEGER,
  user_feedback TEXT,
  business_outcome_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for prompt examples
ALTER TABLE public.claude_prompt_examples ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view active prompt examples" 
  ON public.claude_prompt_examples 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Owners can manage prompt examples" 
  ON public.claude_prompt_examples 
  FOR ALL
  USING (public.has_role(auth.uid(), 'owner'));

-- Add RLS policies for prompt variations
ALTER TABLE public.claude_prompt_variations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view prompt variations" 
  ON public.claude_prompt_variations 
  FOR SELECT 
  USING (true);

CREATE POLICY "Owners can manage prompt variations" 
  ON public.claude_prompt_variations 
  FOR ALL
  USING (public.has_role(auth.uid(), 'owner'));

-- Add RLS policies for prompt analytics
ALTER TABLE public.claude_prompt_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own analytics" 
  ON public.claude_prompt_analytics 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own analytics" 
  ON public.claude_prompt_analytics 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Owners can view all analytics" 
  ON public.claude_prompt_analytics 
  FOR SELECT
  USING (public.has_role(auth.uid(), 'owner'));

-- Create indexes for better performance
CREATE INDEX idx_claude_prompt_examples_category ON public.claude_prompt_examples(category);
CREATE INDEX idx_claude_prompt_examples_active ON public.claude_prompt_examples(is_active);
CREATE INDEX idx_claude_prompt_variations_status ON public.claude_prompt_variations(test_status);
CREATE INDEX idx_claude_prompt_analytics_user ON public.claude_prompt_analytics(user_id);
CREATE INDEX idx_claude_prompt_analytics_created ON public.claude_prompt_analytics(created_at);

-- Create a function to get the best performing prompt for a category
CREATE OR REPLACE FUNCTION public.get_best_prompt_for_category(category_name text)
RETURNS TABLE(
  example_id uuid,
  title text,
  original_prompt text,
  avg_quality_score numeric,
  usage_count bigint
) 
LANGUAGE sql
STABLE
AS $$
  SELECT 
    pe.id as example_id,
    pe.title,
    pe.original_prompt,
    COALESCE(AVG(pa.response_quality_score), 0) as avg_quality_score,
    COUNT(pa.id) as usage_count
  FROM public.claude_prompt_examples pe
  LEFT JOIN public.claude_prompt_analytics pa ON pe.id = pa.example_id
  WHERE pe.category = category_name 
    AND pe.is_active = true
  GROUP BY pe.id, pe.title, pe.original_prompt
  ORDER BY avg_quality_score DESC, usage_count DESC
  LIMIT 1;
$$;
