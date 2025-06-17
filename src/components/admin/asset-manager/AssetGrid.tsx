
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Asset } from '@/types/assets';
import { AssetCard } from './AssetCard';

interface AssetGridProps {
  assets: Asset[];
  selectedType: Asset['type'];
  onDeleteAsset: (asset: Asset) => void;
  onReplaceAsset: (asset: Asset, newFile: File) => void;
  isLoading: boolean;
}

export const AssetGrid: React.FC<AssetGridProps> = ({
  assets,
  selectedType,
  onDeleteAsset,
  onReplaceAsset,
  isLoading,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Assets ({assets.length})</CardTitle>
        <CardDescription>
          Showing {selectedType} assets
        </CardDescription>
      </CardHeader>
      <CardContent>
        {assets.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No {selectedType} assets found. Upload some assets to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assets.map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                onDelete={onDeleteAsset}
                onReplace={onReplaceAsset}
                isLoading={isLoading}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
