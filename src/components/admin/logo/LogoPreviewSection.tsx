
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { usePublicLogoConfig } from '@/hooks/usePublicLogoConfig';

export const LogoPreviewSection: React.FC = () => {
  const { logoConfig, isLoading, reload } = usePublicLogoConfig();

  const handleRefresh = () => {
    reload();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Current Public Logo Preview</CardTitle>
            <CardDescription>
              Preview how the public logo appears across different sizes (visible to all users)
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
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
          <div className="text-sm text-muted-foreground space-y-1">
            <div className="break-all">
              <strong>Active Logo URL:</strong> {logoConfig.activeLogoUrl}
            </div>
            <div className="break-all">
              <strong>Fallback Logo URL:</strong> {logoConfig.fallbackLogoUrl}
            </div>
            {isLoading && (
              <div className="text-blue-600">Loading public logo configuration...</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
