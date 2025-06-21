
-- Add RLS policy to allow users to INSERT their own profiles
CREATE POLICY "Users can insert their own profiles" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);
