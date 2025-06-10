
-- Add owner-specific tables for business management

-- Create admin_settings table for system-wide configuration
CREATE TABLE public.admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB,
  description TEXT,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_management_logs table for tracking user actions
CREATE TABLE public.user_management_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES auth.users(id) NOT NULL,
  target_user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create subscription_analytics table for business insights
CREATE TABLE public.subscription_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  total_subscribers INTEGER DEFAULT 0,
  new_subscriptions INTEGER DEFAULT 0,
  cancelled_subscriptions INTEGER DEFAULT 0,
  revenue_usd INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(date)
);

-- Enable RLS on new tables
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_management_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_settings (only owners can access)
CREATE POLICY "owners_can_manage_admin_settings" ON public.admin_settings
  FOR ALL
  USING (public.has_role(auth.uid(), 'owner'));

-- Create policies for user_management_logs (only owners can access)
CREATE POLICY "owners_can_view_user_logs" ON public.user_management_logs
  FOR SELECT
  USING (public.has_role(auth.uid(), 'owner'));

CREATE POLICY "owners_can_insert_user_logs" ON public.user_management_logs
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'owner') AND admin_user_id = auth.uid());

-- Create policies for subscription_analytics (only owners can access)
CREATE POLICY "owners_can_manage_analytics" ON public.subscription_analytics
  FOR ALL
  USING (public.has_role(auth.uid(), 'owner'));

-- Insert some default admin settings
INSERT INTO public.admin_settings (setting_key, setting_value, description) VALUES
  ('stripe_webhook_enabled', 'true', 'Enable Stripe webhook processing'),
  ('max_subscribers_limit', '1000', 'Maximum number of subscribers allowed'),
  ('claude_ai_enabled', 'true', 'Enable Claude AI integration features');
