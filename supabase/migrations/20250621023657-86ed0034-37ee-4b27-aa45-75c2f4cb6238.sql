
-- Remove columns added to design_batch_analysis
ALTER TABLE public.design_batch_analysis 
DROP COLUMN IF EXISTS parent_analysis_id,
DROP COLUMN IF EXISTS modification_summary,
DROP COLUMN IF EXISTS version_number,
DROP COLUMN IF EXISTS impact_summary;

-- Remove foreign key constraint
ALTER TABLE public.design_batch_analysis 
DROP CONSTRAINT IF EXISTS fk_parent_analysis_id;

-- Remove index
DROP INDEX IF EXISTS idx_design_batch_analysis_parent_id;
