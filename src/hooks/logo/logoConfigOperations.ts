
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { testImageLoad } from './logoTestUtils';
import { DEFAULT_FALLBACK_LOGO, type LogoConfig } from './types';

export const useLogoConfigOperations = () => {
  const { toast } = useToast();

  const loadLogoConfig = async (userId: string): Promise<LogoConfig> => {
    try {
      console.log('logoConfigOperations: Loading logo configuration from database for user:', userId);
      
      const { data, error } = await supabase
        .from('logo_configuration')
        .select('active_logo_url, fallback_logo_url')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('logoConfigOperations: Error loading logo config:', error);
        return {
          activeLogoUrl: DEFAULT_FALLBACK_LOGO,
          fallbackLogoUrl: DEFAULT_FALLBACK_LOGO
        };
      }

      if (data) {
        console.log('logoConfigOperations: Loaded logo config from database:', data);
        const config = {
          activeLogoUrl: data.active_logo_url || DEFAULT_FALLBACK_LOGO,
          fallbackLogoUrl: data.fallback_logo_url || DEFAULT_FALLBACK_LOGO
        };
        console.log('logoConfigOperations: Final processed config:', config);
        return config;
      } else {
        console.log('logoConfigOperations: No logo configuration found, using defaults');
        return {
          activeLogoUrl: DEFAULT_FALLBACK_LOGO,
          fallbackLogoUrl: DEFAULT_FALLBACK_LOGO
        };
      }
    } catch (error) {
      console.error('logoConfigOperations: Failed to load logo configuration:', error);
      return {
        activeLogoUrl: DEFAULT_FALLBACK_LOGO,
        fallbackLogoUrl: DEFAULT_FALLBACK_LOGO
      };
    }
  };

  const updateActiveLogo = async (userId: string, newLogoUrl: string): Promise<boolean> => {
    console.log('logoConfigOperations: Attempting to update active logo to:', newLogoUrl, 'for user:', userId);
    
    // Test if the new logo URL is accessible
    const isAccessible = await testImageLoad(newLogoUrl);
    
    if (!isAccessible) {
      console.error('logoConfigOperations: New logo URL is not accessible:', newLogoUrl);
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
        console.error('logoConfigOperations: Error updating logo configuration in database:', error);
        toast({
          variant: "destructive",
          title: "Logo Update Failed",
          description: "Failed to save logo configuration. Please try again.",
        });
        return false;
      }

      console.log('logoConfigOperations: Successfully updated logo in database');
      
      // Also update the public logo configuration for global use
      const { error: publicError } = await supabase
        .from('admin_settings')
        .upsert({
          setting_key: 'logo_url',
          setting_value: newLogoUrl,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'setting_key'
        });

      if (publicError) {
        console.error('logoConfigOperations: Error updating public logo configuration:', publicError);
      } else {
        console.log('logoConfigOperations: Successfully updated public logo configuration');
      }

      toast({
        title: "Logo Updated",
        description: "The active logo has been updated successfully.",
      });
      
      console.log('logoConfigOperations: Active logo updated successfully to:', newLogoUrl);
      return true;
    } catch (error) {
      console.error('logoConfigOperations: Failed to update logo configuration:', error);
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
      console.log('logoConfigOperations: Resetting logo to default for user:', userId);
      
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
        console.error('logoConfigOperations: Error resetting logo configuration:', error);
        return false;
      }

      // Also reset the public logo configuration
      const { error: publicError } = await supabase
        .from('admin_settings')
        .upsert({
          setting_key: 'logo_url',
          setting_value: DEFAULT_FALLBACK_LOGO,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'setting_key'
        });

      if (publicError) {
        console.error('logoConfigOperations: Error resetting public logo configuration:', publicError);
      }

      toast({
        title: "Logo Reset",
        description: "Logo has been reset to default.",
      });

      console.log('logoConfigOperations: Successfully reset logo to default');
      return true;
    } catch (error) {
      console.error('logoConfigOperations: Failed to reset logo configuration:', error);
      return false;
    }
  };

  return {
    loadLogoConfig,
    updateActiveLogo,
    resetToDefault
  };
};
