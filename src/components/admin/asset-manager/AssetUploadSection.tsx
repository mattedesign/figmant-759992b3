
import React from 'react';
import { FileRejection } from 'react-dropzone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Asset } from '@/types/assets';
import { AssetFilters } from './AssetFilters';

interface AssetUploadSectionProps {
  selectedType: Asset['type'];
  selectedCategory: Asset['category'];
  onTypeChange: (type: Asset['type']) => void;
  onCategoryChange: (category: Asset['category']) => void;
  getRootProps: () => any;
  getInputProps: () => any;
  isDragActive: boolean;
  isLoading: boolean;
  fileRejections: readonly FileRejection[];
}

export const AssetUploadSection: React.FC<AssetUploadSectionProps> = ({
  selectedType,
  selectedCategory,
  onTypeChange,
  onCategoryChange,
  getRootProps,
  getInputProps,
  isDragActive,
  isLoading,
  fileRejections,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Management</CardTitle>
        <CardDescription>
          Upload and manage assets with organized folder structure. Supports images (PNG, JPG, SVG, WebP, GIF), videos (MP4, WebM, MOV, AVI, MKV), and PDFs up to 50MB.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <AssetFilters
          selectedType={selectedType}
          selectedCategory={selectedCategory}
          onTypeChange={onTypeChange}
          onCategoryChange={onCategoryChange}
        />

        {fileRejections.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {fileRejections.map((rejection, index) => (
                <div key={index}>
                  {rejection.file.name}: {rejection.errors.map(e => e.message).join(', ')}
                </div>
              ))}
            </AlertDescription>
          </Alert>
        )}

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            isDragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-primary/50'
          } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <input {...getInputProps()} />
          <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-2">
            {isDragActive ? 'Drop files here...' : isLoading ? 'Uploading...' : 'Upload Assets'}
          </p>
          <p className="text-sm text-muted-foreground">
            Drag & drop files or click to select (Images, <strong>Videos</strong>, PDFs up to 50MB)
          </p>
          <Badge variant="outline" className="mt-2">
            {selectedType} • {selectedCategory}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
