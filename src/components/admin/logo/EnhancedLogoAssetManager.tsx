
import React from 'react';
import { useLogoContext } from '@/contexts/LogoContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { LogoType } from '@/types/logo';
import { EnhancedLogo } from '@/components/common/EnhancedLogo';

interface EnhancedLogoAssetManagerProps {
  onLogoUpdate?: (logoType: LogoType, logoUrl: string) => void;
}

export const EnhancedLogoAssetManager: React.FC<EnhancedLogoAssetManagerProps> = ({ onLogoUpdate }) => {
  const { logoConfig, updateLogo, isLoading } = useLogoContext();
  const { toast } = useToast();

  const handleLogoUpload = async (file: File, logoType: LogoType) => {
    try {
      console.log(`Starting ${logoType} logo upload process...`);
      
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

      // For demo purposes, create a mock URL
      const mockUrl = URL.createObjectURL(file);
      const success = await updateLogo(logoType, mockUrl);
      
      if (success) {
        console.log(`${logoType} logo upload completed successfully:`, mockUrl);
        
        if (onLogoUpdate) {
          onLogoUpdate(logoType, mockUrl);
        }
        
        toast({
          title: `${logoType === 'icon' ? 'Icon' : 'Brand'} Logo Updated`,
          description: `Your ${logoType} logo has been uploaded successfully.`,
        });
      }
    } catch (error) {
      console.error(`${logoType} logo upload failed:`, error);
      toast({
        variant: "destructive",
        title: "Logo Upload Failed",
        description: `Failed to upload ${logoType} logo. Please try again.`,
      });
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, logoType: LogoType) => {
    const file = event.target.files?.[0];
    if (file) {
      handleLogoUpload(file, logoType);
    }
    // Clear the input to allow uploading the same file again
    event.target.value = '';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Logo Management</CardTitle>
          <CardDescription>
            Upload different logos for different contexts. Icon logos are used in navigation, brand logos are used on auth pages.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Icon Logo Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Icon Logo</h3>
                <p className="text-sm text-muted-foreground">Used in navigation and sidebars</p>
              </div>
              <Badge variant="outline">Small & Square</Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div>
                  <label htmlFor="icon-logo-upload" className="cursor-pointer">
                    <Button asChild disabled={isLoading}>
                      <span>
                        {isLoading ? 'Uploading...' : 'Upload Icon Logo'}
                      </span>
                    </Button>
                  </label>
                  <input
                    id="icon-logo-upload"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                    onChange={(e) => handleFileSelect(e, 'icon')}
                    className="hidden"
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Preview:</span>
                <div className="p-2 border rounded-lg bg-muted">
                  <EnhancedLogo type="icon" size="sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Brand Logo Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Brand Logo</h3>
                <p className="text-sm text-muted-foreground">Used in headers and auth pages</p>
              </div>
              <Badge variant="outline">Full Brand</Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div>
                  <label htmlFor="brand-logo-upload" className="cursor-pointer">
                    <Button asChild disabled={isLoading}>
                      <span>
                        {isLoading ? 'Uploading...' : 'Upload Brand Logo'}
                      </span>
                    </Button>
                  </label>
                  <input
                    id="brand-logo-upload"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                    onChange={(e) => handleFileSelect(e, 'brand')}
                    className="hidden"
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Preview:</span>
                <div className="p-2 border rounded-lg bg-muted">
                  <EnhancedLogo type="brand" size="md" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Upload PNG, JPG, or SVG files (max 5MB). Icon logos work best as square images, 
              while brand logos can be rectangular with your full brand name.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
