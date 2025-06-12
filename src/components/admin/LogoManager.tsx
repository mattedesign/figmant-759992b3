
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, Check, Eye, Trash2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useAssetManagement } from '@/hooks/useAssetManagement';
import { useLogoConfig } from '@/hooks/useLogoConfig';
import { ASSET_CATEGORIES } from '@/types/assets';
import { Logo } from '@/components/common/Logo';

export const LogoManager: React.FC = () => {
  const { uploadAsset, getAssetsByType, deleteAsset, isLoading } = useAssetManagement();
  const { logoConfig, updateActiveLogo } = useLogoConfig();
  
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
          // Automatically set new uploads as active
          updateActiveLogo(asset.url);
        }
      }
    }
  });

  const handleSetActiveLogo = (url: string) => {
    updateActiveLogo(url);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Logo Management</CardTitle>
          <CardDescription>
            Upload and manage logos for your application. New uploads are automatically set as active.
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
            Preview how the active logo appears across different sizes
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
            <div className="text-sm text-muted-foreground">
              Active Logo URL: {logoConfig.activeLogoUrl}
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
                      <div className="text-xs text-muted-foreground">
                        {formatFileSize(logo.fileSize)}
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant={logoConfig.activeLogoUrl === logo.url ? "default" : "outline"}>
                          {logoConfig.activeLogoUrl === logo.url ? "Active" : "Available"}
                        </Badge>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(logo.url, '_blank')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {logoConfig.activeLogoUrl !== logo.url && (
                            <Button
                              size="sm"
                              onClick={() => handleSetActiveLogo(logo.url)}
                              disabled={isLoading}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteAsset(logo)}
                            disabled={isLoading || logoConfig.activeLogoUrl === logo.url}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
