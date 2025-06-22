
-- Add missing fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"email_notifications": true, "push_notifications": false, "marketing_emails": false}'::jsonb,
ADD COLUMN IF NOT EXISTS billing_address JSONB DEFAULT '{"street": "", "city": "", "state": "", "zip": "", "country": "United States"}'::jsonb;

-- Update existing profiles to have default notification preferences
UPDATE public.profiles 
SET notification_preferences = '{"email_notifications": true, "push_notifications": false, "marketing_emails": false}'::jsonb
WHERE notification_preferences IS NULL;

-- Update existing profiles to have default billing address
UPDATE public.profiles 
SET billing_address = '{"street": "", "city": "", "state": "", "zip": "", "country": "United States"}'::jsonb
WHERE billing_address IS NULL;
