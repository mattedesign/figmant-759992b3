
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogoAssetManager } from './LogoAssetManager';

export const LogoUploadSection: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Logo</CardTitle>
        <CardDescription>
          Upload a new logo that will be used across your application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LogoAssetManager />
      </CardContent>
    </Card>
  );
};
