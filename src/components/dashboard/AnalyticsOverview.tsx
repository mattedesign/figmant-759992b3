
import { EnhancedAnalyticsOverview } from './EnhancedAnalyticsOverview';
import { useActivityTracker } from '@/hooks/useActivityTracker';

export const AnalyticsOverview = () => {
  // Initialize activity tracking for this component
  useActivityTracker();

  return <EnhancedAnalyticsOverview />;
};
