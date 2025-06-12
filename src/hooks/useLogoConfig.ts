
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface LogoConfig {
  activeLogoUrl: string;
  fallbackLogoUrl: string;
}

interface LogoConfigRow {
  active_logo_url: string;
  fallback_logo_url: string;
}

export const useLogoConfig = () => {
  const [logoConfig, setLogoConfig] = useState<LogoConfig>({
    activeLogoUrl: '/lovable-uploads/aed59d55-5b0a-4b7b-b82d-340e25b8ca40.png',
    fallbackLogoUrl: '/lovable-uploads/aed59d55-5b0a-4b7b-b82d-340e25b8ca40.png'
  });
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadLogoConfig();
    }
  }, [user]);

  const loadLogoConfig = async () => {
    if (!user) return;

    try {
      console.log('Loading logo configuration from database...');
      
      const { data, error } = await supabase
        .rpc('get_logo_config', { user_id: user.id }) as { data: LogoConfigRow | null, error: any };

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
        console.error('Error loading logo config:', error);
        return;
      }

      if (data) {
        console.log('Loaded logo config from database:', data);
        setLogoConfig({
          activeLogoUrl: data.active_logo_url,
          fallbackLogoUrl: data.fallback_logo_url
        });
      } else {
        // No configuration exists, create default one
        console.log('No logo configuration found, creating default...');
        await createDefaultLogoConfig();
      }
    } catch (error) {
      console.error('Failed to load logo configuration:', error);
    }
  };

  const createDefaultLogoConfig = async () => {
    if (!user) return;

    try {
      const defaultConfig = {
        user_id: user.id,
        active_logo_url: '/lovable-uploads/aed59d55-5b0a-4b7b-b82d-340e25b8ca40.png',
        fallback_logo_url: '/lovable-uploads/aed59d55-5b0a-4b7b-b82d-340e25b8ca40.png'
      };

      const { error } = await supabase
        .rpc('create_logo_config', defaultConfig) as { error: any };

      if (error) {
        console.error('Error creating default logo config:', error);
        return;
      }

      console.log('Created default logo configuration');
      setLogoConfig({
        activeLogoUrl: defaultConfig.active_logo_url,
        fallbackLogoUrl: defaultConfig.fallback_logo_url
      });
    } catch (error) {
      console.error('Failed to create default logo configuration:', error);
    }
  };

  const testImageLoad = async (url: string): Promise<boolean> => {
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
      return;
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
      return;
    }

    try {
      // Update in database using RPC function
      const { error } = await supabase
        .rpc('update_logo_config', {
          user_id: user.id,
          new_active_logo_url: newLogoUrl,
          new_fallback_logo_url: logoConfig.fallbackLogoUrl
        }) as { error: any };

      if (error) {
        console.error('Error updating logo configuration in database:', error);
        toast({
          variant: "destructive",
          title: "Logo Update Failed",
          description: "Failed to save logo configuration. Please try again.",
        });
        return;
      }

      // Update local state
      const newConfig = {
        ...logoConfig,
        activeLogoUrl: newLogoUrl
      };
      
      setLogoConfig(newConfig);
      
      toast({
        title: "Logo Updated",
        description: "The active logo has been updated successfully.",
      });
      
      console.log('Active logo updated to:', newLogoUrl);
    } catch (error) {
      console.error('Failed to update logo configuration:', error);
      toast({
        variant: "destructive",
        title: "Logo Update Failed",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return {
    logoConfig,
    updateActiveLogo
  };
};
