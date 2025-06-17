
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Asset, ASSET_CATEGORIES } from '@/types/assets';

interface AssetFiltersProps {
  selectedType: Asset['type'];
  selectedCategory: Asset['category'];
  onTypeChange: (type: Asset['type']) => void;
  onCategoryChange: (category: Asset['category']) => void;
}

export const AssetFilters: React.FC<AssetFiltersProps> = ({
  selectedType,
  selectedCategory,
  onTypeChange,
  onCategoryChange,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="text-sm font-medium">Asset Type</label>
        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="logo">Logo</SelectItem>
            <SelectItem value="image">Image</SelectItem>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="document">Document</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium">Category</label>
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
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
  );
};
