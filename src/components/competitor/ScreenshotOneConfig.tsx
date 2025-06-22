
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Camera, CheckCircle, XCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScreenshotOneConfigProps {
  className?: string;
}

export const ScreenshotOneConfig: React.FC<ScreenshotOneConfigProps> = ({ className }) => {
  const apiKey = import.meta.env.VITE_SCREENSHOTONE_API_KEY;
  const isConfigured = !!apiKey;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-blue-600" />
          ScreenshotOne Integration
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Status:</span>
          {isConfigured ? (
            <Badge variant="default" className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Configured
            </Badge>
          ) : (
            <Badge variant="destructive">
              <XCircle className="h-3 w-3 mr-1" />
              Not Configured
            </Badge>
          )}
        </div>

        {!isConfigured && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              ScreenshotOne API key not found. Add <code>VITE_SCREENSHOTONE_API_KEY</code> to your environment variables to enable high-quality screenshot capture.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Features</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>High-quality screenshots</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Mobile & desktop capture</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Ad & cookie banner blocking</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Full-page capture</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t">
          <Button variant="outline" className="w-full" asChild>
            <a 
              href="https://screenshotone.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Get ScreenshotOne API Key
            </a>
          </Button>
        </div>

        {isConfigured && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              ScreenshotOne is ready! Competitor analysis will now capture high-quality screenshots automatically.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
