
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, Check, Eye } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useAssetManagement } from '@/hooks/useAssetManagement';
import { ASSET_CATEGORIES } from '@/types/assets';
import { Logo } from '@/components/common/Logo';

interface LogoConfig {
  id: string;
  name: string;
  url: string;
  isActive: boolean;
}

export const LogoManager: React.FC = () => {
  const { uploadAsset, getAssetsByType, isLoading } = useAssetManagement();
  const [activeLogoUrl, setActiveLogoUrl] = useState('/lovable-uploads/aed59d55-5b0a-4b7b-b82d-340e25b8ca40.png');
  
  const logoAssets = getAssetsByType('logo');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.svg', '.webp'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB for logos
    onDrop: async (acceptedFiles) => {
      for (const file of acceptedFiles) {
        const asset = await uploadAsset(file, 'logo', ASSET_CATEGORIES.BRANDING, ['main-logo']);
        if (asset) {
          console.log('New logo uploaded:', asset.url);
        }
      }
    }
  });

  const handleSetActiveLogo = (url: string) => {
    setActiveLogoUrl(url);
    console.log('Active logo set to:', url);
    // In a real app, this would update the logo configuration in the database/settings
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Logo Management</CardTitle>
          <CardDescription>
            Upload and manage logos for your application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
              isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-6 w-6 mx-auto mb-3 text-muted-foreground" />
            <p className="font-medium mb-1">
              {isDragActive ? 'Drop logo here...' : 'Upload New Logo'}
            </p>
            <p className="text-sm text-muted-foreground">
              PNG, JPG, SVG up to 5MB (Recommended: 200x50px)
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Logo Preview</CardTitle>
          <CardDescription>
            Preview how the logo appears across different sizes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <div className="space-y-2">
                <p className="text-sm font-medium">Small (Navigation)</p>
                <div className="p-2 bg-background rounded border">
                  <Logo size="sm" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Medium (Header)</p>
                <div className="p-2 bg-background rounded border">
                  <Logo size="md" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Large (Landing)</p>
                <div className="p-2 bg-background rounded border">
                  <Logo size="lg" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Logos ({logoAssets.length})</CardTitle>
          <CardDescription>
            Select which logo to use across the application
          </CardDescription>
        </CardHeader>
        <CardContent>
          {logoAssets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No logos uploaded yet. Upload a logo to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {logoAssets.map((logo) => (
                <Card key={logo.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="aspect-video bg-muted rounded-lg mb-3 overflow-hidden">
                      <img 
                        src={logo.url} 
                        alt={logo.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium truncate">{logo.name}</h4>
                      <div className="flex items-center justify-between">
                        <Badge variant={activeLogoUrl === logo.url ? "default" : "outline"}>
                          {activeLogoUrl === logo.url ? "Active" : "Available"}
                        </Badge>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(logo.url, '_blank')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {activeLogoUrl !== logo.url && (
                            <Button
                              size="sm"
                              onClick={() => handleSetActiveLogo(logo.url)}
                              disabled={isLoading}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
