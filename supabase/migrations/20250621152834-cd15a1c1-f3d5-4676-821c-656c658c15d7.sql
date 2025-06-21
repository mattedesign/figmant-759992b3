
-- Add missing profile fields to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN bio TEXT,
ADD COLUMN website TEXT,
ADD COLUMN phone_number TEXT,
ADD COLUMN state TEXT,
ADD COLUMN postal_code TEXT,
ADD COLUMN emergency_contact_name TEXT,
ADD COLUMN emergency_contact_phone TEXT;
