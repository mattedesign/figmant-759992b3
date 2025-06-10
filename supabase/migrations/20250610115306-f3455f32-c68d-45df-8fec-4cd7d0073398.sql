
-- Create the missing profile for the existing user with owner role
INSERT INTO public.profiles (id, email, full_name, role)
VALUES (
  '66a05fc7-8808-473d-88ce-4a1850c2457c'::uuid,
  'sparkingmatt@gmail.com',
  'Matthew Brown',
  'owner'::user_role
);

-- Create the corresponding subscription record
INSERT INTO public.subscriptions (user_id, status)
VALUES (
  '66a05fc7-8808-473d-88ce-4a1850c2457c'::uuid,
  'active'::subscription_status
);
