
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useSpecificUserDebug = (email: string) => {
  return useQuery({
    queryKey: ['user-debug', email],
    queryFn: async () => {
      console.log(`🔍 Searching for specific user: ${email}`);
      
      try {
        // Search for the user in profiles table
        const { data: profileSearch, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', email)
          .limit(1);

        console.log(`🔍 Profile search for ${email}:`, { profileSearch, profileError });

        // Search with case-insensitive email
        const { data: profileSearchCI, error: profileErrorCI } = await supabase
          .from('profiles')
          .select('*')
          .ilike('email', email)
          .limit(1);

        console.log(`🔍 Case-insensitive profile search for ${email}:`, { profileSearchCI, profileErrorCI });

        // Get all profiles to see what emails exist
        const { data: allProfiles, error: allProfilesError } = await supabase
          .from('profiles')
          .select('id, email, full_name, created_at')
          .order('created_at', { ascending: false })
          .limit(20);

        console.log(`🔍 All recent profiles:`, allProfiles?.map(p => ({ email: p.email, created_at: p.created_at })));

        // Search for similar emails
        const emailPart = email.split('@')[0];
        const { data: similarEmails, error: similarError } = await supabase
          .from('profiles')
          .select('id, email, full_name, created_at')
          .ilike('email', `%${emailPart}%`)
          .limit(10);

        console.log(`🔍 Similar emails to ${email}:`, similarEmails?.map(p => p.email));

        return {
          searchEmail: email,
          exactMatch: profileSearch,
          caseInsensitiveMatch: profileSearchCI,
          recentProfiles: allProfiles,
          similarEmails: similarEmails,
          errors: {
            profileError,
            profileErrorCI,
            allProfilesError,
            similarError
          }
        };

      } catch (globalError) {
        console.error('🔍 Global error in user debug:', globalError);
        return {
          searchEmail: email,
          error: globalError.message,
          debugInfo: { globalError }
        };
      }
    },
    enabled: Boolean(email),
    refetchInterval: false,
    retry: 1,
    staleTime: 0,
    gcTime: 0
  });
};
