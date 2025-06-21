
-- STEP 1: Remove real-time subscriptions (most recent changes)
ALTER PUBLICATION supabase_realtime DROP TABLE design_analysis;
ALTER PUBLICATION supabase_realtime DROP TABLE design_batch_analysis;
ALTER PUBLICATION supabase_realtime DROP TABLE design_uploads;

-- Remove REPLICA IDENTITY settings
ALTER TABLE design_analysis REPLICA IDENTITY DEFAULT;
ALTER TABLE design_batch_analysis REPLICA IDENTITY DEFAULT;
ALTER TABLE design_uploads REPLICA IDENTITY DEFAULT;

-- STEP 2: Remove columns added to design_batch_analysis
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

-- STEP 3: Remove columns added to design_uploads
ALTER TABLE public.design_uploads 
DROP COLUMN IF EXISTS original_batch_id,
DROP COLUMN IF EXISTS is_replacement,
DROP COLUMN IF EXISTS replaced_upload_id,
DROP COLUMN IF EXISTS analysis_goals;

-- Remove foreign key constraint
ALTER TABLE public.design_uploads 
DROP CONSTRAINT IF EXISTS fk_replaced_upload_id;

-- Remove index
DROP INDEX IF EXISTS idx_design_uploads_original_batch_id;

-- STEP 4: Verify final table structures
-- design_uploads columns: id, user_id, file_name, file_path, file_size, file_type, use_case, status, source_type, source_url, batch_id, batch_name, analysis_preferences, created_at, updated_at
-- design_batch_analysis columns: id, batch_id, user_id, analysis_type, prompt_used, analysis_results, winner_upload_id, key_metrics, recommendations, confidence_score, context_summary, analysis_settings, created_at
