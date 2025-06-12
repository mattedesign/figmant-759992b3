
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAssetManagement } from '@/hooks/useAssetManagement';
import { useLogoConfig } from '@/hooks/useLogoConfig';
import { ASSET_CATEGORIES } from '@/types/assets';

export const LogoUploadSection: React.FC = () => {
  const { uploadAsset, isLoading } = useAssetManagement();
  const { updateActiveLogo } = useLogoConfig();

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.svg', '.webp'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB for logos
    onDrop: async (acceptedFiles) => {
      console.log('Files dropped:', acceptedFiles);
      for (const file of acceptedFiles) {
        console.log('Processing file:', file.name, 'Type:', file.type, 'Size:', file.size);
        const asset = await uploadAsset(file, 'logo', ASSET_CATEGORIES.BRANDING, ['main-logo']);
        if (asset) {
          console.log('New logo uploaded:', asset.url);
          // Automatically set new uploads as active
          await updateActiveLogo(asset.url);
        }
      }
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logo Management</CardTitle>
        <CardDescription>
          Upload and manage logos for your application. Supported formats: PNG, JPG, SVG, WebP (up to 5MB).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
            isDragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-primary/50'
          } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <input {...getInputProps()} />
          <Upload className="h-6 w-6 mx-auto mb-3 text-muted-foreground" />
          <p className="font-medium mb-1">
            {isDragActive ? 'Drop logo here...' : isLoading ? 'Uploading...' : 'Upload New Logo'}
          </p>
          <p className="text-sm text-muted-foreground">
            PNG, JPG, SVG, WebP up to 5MB (Recommended: 200x50px for horizontal logos)
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
