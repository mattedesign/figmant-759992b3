
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface LogoConfig {
  activeLogoUrl: string;
  fallbackLogoUrl: string;
}

const DEFAULT_FALLBACK_LOGO = '/lovable-uploads/aed59d55-5b0a-4b7b-b82d-340e25b8ca40.png';

export const useLogoConfig = () => {
  const [logoConfig, setLogoConfig] = useState<LogoConfig>({
    activeLogoUrl: DEFAULT_FALLBACK_LOGO,
    fallbackLogoUrl: DEFAULT_FALLBACK_LOGO
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadLogoConfig();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const loadLogoConfig = async () => {
    if (!user) return;

    try {
      console.log('Loading logo configuration from database...');
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('logo_configuration')
        .select('active_logo_url, fallback_logo_url')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading logo config:', error);
        return;
      }

      if (data) {
        console.log('Loaded logo config from database:', data);
        setLogoConfig({
          activeLogoUrl: data.active_logo_url || DEFAULT_FALLBACK_LOGO,
          fallbackLogoUrl: data.fallback_logo_url || DEFAULT_FALLBACK_LOGO
        });
      } else {
        console.log('No logo configuration found, using defaults');
        // Reset to defaults and update database
        await resetToDefault();
      }
    } catch (error) {
      console.error('Failed to load logo configuration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testImageLoad = async (url: string): Promise<boolean> => {
    if (!url || url === DEFAULT_FALLBACK_LOGO) {
      return true; // Default fallback is always considered valid
    }

    return new Promise((resolve) => {
      const img = new Image();
      const timeout = setTimeout(() => {
        console.warn('Image load test timeout for:', url);
        resolve(false);
      }, 5000);

      img.onload = () => {
        console.log('Image load test successful for:', url);
        clearTimeout(timeout);
        resolve(true);
      };

      img.onerror = () => {
        console.error('Image load test failed for:', url);
        clearTimeout(timeout);
        resolve(false);
      };

      img.src = url;
    });
  };

  const updateActiveLogo = async (newLogoUrl: string) => {
    if (!user) {
      console.error('User not authenticated');
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "You must be logged in to update the logo.",
      });
      return false;
    }

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
          user_id: user.id,
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

      // Update local state immediately
      const newConfig = {
        activeLogoUrl: newLogoUrl,
        fallbackLogoUrl: DEFAULT_FALLBACK_LOGO
      };
      
      setLogoConfig(newConfig);
      
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

  const resetToDefault = async () => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('logo_configuration')
        .upsert({
          user_id: user.id,
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

      setLogoConfig({
        activeLogoUrl: DEFAULT_FALLBACK_LOGO,
        fallbackLogoUrl: DEFAULT_FALLBACK_LOGO
      });

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
    logoConfig,
    isLoading,
    updateActiveLogo,
    resetToDefault,
    reload: loadLogoConfig
  };
};
