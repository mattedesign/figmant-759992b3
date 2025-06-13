
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle, Globe, ExternalLink, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DomainValidatorProps {
  url: string;
  onUrlChange: (url: string) => void;
  onValidUrl: (url: string) => void;
}

const SUPPORTED_DOMAINS = [
  { category: 'E-commerce', domains: ['amazon.com', 'ebay.com', 'shopify.com', 'etsy.com'] },
  { category: 'Design', domains: ['figma.com', 'behance.net', 'dribbble.com', 'canva.com'] },
  { category: 'Tech', domains: ['github.com', 'stackoverflow.com', 'apple.com', 'google.com'] },
  { category: 'Business', domains: ['linkedin.com', 'salesforce.com', 'hubspot.com', 'slack.com'] },
  { category: 'Media', domains: ['youtube.com', 'medium.com', 'netflix.com', 'spotify.com'] },
  { category: 'Travel', domains: ['airbnb.com', 'booking.com', 'uber.com', 'expedia.com'] }
];

export const DomainValidator: React.FC<DomainValidatorProps> = ({
  url,
  onUrlChange,
  onValidUrl
}) => {
  const [showSupportedDomains, setShowSupportedDomains] = useState(false);

  const validateDomain = (inputUrl: string): { isValid: boolean; hostname?: string; message?: string } => {
    if (!inputUrl.trim()) {
      return { isValid: false, message: 'Please enter a URL' };
    }

    try {
      const urlObj = new URL(inputUrl.startsWith('http') ? inputUrl : `https://${inputUrl}`);
      const hostname = urlObj.hostname.toLowerCase();
      
      // Check against supported domains
      const allSupportedDomains = SUPPORTED_DOMAINS.flatMap(cat => cat.domains);
      const isSupported = allSupportedDomains.some(domain => 
        hostname === domain || hostname.endsWith('.' + domain)
      );

      if (isSupported) {
        return { isValid: true, hostname };
      } else {
        return { 
          isValid: false, 
          hostname,
          message: `Domain "${hostname}" is not currently supported. See supported domains below.`
        };
      }
    } catch {
      return { isValid: false, message: 'Please enter a valid URL (e.g., https://example.com)' };
    }
  };

  const validation = validateDomain(url);

  const handleAddUrl = () => {
    if (validation.isValid) {
      const fullUrl = url.startsWith('http') ? url : `https://${url}`;
      onValidUrl(fullUrl);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            type="url"
            placeholder="https://example.com or example.com"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            className={`pr-10 ${validation.isValid ? 'border-green-500' : url && !validation.isValid ? 'border-red-500' : ''}`}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {url && (
              validation.isValid ? 
                <CheckCircle className="h-4 w-4 text-green-500" /> : 
                <XCircle className="h-4 w-4 text-red-500" />
            )}
          </div>
        </div>
        <Button 
          onClick={handleAddUrl}
          disabled={!validation.isValid}
          size="sm"
        >
          Add URL
        </Button>
      </div>

      {url && !validation.isValid && validation.message && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>{validation.message}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSupportedDomains(!showSupportedDomains)}
          className="text-xs"
        >
          <Globe className="h-3 w-3 mr-1" />
          {showSupportedDomains ? 'Hide' : 'Show'} Supported Domains
        </Button>
        
        {validation.hostname && (
          <Badge variant={validation.isValid ? "default" : "secondary"}>
            {validation.hostname}
          </Badge>
        )}
      </div>

      {showSupportedDomains && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Supported Domains</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {SUPPORTED_DOMAINS.map((category) => (
              <div key={category.category}>
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                  {category.category}
                </h4>
                <div className="flex flex-wrap gap-1">
                  {category.domains.map((domain) => (
                    <Badge 
                      key={domain} 
                      variant="outline" 
                      className="text-xs cursor-pointer hover:bg-muted"
                      onClick={() => onUrlChange(`https://${domain}`)}
                    >
                      {domain}
                      <ExternalLink className="h-2 w-2 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Don't see your domain? Upload screenshots of the website for analysis instead.
                Our domain list focuses on popular platforms for security and reliability.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
