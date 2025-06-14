
-- Phase 1: Backfill missing impact summaries for existing analyses
-- This will create basic impact summaries for analyses that don't have them

-- Function to generate a basic impact summary structure
CREATE OR REPLACE FUNCTION generate_basic_impact_summary(
  analysis_text TEXT,
  analysis_type TEXT DEFAULT 'individual'
)
RETURNS JSONB AS $$
DECLARE
  basic_summary JSONB;
  overall_score INTEGER;
BEGIN
  -- Generate a basic score based on text length and keywords
  overall_score := CASE 
    WHEN LENGTH(analysis_text) > 2000 THEN 8
    WHEN LENGTH(analysis_text) > 1000 THEN 7
    WHEN LENGTH(analysis_text) > 500 THEN 6
    ELSE 5
  END;
  
  -- Add bonus points for positive keywords
  IF analysis_text ILIKE '%excellent%' OR analysis_text ILIKE '%outstanding%' OR analysis_text ILIKE '%great%' THEN
    overall_score := LEAST(overall_score + 1, 10);
  END IF;
  
  -- Create basic impact summary structure
  basic_summary := jsonb_build_object(
    'business_impact', jsonb_build_object(
      'conversion_potential', overall_score - 1,
      'user_engagement_score', overall_score,
      'brand_alignment', overall_score - 1,
      'competitive_advantage', ARRAY['Professional design approach', 'User-focused layout']
    ),
    'user_experience', jsonb_build_object(
      'usability_score', overall_score,
      'accessibility_rating', overall_score - 2,
      'pain_points', ARRAY['Minor usability concerns identified'],
      'positive_aspects', ARRAY['Clean design', 'Good visual hierarchy']
    ),
    'recommendations', jsonb_build_array(
      jsonb_build_object(
        'priority', 'medium',
        'category', 'UI Enhancement',
        'description', 'Continue with current design direction',
        'expected_impact', 'Improved user satisfaction'
      )
    ),
    'key_metrics', jsonb_build_object(
      'overall_score', overall_score,
      'improvement_areas', ARRAY['Accessibility', 'Mobile optimization'],
      'strengths', ARRAY['Visual appeal', 'Layout structure']
    )
  );
  
  RETURN basic_summary;
END;
$$ LANGUAGE plpgsql;

-- Backfill individual analyses without impact summaries
UPDATE design_analysis 
SET impact_summary = generate_basic_impact_summary(
  COALESCE(analysis_results::text, ''), 
  'individual'
)
WHERE impact_summary IS NULL 
  AND analysis_results IS NOT NULL;

-- Backfill batch analyses without impact summaries  
UPDATE design_batch_analysis
SET impact_summary = generate_basic_impact_summary(
  COALESCE(analysis_results::text, ''), 
  'batch_comparative'
)
WHERE impact_summary IS NULL
  AND analysis_results IS NOT NULL;

-- Clean up the temporary function
DROP FUNCTION generate_basic_impact_summary(TEXT, TEXT);
