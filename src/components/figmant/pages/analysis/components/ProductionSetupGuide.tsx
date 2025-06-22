
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Server, 
  ExternalLink, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  Code,
  Zap
} from 'lucide-react';

export const ProductionSetupGuide: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5 text-blue-600" />
          Production Deployment Guide
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Environment Variables */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Environment Variables</h4>
          
          <div className="bg-gray-100 p-3 rounded-md">
            <code className="text-sm font-mono">VITE_SCREENSHOTONE_API_KEY=your_api_key_here</code>
          </div>
          
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Important:</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Add this environment variable to your hosting platform</li>
                  <li>The <code>VITE_</code> prefix is required for Vite to include it in the build</li>
                  <li>Restart your application after adding the variable</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        </div>

        {/* Hosting Platforms */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Hosting Platform Setup</h4>
          
          <div className="space-y-3">
            <div className="border border-gray-200 rounded-md p-3">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">Vercel</Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Recommended
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Add environment variable in Project Settings → Environment Variables
              </p>
              <Button variant="outline" size="sm" asChild>
                <a 
                  href="https://vercel.com/docs/projects/environment-variables" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  Vercel Docs
                </a>
              </Button>
            </div>

            <div className="border border-gray-200 rounded-md p-3">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">Netlify</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Add environment variable in Site Settings → Environment Variables
              </p>
              <Button variant="outline" size="sm" asChild>
                <a 
                  href="https://docs.netlify.com/environment-variables/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  Netlify Docs
                </a>
              </Button>
            </div>

            <div className="border border-gray-200 rounded-md p-3">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">Railway</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Add environment variable in Project → Variables
              </p>
              <Button variant="outline" size="sm" asChild>
                <a 
                  href="https://docs.railway.app/guides/variables" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  Railway Docs
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* API Key Management */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">API Key Management</h4>
          
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Security Best Practices:</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Never commit API keys to your repository</li>
                  <li>Use different API keys for development and production</li>
                  <li>Regenerate API keys if they may have been compromised</li>
                  <li>Monitor API usage in your ScreenshotOne dashboard</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        </div>

        {/* Fallback Behavior */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Fallback Behavior</h4>
          
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-800">Graceful Degradation</p>
                <p className="text-xs text-blue-700">
                  Your application automatically falls back to mock screenshots when:
                </p>
                <ul className="text-xs text-blue-700 list-disc list-inside space-y-1">
                  <li>API key is not configured</li>
                  <li>ScreenshotOne service is unavailable</li>
                  <li>API quota is exceeded</li>
                </ul>
                <p className="text-xs text-blue-700">
                  All other functionality continues to work normally.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Considerations */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Performance Considerations</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-start gap-2 text-sm">
              <Zap className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">Fast Capture:</span>
                <p className="text-xs text-gray-600">Screenshots typically take 2-5 seconds</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2 text-sm">
              <Code className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">Optimized URLs:</span>
                <p className="text-xs text-gray-600">Direct API URLs for fastest loading</p>
              </div>
            </div>
          </div>
        </div>

        {/* Get Started */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Ready to Deploy?</h4>
            <Button asChild>
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
        </div>
      </CardContent>
    </Card>
  );
};
