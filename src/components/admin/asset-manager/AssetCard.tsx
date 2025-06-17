
import React, { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Image, Video, FileText, Settings, Upload } from 'lucide-react';
import { Asset } from '@/types/assets';

interface AssetCardProps {
  asset: Asset;
  onDelete: (asset: Asset) => void;
  onReplace: (asset: Asset, newFile: File) => void;
  isLoading: boolean;
}

export const AssetCard: React.FC<AssetCardProps> = ({
  asset,
  onDelete,
  onReplace,
  isLoading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAssetIcon = (asset: Asset) => {
    switch (asset.type) {
      case 'logo':
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
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

  const handleReplaceClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onReplace(asset, file);
      // Reset the input so the same file can be selected again if needed
      event.target.value = '';
    }
  };

  const getAcceptTypes = () => {
    switch (asset.type) {
      case 'image':
      case 'logo':
        return 'image/*';
      case 'video':
        return 'video/*';
      case 'document':
        return 'application/pdf';
      default:
        return '*/*';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="aspect-video bg-muted rounded-lg mb-3 overflow-hidden">
          {asset.type === 'image' || asset.type === 'logo' ? (
            <img 
              src={asset.url} 
              alt={asset.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                console.error('Asset image failed to load:', asset.url);
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : asset.type === 'video' ? (
            <video 
              src={asset.url}
              className="w-full h-full object-contain"
              controls
              preload="metadata"
              onError={(e) => {
                console.error('Asset video failed to load:', asset.url);
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {getAssetIcon(asset)}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <h4 className="font-medium truncate" title={asset.name}>{asset.name}</h4>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{formatFileSize(asset.fileSize)}</span>
            <Badge variant="outline" className="text-xs">
              {asset.category}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground break-all">
            {asset.mimeType}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigator.clipboard.writeText(asset.url)}
              className="flex-1"
              title="Copy URL to clipboard"
            >
              Copy URL
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReplaceClick}
              disabled={isLoading}
              title="Replace asset"
            >
              <Upload className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(asset)}
              disabled={isLoading}
              title="Delete asset"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept={getAcceptTypes()}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
      </CardContent>
    </Card>
  );
};
