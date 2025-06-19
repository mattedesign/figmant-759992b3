
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { logStep } from "./logging.ts";

export const findUserByEmailOrId = async (
  supabase: any,
  userId?: string,
  customerEmail?: string
): Promise<string | null> => {
  let targetUserId = userId;

  // If no userId in metadata, try to find user by email
  if (!targetUserId && customerEmail) {
    logStep("Looking up user by email", { email: customerEmail });
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', customerEmail)
      .single();

    if (profile && !profileError) {
      targetUserId = profile.id;
      logStep("Found user by email", { userId: targetUserId });
    } else {
      logStep("User not found by email", { email: customerEmail, error: profileError });
    }
  }

  if (!targetUserId) {
    logStep("ERROR: No user ID found - cannot credit account", { 
      userId, 
      customerEmail 
    });
    return null;
  }

  return targetUserId;
};
