
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Eye, Trash2 } from 'lucide-react';
import { useAssetManagement } from '@/hooks/useAssetManagement';
import { useLogoConfig } from '@/hooks/useLogoConfig';

export const LogoGallerySection: React.FC = () => {
  const { getAssetsByType, deleteAsset, isLoading } = useAssetManagement();
  const { logoConfig, updateActiveLogo } = useLogoConfig();
  
  const logoAssets = getAssetsByType('logo');

  const handleSetActiveLogo = async (url: string) => {
    await updateActiveLogo(url);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
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
                  <div className="aspect-video bg-muted rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                    <img 
                      src={logo.url} 
                      alt={logo.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        console.error('Image failed to load:', logo.url);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium truncate" title={logo.name}>{logo.name}</h4>
                    <div className="text-xs text-muted-foreground">
                      {formatFileSize(logo.fileSize)} • {logo.mimeType}
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
                          title="View full size"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {logoConfig.activeLogoUrl !== logo.url && (
                          <Button
                            size="sm"
                            onClick={() => handleSetActiveLogo(logo.url)}
                            disabled={isLoading}
                            title="Set as active logo"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteAsset(logo)}
                          disabled={isLoading || logoConfig.activeLogoUrl === logo.url}
                          title={logoConfig.activeLogoUrl === logo.url ? "Cannot delete active logo" : "Delete logo"}
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
  );
};
