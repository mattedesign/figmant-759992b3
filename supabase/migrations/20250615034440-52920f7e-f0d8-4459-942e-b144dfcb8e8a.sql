
-- Update the check constraint for claude_prompt_examples to include 'premium' category
ALTER TABLE public.claude_prompt_examples 
DROP CONSTRAINT claude_prompt_examples_category_check;

ALTER TABLE public.claude_prompt_examples 
ADD CONSTRAINT claude_prompt_examples_category_check 
CHECK (category IN ('master', 'competitor', 'visual_hierarchy', 'copy_messaging', 'ecommerce_revenue', 'ab_testing', 'premium', 'general'));
