
import { logStep } from "./logging.ts";

export const findUserByEmailOrId = async (
  supabase: any,
  userId?: string,
  userEmail?: string
): Promise<string | null> => {
  let targetUserId = userId;

  // If no userId provided, try to find user by email
  if (!targetUserId && userEmail) {
    logStep("Looking up user by email", { email: userEmail });
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', userEmail)
      .single();

    if (profile && !profileError) {
      targetUserId = profile.id;
      logStep("Found user by email", { userId: targetUserId });
    } else {
      logStep("User not found by email", { email: userEmail, error: profileError });
    }
  }

  if (!targetUserId) {
    logStep("ERROR: No user ID found - cannot credit account", { 
      userId, 
      userEmail 
    });
    return null;
  }

  return targetUserId;
};
