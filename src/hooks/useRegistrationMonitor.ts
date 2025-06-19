
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRegistrationMonitor = () => {
  const { user, profile, isOwner } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isOwner) return;

    const monitorRegistrations = async () => {
      try {
        // Check for users without profiles (registered in last 24 hours)
        const { data: usersWithoutProfiles, error } = await supabase
          .rpc('find_users_without_profiles');

        if (error) {
          console.error('Error checking for users without profiles:', error);
          return;
        }

        if (usersWithoutProfiles && usersWithoutProfiles.length > 0) {
          console.warn(`Found ${usersWithoutProfiles.length} users without profiles:`, usersWithoutProfiles);
          
          toast({
            title: "Registration Issue Detected",
            description: `${usersWithoutProfiles.length} users found without complete profiles. Check admin panel for details.`,
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
