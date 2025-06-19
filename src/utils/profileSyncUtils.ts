
import { supabase } from '@/integrations/supabase/client';

export const syncAllAuthUsers = async () => {
  try {
    console.log('Starting manual sync of all auth users...');
    
    // Get all users from auth (this requires admin privileges)
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error fetching auth users:', authError);
      throw authError;
    }

    // Get all existing profiles with proper typing
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .returns<Array<{ id: string }>>();
    
    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      throw profilesError;
    }

    // Create set of existing profile IDs
    const existingProfileIds = new Set<string>();
    if (profilesData && Array.isArray(profilesData)) {
      profilesData.forEach(profile => {
        existingProfileIds.add(profile.id);
      });
    }
    
    const usersNeedingProfiles = authUsers.users.filter(user => !existingProfileIds.has(user.id));

    console.log(`Found ${usersNeedingProfiles.length} users needing profile sync`);

    // Create profiles for users that don't have them
    for (const authUser of usersNeedingProfiles) {
      try {
        console.log(`Creating profile for user: ${authUser.email}`);
        
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authUser.id,
            email: authUser.email || '',
            full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || '',
            role: 'subscriber'
          });

        if (profileError) {
          console.error(`Error creating profile for ${authUser.email}:`, profileError);
          continue;
        }

        // Create subscription
        const { error: subscriptionError } = await supabase
          .from('subscriptions')
          .insert({
            user_id: authUser.id,
            status: 'inactive'
          });

        if (subscriptionError) {
          console.error(`Error creating subscription for ${authUser.email}:`, subscriptionError);
        }

        // Create user credits
        const { error: creditsError } = await supabase
          .from('user_credits')
          .insert({
            user_id: authUser.id,
            current_balance: 5,
            total_purchased: 5,
            total_used: 0
          });

        if (creditsError) {
          console.error(`Error creating credits for ${authUser.email}:`, creditsError);
        } else {
          // Create welcome transaction
          const { error: transactionError } = await supabase
            .from('credit_transactions')
            .insert({
              user_id: authUser.id,
              transaction_type: 'purchase',
              amount: 5,
              description: 'Welcome bonus - 5 free credits (manual sync)',
              created_by: authUser.id
            });

          if (transactionError) {
            console.error(`Error creating transaction for ${authUser.email}:`, transactionError);
          }
        }

        // Create onboarding record
        const { error: onboardingError } = await supabase
          .from('user_onboarding')
          .insert({
            user_id: authUser.id
          });

        if (onboardingError) {
          console.error(`Error creating onboarding for ${authUser.email}:`, onboardingError);
        }

        console.log(`Successfully synced profile for: ${authUser.email}`);
      } catch (error) {
        console.error(`Failed to sync user ${authUser.email}:`, error);
      }
    }

    return {
      success: true,
      syncedUsers: usersNeedingProfiles.length,
      message: `Successfully synced ${usersNeedingProfiles.length} users`
    };
  } catch (error) {
    console.error('Error in syncAllAuthUsers:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to sync users'
    };
  }
};
