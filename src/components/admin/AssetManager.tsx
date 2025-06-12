
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Trash2, Image, FileText, Settings } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useAssetManagement } from '@/hooks/useAssetManagement';
import { Asset, ASSET_CATEGORIES, ASSET_TYPES } from '@/types/assets';

export const AssetManager: React.FC = () => {
  const { assets, isLoading, uploadAsset, deleteAsset, getAssetsByType } = useAssetManagement();
  const [selectedType, setSelectedType] = useState<Asset['type']>('logo');
  const [selectedCategory, setSelectedCategory] = useState(ASSET_CATEGORIES.BRANDING);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'],
      'application/pdf': ['.pdf'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: async (acceptedFiles) => {
      for (const file of acceptedFiles) {
        await uploadAsset(file, selectedType, selectedCategory);
      }
    }
  });

  const getAssetIcon = (asset: Asset) => {
    switch (asset.type) {
      case 'logo':
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const currentAssets = getAssetsByType(selectedType);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Asset Management</CardTitle>
          <CardDescription>
            Upload and manage assets with organized folder structure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Asset Type</label>
              <Select value={selectedType} onValueChange={(value: Asset['type']) => setSelectedType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="logo">Logo</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ASSET_CATEGORIES.BRANDING}>Branding</SelectItem>
                  <SelectItem value={ASSET_CATEGORIES.CONTENT}>Content</SelectItem>
                  <SelectItem value={ASSET_CATEGORIES.SYSTEM}>System</SelectItem>
                  <SelectItem value={ASSET_CATEGORIES.USER_UPLOADS}>User Uploads</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">
              {isDragActive ? 'Drop files here...' : 'Upload Assets'}
            </p>
            <p className="text-sm text-muted-foreground">
              Drag & drop files or click to select (PNG, JPG, SVG, PDF up to 10MB)
            </p>
            <Badge variant="outline" className="mt-2">
              {selectedType} • {selectedCategory}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Assets ({currentAssets.length})</CardTitle>
          <CardDescription>
            Showing {selectedType} assets
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentAssets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No {selectedType} assets found. Upload some assets to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentAssets.map((asset) => (
                <Card key={asset.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="aspect-video bg-muted rounded-lg mb-3 overflow-hidden">
                      {asset.type === 'image' || asset.type === 'logo' ? (
                        <img 
                          src={asset.url} 
                          alt={asset.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {getAssetIcon(asset)}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium truncate">{asset.name}</h4>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{formatFileSize(asset.fileSize)}</span>
                        <Badge variant="outline" className="text-xs">
                          {asset.category}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigator.clipboard.writeText(asset.url)}
                          className="flex-1"
                        >
                          Copy URL
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteAsset(asset)}
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
