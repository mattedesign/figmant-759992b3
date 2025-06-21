
-- First, let's ensure the design_analysis table has all required columns
DO $$ 
BEGIN
    -- Add missing columns to design_analysis if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'design_analysis' AND column_name = 'impact_summary') THEN
        ALTER TABLE public.design_analysis ADD COLUMN impact_summary jsonb;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'design_analysis' AND column_name = 'suggestions') THEN
        ALTER TABLE public.design_analysis ADD COLUMN suggestions jsonb;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'design_analysis' AND column_name = 'improvement_areas') THEN
        ALTER TABLE public.design_analysis ADD COLUMN improvement_areas text[];
    END IF;
END $$;

-- Ensure design_batch_analysis table exists with proper structure
CREATE TABLE IF NOT EXISTS public.design_batch_analysis (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    batch_id uuid NOT NULL,
    user_id uuid NOT NULL,
    analysis_type text NOT NULL DEFAULT 'batch_comparative',
    prompt_used text NOT NULL,
    analysis_results jsonb NOT NULL,
    winner_upload_id uuid,
    key_metrics jsonb,
    recommendations jsonb,
    confidence_score numeric DEFAULT 0.8,
    context_summary text,
    analysis_settings jsonb DEFAULT '{}'::jsonb,
    parent_analysis_id uuid,
    modification_summary text,
    version_number integer DEFAULT 1,
    impact_summary jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add RLS policies for design_batch_analysis if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'design_batch_analysis' AND policyname = 'Users can view their own batch analyses') THEN
        ALTER TABLE public.design_batch_analysis ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Users can view their own batch analyses" 
            ON public.design_batch_analysis 
            FOR SELECT 
            USING (auth.uid() = user_id);
            
        CREATE POLICY "Users can create their own batch analyses" 
            ON public.design_batch_analysis 
            FOR INSERT 
            WITH CHECK (auth.uid() = user_id);
            
        CREATE POLICY "Users can update their own batch analyses" 
            ON public.design_batch_analysis 
            FOR UPDATE 
            USING (auth.uid() = user_id);
            
        CREATE POLICY "Users can delete their own batch analyses" 
            ON public.design_batch_analysis 
            FOR DELETE 
            USING (auth.uid() = user_id);
    END IF;
END $$;

-- Fix any missing indexes for performance
CREATE INDEX IF NOT EXISTS idx_design_analysis_user_id ON public.design_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_design_analysis_design_upload_id ON public.design_analysis(design_upload_id);
CREATE INDEX IF NOT EXISTS idx_design_batch_analysis_user_id ON public.design_batch_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_design_batch_analysis_batch_id ON public.design_batch_analysis(batch_id);

-- Ensure chat_analysis_history has proper structure for wizard analysis
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'chat_analysis_history' AND column_name = 'prompt_template_used') THEN
        ALTER TABLE public.chat_analysis_history ADD COLUMN prompt_template_used text;
    END IF;
END $$;

-- Add RLS policies for chat_analysis_history if missing
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'chat_analysis_history' AND policyname = 'Users can view their own chat history') THEN
        ALTER TABLE public.chat_analysis_history ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Users can view their own chat history" 
            ON public.chat_analysis_history 
            FOR SELECT 
            USING (auth.uid() = user_id);
            
        CREATE POLICY "Users can create their own chat history" 
            ON public.chat_analysis_history 
            FOR INSERT 
            WITH CHECK (auth.uid() = user_id);
            
        CREATE POLICY "Users can update their own chat history" 
            ON public.chat_analysis_history 
            FOR UPDATE 
            USING (auth.uid() = user_id);
            
        CREATE POLICY "Users can delete their own chat history" 
            ON public.chat_analysis_history 
            FOR DELETE 
            USING (auth.uid() = user_id);
    END IF;
END $$;

-- Verify and fix foreign key relationships
DO $$
BEGIN
    -- Add foreign key constraint for design_analysis if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_design_analysis_upload' 
        AND table_name = 'design_analysis'
    ) THEN
        ALTER TABLE public.design_analysis 
        ADD CONSTRAINT fk_design_analysis_upload 
        FOREIGN KEY (design_upload_id) REFERENCES public.design_uploads(id) ON DELETE CASCADE;
    END IF;
    
    -- Add foreign key constraint for batch analysis winner if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_batch_analysis_winner' 
        AND table_name = 'design_batch_analysis'
    ) THEN
        ALTER TABLE public.design_batch_analysis 
        ADD CONSTRAINT fk_batch_analysis_winner 
        FOREIGN KEY (winner_upload_id) REFERENCES public.design_uploads(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Create function to validate analysis data integrity
CREATE OR REPLACE FUNCTION public.validate_analysis_data_integrity()
RETURNS TABLE(
    table_name text,
    issue_type text,
    count bigint,
    details text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
    -- Check for orphaned analysis records
    RETURN QUERY
    SELECT 
        'design_analysis'::text,
        'orphaned_records'::text,
        COUNT(*),
        'Analysis records without corresponding upload'::text
    FROM public.design_analysis da
    LEFT JOIN public.design_uploads du ON da.design_upload_id = du.id
    WHERE du.id IS NULL;
    
    -- Check for analysis records without user profiles
    RETURN QUERY
    SELECT 
        'design_analysis'::text,
        'missing_user_profiles'::text,
        COUNT(*),
        'Analysis records without user profiles'::text
    FROM public.design_analysis da
    LEFT JOIN public.profiles p ON da.user_id = p.id
    WHERE p.id IS NULL;
    
    -- Check for batch analysis without uploads
    RETURN QUERY
    SELECT 
        'design_batch_analysis'::text,
        'invalid_batch_refs'::text,
        COUNT(*),
        'Batch analysis with invalid upload references'::text
    FROM public.design_batch_analysis dba
    WHERE dba.winner_upload_id IS NOT NULL
    AND NOT EXISTS (
        SELECT 1 FROM public.design_uploads du 
        WHERE du.id = dba.winner_upload_id
    );
END;
$function$;
