
CREATE OR REPLACE FUNCTION public.get_user_journey_analytics(days_back INTEGER DEFAULT 30)
RETURNS TABLE(
  step_name TEXT,
  user_count BIGINT
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  time_filter TIMESTAMP WITH TIME ZONE;
BEGIN
  time_filter := NOW() - (days_back * INTERVAL '1 day');

  RETURN QUERY
  SELECT v.step, v.users FROM (
    VALUES
      ('Landing', (SELECT COUNT(DISTINCT user_id) FROM user_activity_logs WHERE created_at >= time_filter AND user_id IS NOT NULL), 1),
      ('Dashboard', (SELECT COUNT(DISTINCT user_id) FROM user_activity_logs WHERE page_path = '/dashboard' AND created_at >= time_filter AND user_id IS NOT NULL), 2),
      ('Upload', (SELECT COUNT(DISTINCT user_id) FROM design_uploads WHERE created_at >= time_filter AND user_id IS NOT NULL), 3),
      ('Analysis', (SELECT COUNT(DISTINCT user_id) FROM claude_usage_logs WHERE created_at >= time_filter AND user_id IS NOT NULL), 4),
      ('View Result', (SELECT COUNT(DISTINCT user_id) FROM user_activity_logs WHERE (page_path LIKE '/design/analysis/%' OR page_path LIKE '/design/batch/%') AND created_at >= time_filter AND user_id IS NOT NULL), 5),
      ('Purchase', (SELECT COUNT(DISTINCT user_id) FROM credit_transactions WHERE transaction_type = 'purchase' AND created_at >= time_filter AND user_id IS NOT NULL), 6)
  ) as v(step, users, "order")
  ORDER BY v."order";
END;
$$;
