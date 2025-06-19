
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

        // Check if user exists in auth.users (requires service role, will fail with regular user)
        let authUserExists = null;
        let authUsersError = null;
        try {
          const { data: authUsersData, error: authError } = await supabase.auth.admin.listUsers();
          if (!authError && authUsersData?.users) {
            authUserExists = authUsersData.users.find(user => user.email === email) || null;
            console.log(`🔍 Auth user check for ${email}:`, authUserExists ? 'Found' : 'Not found');
          } else {
            authUsersError = authError?.message || 'Cannot access auth.users - requires admin privileges';
          }
        } catch (authErr: any) {
          authUsersError = 'Cannot access auth.users - requires admin privileges';
          console.log(`🔍 Auth users access denied for ${email}`);
        }

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
          authUserExists: authUserExists,
          authUsersError: authUsersError,
          errors: {
            profileError,
            profileErrorCI,
            allProfilesError,
            similarError
          }
        };

      } catch (globalError: any) {
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

export const useFixMissingProfile = () => {
  return {
    fixMissingProfile: async (email: string) => {
      try {
        console.log(`🔧 Attempting to fix missing profile for ${email}`);
        
        // Call the existing function to create a manual user
        const { data, error } = await supabase.rpc('create_user_manual', {
          p_email: email,
          p_full_name: email.split('@')[0], // Use email prefix as name
          p_role: 'subscriber'
        });

        if (error) {
          console.error('Error creating manual user:', error);
          throw error;
        }

        console.log('✅ Manual user created:', data);
        return { success: true, data };
      } catch (error: any) {
        console.error('❌ Failed to fix missing profile:', error);
        return { success: false, error: error.message };
      }
    }
  };
};
