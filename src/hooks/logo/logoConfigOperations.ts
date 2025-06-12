
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { testImageLoad } from './logoTestUtils';
import { DEFAULT_FALLBACK_LOGO, type LogoConfig } from './types';

export const useLogoConfigOperations = () => {
  const { toast } = useToast();

  const loadLogoConfig = async (userId: string): Promise<LogoConfig> => {
    try {
      console.log('Loading logo configuration from database...');
      
      const { data, error } = await supabase
        .from('logo_configuration')
        .select('active_logo_url, fallback_logo_url')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading logo config:', error);
        return {
          activeLogoUrl: DEFAULT_FALLBACK_LOGO,
          fallbackLogoUrl: DEFAULT_FALLBACK_LOGO
        };
      }

      if (data) {
        console.log('Loaded logo config from database:', data);
        return {
          activeLogoUrl: data.active_logo_url || DEFAULT_FALLBACK_LOGO,
          fallbackLogoUrl: data.fallback_logo_url || DEFAULT_FALLBACK_LOGO
        };
      } else {
        console.log('No logo configuration found, using defaults');
        return {
          activeLogoUrl: DEFAULT_FALLBACK_LOGO,
          fallbackLogoUrl: DEFAULT_FALLBACK_LOGO
        };
      }
    } catch (error) {
      console.error('Failed to load logo configuration:', error);
      return {
        activeLogoUrl: DEFAULT_FALLBACK_LOGO,
        fallbackLogoUrl: DEFAULT_FALLBACK_LOGO
      };
    }
  };

  const updateActiveLogo = async (userId: string, newLogoUrl: string): Promise<boolean> => {
    console.log('Attempting to update active logo to:', newLogoUrl);
    
    // Test if the new logo URL is accessible
    const isAccessible = await testImageLoad(newLogoUrl);
    
    if (!isAccessible) {
      console.error('New logo URL is not accessible:', newLogoUrl);
      toast({
        variant: "destructive",
        title: "Logo Update Failed",
        description: "The new logo could not be loaded. Please check the file accessibility.",
      });
      return false;
    }

    try {
      // Update in database using upsert
      const { error } = await supabase
        .from('logo_configuration')
        .upsert({
          user_id: userId,
          active_logo_url: newLogoUrl,
          fallback_logo_url: DEFAULT_FALLBACK_LOGO,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error updating logo configuration in database:', error);
        toast({
          variant: "destructive",
          title: "Logo Update Failed",
          description: "Failed to save logo configuration. Please try again.",
        });
        return false;
      }

      toast({
        title: "Logo Updated",
        description: "The active logo has been updated successfully.",
      });
      
      console.log('Active logo updated successfully to:', newLogoUrl);
      return true;
    } catch (error) {
      console.error('Failed to update logo configuration:', error);
      toast({
        variant: "destructive",
        title: "Logo Update Failed",
        description: "An unexpected error occurred. Please try again.",
      });
      return false;
    }
  };

  const resetToDefault = async (userId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('logo_configuration')
        .upsert({
          user_id: userId,
          active_logo_url: DEFAULT_FALLBACK_LOGO,
          fallback_logo_url: DEFAULT_FALLBACK_LOGO,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error resetting logo configuration:', error);
        return false;
      }

      toast({
        title: "Logo Reset",
        description: "Logo has been reset to default.",
      });

      return true;
    } catch (error) {
      console.error('Failed to reset logo configuration:', error);
      return false;
    }
  };

  return {
    loadLogoConfig,
    updateActiveLogo,
    resetToDefault
  };
};
