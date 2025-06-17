
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
              Preview how the logos appear in different contexts (expanded and collapsed sidebar states)
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
        <div className="space-y-6">
          {/* Expanded Sidebar Logo Preview */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-700">Expanded Sidebar Logo</h4>
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <div className="space-y-2">
                <p className="text-sm font-medium">Small</p>
                <div className="p-2 bg-background rounded border">
                  <Logo size="sm" variant="expanded" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Medium</p>
                <div className="p-2 bg-background rounded border">
                  <Logo size="md" variant="expanded" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Large</p>
                <div className="p-2 bg-background rounded border">
                  <Logo size="lg" variant="expanded" />
                </div>
              </div>
            </div>
          </div>

          {/* Collapsed Sidebar Logo Preview */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-700">Collapsed Sidebar Logo</h4>
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <div className="space-y-2">
                <p className="text-sm font-medium">Small</p>
                <div className="p-2 bg-background rounded border">
                  <Logo size="sm" variant="collapsed" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Medium</p>
                <div className="p-2 bg-background rounded border">
                  <Logo size="md" variant="collapsed" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Large</p>
                <div className="p-2 bg-background rounded border">
                  <Logo size="lg" variant="collapsed" />
                </div>
              </div>
            </div>
          </div>

          {/* Logo URLs Information */}
          <div className="text-sm text-muted-foreground space-y-2 pt-4 border-t">
            <div className="break-all">
              <strong>Main Logo URL (Expanded):</strong> {logoConfig.activeLogoUrl}
            </div>
            {logoConfig.collapsedLogoUrl && (
              <div className="break-all">
                <strong>Collapsed Logo URL:</strong> {logoConfig.collapsedLogoUrl}
              </div>
            )}
            <div className="break-all">
              <strong>Fallback Logo URL:</strong> {logoConfig.fallbackLogoUrl}
            </div>
            {isLoading && (
              <div className="text-blue-600">Loading public logo configuration...</div>
            )}
            {!logoConfig.collapsedLogoUrl && (
              <div className="text-amber-600 text-xs">
                No collapsed logo uploaded yet. Upload a collapsed logo to see it in the preview above.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
