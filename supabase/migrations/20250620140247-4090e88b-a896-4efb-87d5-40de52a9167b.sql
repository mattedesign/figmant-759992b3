
-- Add credit_cost column to claude_prompt_examples table
ALTER TABLE public.claude_prompt_examples 
ADD COLUMN credit_cost integer NOT NULL DEFAULT 3;

-- Add a check constraint to ensure credit cost is reasonable
ALTER TABLE public.claude_prompt_examples 
ADD CONSTRAINT credit_cost_positive CHECK (credit_cost > 0 AND credit_cost <= 100);
