
import React from 'react';
import { useAssetManagement } from '@/hooks/useAssetManagement';
import { useLogoConfig } from '@/hooks/useLogoConfig';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface LogoAssetManagerProps {
  onLogoUpdate?: (logoUrl: string) => void;
}

export const LogoAssetManager: React.FC<LogoAssetManagerProps> = ({ onLogoUpdate }) => {
  const { uploadAsset, isLoading } = useAssetManagement();
  const { updateActiveLogo } = useLogoConfig();
  const { toast } = useToast();

  const handleLogoUpload = async (file: File) => {
    try {
      console.log('Starting logo upload process...');
      
      // Upload the asset
      const uploadedAsset = await uploadAsset(file, 'logo', 'branding', ['main-logo']);
      
      if (uploadedAsset) {
        console.log('Logo asset uploaded successfully:', uploadedAsset.url);
        
        // The updateActiveLogo is already called in uploadAsset for logo type
        // But we can also call the callback if provided
        if (onLogoUpdate) {
          onLogoUpdate(uploadedAsset.url);
        }
        
        toast({
          title: "Logo Updated",
          description: "Your logo has been uploaded and set as active successfully.",
        });
      }
    } catch (error) {
      console.error('Logo upload failed:', error);
      toast({
        variant: "destructive",
        title: "Logo Upload Failed",
        description: "Failed to upload and set the logo. Please try again.",
      });
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
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

      handleLogoUpload(file);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="logo-upload" className="cursor-pointer">
          <Button asChild disabled={isLoading}>
            <span>
              {isLoading ? 'Uploading...' : 'Upload New Logo'}
            </span>
          </Button>
        </label>
        <input
          id="logo-upload"
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/svg+xml"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isLoading}
        />
      </div>
      <p className="text-sm text-muted-foreground">
        Upload a PNG, JPG, or SVG file (max 5MB). The uploaded logo will automatically become your active logo.
      </p>
    </div>
  );
};
