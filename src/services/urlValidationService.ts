
export interface URLValidationResult {
  isValid: boolean;
  url: string;
  hostname: string;
  error?: string;
  warnings?: string[];
  metadata?: {
    title?: string;
    description?: string;
    favicon?: string;
    responsive?: boolean;
    loadTime?: number;
  };
}

export class URLValidationService {
  private static readonly ALLOWED_PROTOCOLS = ['http:', 'https:'];
  private static readonly COMPETITOR_DOMAINS = [
    // E-commerce
    'amazon.com', 'ebay.com', 'shopify.com', 'etsy.com', 'alibaba.com',
    'walmart.com', 'target.com', 'bestbuy.com', 'wayfair.com', 'zappos.com',
    
    // SaaS & Tech
    'salesforce.com', 'hubspot.com', 'slack.com', 'zoom.us', 'dropbox.com',
    'github.com', 'gitlab.com', 'atlassian.com', 'zendesk.com', 'intercom.com',
    
    // Design & Creative
    'figma.com', 'behance.net', 'dribbble.com', 'canva.com', 'adobe.com',
    'sketch.com', 'invisionapp.com', 'framer.com', 'webflow.com',
    
    // Business & Marketing
    'mailchimp.com', 'constantcontact.com', 'hootsuite.com', 'buffer.com',
    'sprinklr.com', 'marketo.com', 'pardot.com', 'klaviyo.com'
  ];

  static async validateURL(inputUrl: string): Promise<URLValidationResult> {
    const trimmedUrl = inputUrl.trim();
    
    if (!trimmedUrl) {
      return {
        isValid: false,
        url: '',
        hostname: '',
        error: 'URL cannot be empty'
      };
    }

    try {
      // Normalize URL - add https:// if no protocol
      let normalizedUrl = trimmedUrl;
      if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
        normalizedUrl = `https://${trimmedUrl}`;
      }

      const urlObj = new URL(normalizedUrl);
      
      // Validate protocol
      if (!this.ALLOWED_PROTOCOLS.includes(urlObj.protocol)) {
        return {
          isValid: false,
          url: normalizedUrl,
          hostname: urlObj.hostname,
          error: `Unsupported protocol: ${urlObj.protocol}. Only HTTP and HTTPS are allowed.`
        };
      }

      // Check if domain is in our supported list
      const hostname = urlObj.hostname.toLowerCase();
      const isDomainSupported = this.COMPETITOR_DOMAINS.some(domain => 
        hostname === domain || hostname.endsWith('.' + domain)
      );

      const warnings: string[] = [];
      if (!isDomainSupported) {
        warnings.push(`Domain "${hostname}" is not in our verified competitor list. Screenshot capture may not work optimally.`);
      }

      // Basic URL accessibility check
      const metadata = await this.checkURLAccessibility(normalizedUrl);

      return {
        isValid: true,
        url: normalizedUrl,
        hostname,
        warnings: warnings.length > 0 ? warnings : undefined,
        metadata
      };

    } catch (error) {
      return {
        isValid: false,
        url: trimmedUrl,
        hostname: '',
        error: 'Invalid URL format. Please enter a valid website URL.'
      };
    }
  }

  private static async checkURLAccessibility(url: string): Promise<URLValidationResult['metadata']> {
    try {
      const startTime = Date.now();
      
      // Use a simple fetch with timeout to check if URL is accessible
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        mode: 'no-cors', // Avoid CORS issues for basic accessibility check
      });
      
      clearTimeout(timeoutId);
      const loadTime = Date.now() - startTime;

      return {
        loadTime,
        responsive: loadTime < 3000 // Consider responsive if loads under 3s
      };
    } catch (error) {
      console.warn('URL accessibility check failed:', error);
      return {
        loadTime: undefined,
        responsive: false
      };
    }
  }

  static async validateMultipleURLs(urls: string[]): Promise<URLValidationResult[]> {
    const validationPromises = urls.map(url => this.validateURL(url));
    return Promise.all(validationPromises);
  }
}
