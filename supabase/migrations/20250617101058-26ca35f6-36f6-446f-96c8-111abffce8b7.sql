
-- Add the collapsed_logo_url column to the logo_configuration table
ALTER TABLE public.logo_configuration 
ADD COLUMN collapsed_logo_url text;
