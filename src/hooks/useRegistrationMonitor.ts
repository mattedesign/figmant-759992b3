
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserWithoutProfile {
  id: string;
  email: string;
  created_at: string;
}

export const useRegistrationMonitor = () => {
  const { user, profile, isOwner } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isOwner) return;

    const monitorRegistrations = async () => {
      try {
        // For now, we'll use a different approach since we can't access auth.users directly
        // We'll check for recent profiles without proper initialization
        const { data: recentProfiles, error } = await supabase
          .from('profiles')
          .select('*')
          .is('full_name', null)
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
          .limit(10);

        if (error) {
          console.error('Error checking for incomplete profiles:', error);
          return;
        }

        if (recentProfiles && recentProfiles.length > 0) {
          console.warn(`Found ${recentProfiles.length} profiles with missing data:`, recentProfiles);
          
          toast({
            title: "Registration Issue Detected",
            description: `${recentProfiles.length} profiles found with incomplete data. Check admin panel for details.`,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error in registration monitoring:', error);
      }
    };

    // Run initial check
    monitorRegistrations();

    // Set up periodic monitoring (every 5 minutes)
    const interval = setInterval(monitorRegistrations, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isOwner, toast]);

  return null;
};
