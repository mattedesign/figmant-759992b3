
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Camera, CheckCircle, XCircle, RefreshCw, AlertTriangle } from 'lucide-react';

interface ScreenshotServiceStatusProps {
  className?: string;
}

export const ScreenshotServiceStatus: React.FC<ScreenshotServiceStatusProps> = ({ className }) => {
  const [status, setStatus] = useState<'checking' | 'configured' | 'mock' | 'error'>('checking');
  const [apiKeySource, setApiKeySource] = useState<'server' | 'environment' | 'none'>('none');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkServiceStatus = async () => {
    setIsRefreshing(true);
    
    try {
      // Check if we can get API key from server
      const response = await fetch('/api/screenshot-config', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('sb-okvsvrcphudxxrdonfvp-auth-token')}`
        }
      });
      
      if (response.ok) {
        const { apiKey } = await response.json();
        if (apiKey) {
          setStatus('configured');
          setApiKeySource('server');
          setIsRefreshing(false);
          return;
        }
      }
    } catch (error) {
      console.warn('Server API key check failed:', error);
    }

    // Fallback to environment variable check
    const envApiKey = import.meta.env.VITE_SCREENSHOTONE_API_KEY;
    if (envApiKey) {
      setStatus('configured');
      setApiKeySource('environment');
    } else {
      setStatus('mock');
      setApiKeySource('none');
    }
    
    setIsRefreshing(false);
  };

  useEffect(() => {
    checkServiceStatus();
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'configured': return 'bg-green-100 text-green-800';
      case 'mock': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'configured': return <CheckCircle className="h-3 w-3" />;
      case 'mock': return <AlertTriangle className="h-3 w-3" />;
      case 'error': return <XCircle className="h-3 w-3" />;
      default: return <RefreshCw className="h-3 w-3 animate-spin" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'configured': 
        return `Real ScreenshotOne Service (${apiKeySource === 'server' ? 'Server Config' : 'Environment'})`;
      case 'mock': 
        return 'Mock Data Service';
      case 'error': 
        return 'Service Error';
      default: 
        return 'Checking...';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-blue-600" />
          Screenshot Service Status
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Current Service:</span>
          <Badge className={getStatusColor()}>
            {getStatusIcon()}
            {getStatusText()}
          </Badge>
        </div>

        {status === 'mock' && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Using Mock Data</p>
                <p>ScreenshotOne API key not found. Screenshots will return placeholder data.</p>
              </div>
            </div>
          </div>
        )}

        {status === 'configured' && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <div className="text-sm text-green-800">
                <p className="font-medium">Real ScreenshotOne Service Active</p>
                <p>Using {apiKeySource === 'server' ? 'server-configured' : 'environment'} API key for high-quality screenshots.</p>
              </div>
            </div>
          </div>
        )}

        <Button 
          variant="outline" 
          onClick={checkServiceStatus}
          disabled={isRefreshing}
          className="w-full"
        >
          {isRefreshing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Checking Status...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Status
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
