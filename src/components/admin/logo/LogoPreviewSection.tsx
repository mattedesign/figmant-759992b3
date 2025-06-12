
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/common/Logo';
import { useLogoConfig } from '@/hooks/useLogoConfig';

export const LogoPreviewSection: React.FC = () => {
  const { logoConfig } = useLogoConfig();

  return (
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
          <div className="text-sm text-muted-foreground break-all">
            Active Logo URL: {logoConfig.activeLogoUrl}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
