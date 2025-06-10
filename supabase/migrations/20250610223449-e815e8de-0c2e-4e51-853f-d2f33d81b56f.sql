
-- Create design_uploads table to store uploaded design files
CREATE TABLE public.design_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  use_case TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create design_analysis table to store Claude AI analysis results
CREATE TABLE public.design_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  design_upload_id UUID NOT NULL REFERENCES public.design_uploads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL,
  prompt_used TEXT NOT NULL,
  analysis_results JSONB NOT NULL,
  confidence_score NUMERIC DEFAULT 0.8,
  suggestions JSONB,
  improvement_areas TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create design_use_cases table to store predefined analysis templates
CREATE TABLE public.design_use_cases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  prompt_template TEXT NOT NULL,
  analysis_focus TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for design_uploads
ALTER TABLE public.design_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own design uploads" 
  ON public.design_uploads 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own design uploads" 
  ON public.design_uploads 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own design uploads" 
  ON public.design_uploads 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own design uploads" 
  ON public.design_uploads 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add RLS policies for design_analysis
ALTER TABLE public.design_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own design analysis" 
  ON public.design_analysis 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own design analysis" 
  ON public.design_analysis 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Add RLS policies for design_use_cases (public read, owner only write)
ALTER TABLE public.design_use_cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view design use cases" 
  ON public.design_use_cases 
  FOR SELECT 
  TO PUBLIC 
  USING (true);

CREATE POLICY "Only owners can manage design use cases" 
  ON public.design_use_cases 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'owner'));

-- Create storage bucket for design files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('design-uploads', 'design-uploads', false);

-- Create storage policies for design uploads bucket
CREATE POLICY "Users can upload their own designs" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'design-uploads' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own designs" 
  ON storage.objects 
  FOR SELECT 
  USING (
    bucket_id = 'design-uploads' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own designs" 
  ON storage.objects 
  FOR DELETE 
  USING (
    bucket_id = 'design-uploads' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Insert default design use cases
INSERT INTO public.design_use_cases (name, description, prompt_template, analysis_focus) VALUES
(
  'Landing Page Analysis',
  'Comprehensive analysis of landing page design for conversion optimization',
  'Analyze this landing page design for conversion optimization. Focus on: visual hierarchy, call-to-action placement, user flow, trust elements, and mobile responsiveness. Provide specific recommendations for improving conversion rates.',
  ARRAY['conversion_optimization', 'visual_hierarchy', 'cta_placement', 'mobile_responsive', 'trust_elements']
),
(
  'Mobile App UX Review',
  'User experience evaluation for mobile application interfaces',
  'Evaluate this mobile app interface design. Analyze: navigation patterns, touch target sizes, information architecture, visual consistency, and user flow efficiency. Suggest improvements for better user experience.',
  ARRAY['navigation', 'touch_targets', 'information_architecture', 'visual_consistency', 'user_flow']
),
(
  'E-commerce Product Page',
  'Analysis focused on product page design and sales conversion',
  'Review this e-commerce product page design. Examine: product presentation, checkout flow, trust signals, pricing display, and customer review integration. Recommend changes to increase sales conversion.',
  ARRAY['product_presentation', 'checkout_flow', 'trust_signals', 'pricing_display', 'social_proof']
),
(
  'Dashboard & Analytics UI',
  'Evaluation of data visualization and dashboard usability',
  'Analyze this dashboard/analytics interface. Focus on: data visualization clarity, information hierarchy, user workflow efficiency, and cognitive load. Suggest improvements for better data comprehension.',
  ARRAY['data_visualization', 'information_hierarchy', 'workflow_efficiency', 'cognitive_load']
),
(
  'Form Design Optimization',
  'Assessment of form usability and completion rates',
  'Evaluate this form design for usability and completion rates. Analyze: field organization, validation feedback, progress indicators, and error handling. Provide recommendations to reduce form abandonment.',
  ARRAY['field_organization', 'validation_feedback', 'progress_indicators', 'error_handling']
);
