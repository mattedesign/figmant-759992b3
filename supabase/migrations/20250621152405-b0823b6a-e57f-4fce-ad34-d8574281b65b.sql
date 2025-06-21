
-- Add address fields to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN address TEXT,
ADD COLUMN city TEXT, 
ADD COLUMN country TEXT;
