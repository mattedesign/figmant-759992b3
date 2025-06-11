
import { supabase } from '@/integrations/supabase/client';

export const useAuthenticationValidator = () => {
  const validateUserAuthentication = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      throw new Error(`Authentication error: ${error.message}`);
    }
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    return user;
  };

  return {
    validateUserAuthentication
  };
};
