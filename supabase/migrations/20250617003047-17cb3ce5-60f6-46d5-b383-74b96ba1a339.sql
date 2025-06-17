
-- Add display_name column to claude_prompt_examples table
ALTER TABLE public.claude_prompt_examples 
ADD COLUMN display_name TEXT;

-- Update existing records to have display names based on their titles
UPDATE public.claude_prompt_examples 
SET display_name = title 
WHERE display_name IS NULL;

-- Make display_name NOT NULL after updating existing records
ALTER TABLE public.claude_prompt_examples 
ALTER COLUMN display_name SET NOT NULL;
