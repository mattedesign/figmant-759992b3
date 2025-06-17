
import React, { useState } from 'react';
import { useAssetManagement } from '@/hooks/useAssetManagement';
import { useLogoConfig } from '@/hooks/useLogoConfig';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface LogoAssetManagerProps {
  onLogoUpdate?: (logoUrl: string) => void;
}

export const LogoAssetManager: React.FC<LogoAssetManagerProps> = ({ onLogoUpdate }) => {
  const { uploadAsset } = useAssetManagement();
  const { resetToDefault } = useLogoConfig();
  const { toast } = useToast();
  const [mainLogoLoading, setMainLogoLoading] = useState(false);
  const [collapsedLogoLoading, setCollapsedLogoLoading] = useState(false);

  const handleLogoUpload = async (file: File, variant: 'expanded' | 'collapsed' = 'expanded') => {
    const setLoading = variant === 'collapsed' ? setCollapsedLogoLoading : setMainLogoLoading;
    
    try {
      setLoading(true);
      console.log(`Starting ${variant} logo upload process...`, file.type, file.name);
      
      // Upload the asset with variant-specific tags
      const tags = variant === 'collapsed' ? ['collapsed-logo'] : ['main-logo'];
      const uploadedAsset = await uploadAsset(file, 'logo', 'branding', tags);
      
      if (uploadedAsset) {
        console.log(`${variant} logo upload completed successfully:`, uploadedAsset.url);
        
        // Call the callback if provided
        if (onLogoUpdate) {
          onLogoUpdate(uploadedAsset.url);
        }
        
        toast({
          title: `${variant === 'collapsed' ? 'Collapsed' : 'Main'} Logo Updated`,
          description: `Your ${variant} logo has been uploaded and set as active successfully.`,
        });
      }
    } catch (error) {
      console.error(`${variant} logo upload failed:`, error);
      toast({
        variant: "destructive",
        title: "Logo Upload Failed",
        description: `Failed to upload and set the ${variant} logo. Please try again.`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetLogo = async () => {
    try {
      const success = await resetToDefault();
      if (!success) {
        toast({
          variant: "destructive",
          title: "Reset Failed",
          description: "Failed to reset logo to default. Please try again.",
        });
      }
    } catch (error) {
      console.error('Logo reset failed:', error);
      toast({
        variant: "destructive",
        title: "Reset Failed",
        description: "Failed to reset logo to default. Please try again.",
      });
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, variant: 'expanded' | 'collapsed' = 'expanded') => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type - now including SVG
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload a PNG, JPG, or SVG file.",
        });
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File Too Large",
          description: "Please upload a file smaller than 5MB.",
        });
        return;
      }

      handleLogoUpload(file, variant);
    }
    // Clear the input to allow uploading the same file again
    event.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Main Logo Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Main Logo (Expanded Sidebar)</h3>
        <div className="flex gap-2">
          <div>
            <label htmlFor="logo-upload-main" className="cursor-pointer">
              <Button asChild disabled={mainLogoLoading}>
                <span>
                  {mainLogoLoading ? 'Uploading...' : 'Upload Main Logo'}
                </span>
              </Button>
            </label>
            <input
              id="logo-upload-main"
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/svg+xml"
              onChange={(e) => handleFileSelect(e, 'expanded')}
              className="hidden"
              disabled={mainLogoLoading}
            />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Upload a PNG, JPG, or <strong>SVG</strong> file (max 5MB) for the main logo displayed when sidebar is expanded.
        </p>
      </div>

      {/* Collapsed Logo Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Collapsed Logo (Collapsed Sidebar)</h3>
        <div className="flex gap-2">
          <div>
            <label htmlFor="logo-upload-collapsed" className="cursor-pointer">
              <Button asChild disabled={collapsedLogoLoading} variant="outline">
                <span>
                  {collapsedLogoLoading ? 'Uploading...' : 'Upload Collapsed Logo'}
                </span>
              </Button>
            </label>
            <input
              id="logo-upload-collapsed"
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/svg+xml"
              onChange={(e) => handleFileSelect(e, 'collapsed')}
              className="hidden"
              disabled={collapsedLogoLoading}
            />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Upload a smaller logo or icon (PNG, JPG, or <strong>SVG</strong>, max 5MB) optimized for the collapsed sidebar state.
        </p>
      </div>

      {/* Reset Section */}
      <div className="pt-4 border-t">
        <Button
          variant="outline"
          onClick={handleResetLogo}
          disabled={mainLogoLoading || collapsedLogoLoading}
        >
          Reset All Logos to Default
        </Button>
      </div>
    </div>
  );
};
