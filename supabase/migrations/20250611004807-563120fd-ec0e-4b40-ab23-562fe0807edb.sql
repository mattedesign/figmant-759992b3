
-- Add support for URLs and multiple uploads in design_uploads table
ALTER TABLE public.design_uploads 
ADD COLUMN source_type TEXT NOT NULL DEFAULT 'file' CHECK (source_type IN ('file', 'url')),
ADD COLUMN source_url TEXT,
ADD COLUMN batch_id UUID,
ADD COLUMN batch_name TEXT;

-- Create index for batch queries
CREATE INDEX idx_design_uploads_batch_id ON public.design_uploads(batch_id);
CREATE INDEX idx_design_uploads_source_type ON public.design_uploads(source_type);

-- Update the design_uploads table to make file_path nullable for URL uploads
ALTER TABLE public.design_uploads ALTER COLUMN file_path DROP NOT NULL;
ALTER TABLE public.design_uploads ALTER COLUMN file_size DROP NOT NULL;
ALTER TABLE public.design_uploads ALTER COLUMN file_type DROP NOT NULL;

-- Add constraints to ensure data integrity
ALTER TABLE public.design_uploads 
ADD CONSTRAINT check_file_or_url 
CHECK (
  (source_type = 'file' AND file_path IS NOT NULL AND source_url IS NULL) OR
  (source_type = 'url' AND source_url IS NOT NULL AND file_path IS NULL)
);

-- Update design_use_cases to support URL analysis
UPDATE public.design_use_cases 
SET prompt_template = CASE 
  WHEN name = 'Landing Page Analysis' THEN 'Analyze this landing page design for conversion optimization. The design may be provided as an image file or website URL. Focus on: visual hierarchy, call-to-action placement, user flow, trust elements, and mobile responsiveness. Provide specific recommendations for improving conversion rates.'
  WHEN name = 'Mobile App UX Review' THEN 'Evaluate this mobile app interface design. The design may be provided as an image file or website URL. Analyze: navigation patterns, touch target sizes, information architecture, visual consistency, and user flow efficiency. Suggest improvements for better user experience.'
  WHEN name = 'E-commerce Product Page' THEN 'Review this e-commerce product page design. The design may be provided as an image file or website URL. Examine: product presentation, checkout flow, trust signals, pricing display, and customer review integration. Recommend changes to increase sales conversion.'
  WHEN name = 'Dashboard & Analytics UI' THEN 'Analyze this dashboard/analytics interface. The design may be provided as an image file or website URL. Focus on: data visualization clarity, information hierarchy, user workflow efficiency, and cognitive load. Suggest improvements for better data comprehension.'
  WHEN name = 'Form Design Optimization' THEN 'Evaluate this form design for usability and completion rates. The design may be provided as an image file or website URL. Analyze: field organization, validation feedback, progress indicators, and error handling. Provide recommendations to reduce form abandonment.'
  ELSE prompt_template
END;
