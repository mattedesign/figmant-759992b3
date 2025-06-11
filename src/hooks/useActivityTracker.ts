
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useLogUserActivity } from './useAnalytics';

export const useActivityTracker = () => {
  const location = useLocation();
  const logActivity = useLogUserActivity();
  const sessionStart = useRef<number>(Date.now());
  const lastPath = useRef<string>('');

  useEffect(() => {
    const currentPath = location.pathname;
    
    // Log page view
    logActivity.mutate({
      activity_type: 'page_view',
      page_path: currentPath,
      metadata: {
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        referrer: document.referrer
      }
    });

    // If there was a previous path, log the session duration for that page
    if (lastPath.current && lastPath.current !== currentPath) {
      const sessionDuration = Math.round((Date.now() - sessionStart.current) / 1000);
      logActivity.mutate({
        activity_type: 'page_duration',
        page_path: lastPath.current,
        session_duration_seconds: sessionDuration
      });
    }

    lastPath.current = currentPath;
    sessionStart.current = Date.now();
  }, [location.pathname, logActivity]);

  const logCustomActivity = (activityType: string, metadata?: any) => {
    logActivity.mutate({
      activity_type: activityType,
      page_path: location.pathname,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString()
      }
    });
  };

  return { logCustomActivity };
};
