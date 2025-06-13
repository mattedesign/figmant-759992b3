
const WEBSITE_CONFIG = {
  MAX_CONTENT_SIZE: 50000, // 50KB limit for extracted text
  TIMEOUT_MS: 15000, // 15 second timeout
  ALLOWED_DOMAINS: [
    // E-commerce platforms
    'amazon.com', 'ebay.com', 'etsy.com', 'shopify.com', 'wix.com', 'squarespace.com',
    'alibaba.com', 'aliexpress.com', 'walmart.com', 'target.com', 'bestbuy.com',
    'wayfair.com', 'overstock.com', 'zappos.com', 'nordstrom.com', 'macys.com',
    
    // Popular brands
    'nike.com', 'adidas.com', 'apple.com', 'google.com', 'microsoft.com', 'netflix.com',
    'coca-cola.com', 'pepsi.com', 'mcdonalds.com', 'starbucks.com', 'tesla.com',
    'samsung.com', 'sony.com', 'hp.com', 'dell.com', 'lenovo.com', 'asus.com',
    
    // Travel & hospitality
    'airbnb.com', 'booking.com', 'expedia.com', 'hotels.com', 'trivago.com',
    'kayak.com', 'priceline.com', 'marriott.com', 'hilton.com', 'hyatt.com',
    
    // Transportation
    'uber.com', 'lyft.com', 'delta.com', 'united.com', 'southwest.com',
    'americanairlines.com', 'jetblue.com', 'hertz.com', 'enterprise.com',
    
    // Tech & streaming
    'spotify.com', 'youtube.com', 'twitch.tv', 'discord.com', 'slack.com',
    'zoom.us', 'dropbox.com', 'github.com', 'gitlab.com', 'bitbucket.org',
    
    // Design & creative
    'figma.com', 'behance.net', 'dribbble.com', 'canva.com', 'adobe.com',
    'sketch.com', 'invisionapp.com', 'framer.com', 'webflow.com', 'wordpress.com',
    
    // Social media & content
    'linkedin.com', 'twitter.com', 'facebook.com', 'instagram.com', 'tiktok.com',
    'pinterest.com', 'reddit.com', 'medium.com', 'substack.com', 'notion.so',
    
    // Development & tech
    'stackoverflow.com', 'developer.mozilla.org', 'w3schools.com', 'codepen.io',
    'jsfiddle.net', 'codesandbox.io', 'replit.com', 'vercel.com', 'netlify.com',
    
    // News & media
    'cnn.com', 'bbc.com', 'nytimes.com', 'washingtonpost.com', 'reuters.com',
    'bloomberg.com', 'forbes.com', 'techcrunch.com', 'theverge.com', 'wired.com',
    
    // Education
    'coursera.org', 'udemy.com', 'edx.org', 'khanacademy.org', 'codecademy.com',
    'udacity.com', 'pluralsight.com', 'skillshare.com', 'masterclass.com',
    
    // Business & productivity
    'salesforce.com', 'hubspot.com', 'mailchimp.com', 'constant-contact.com',
    'monday.com', 'asana.com', 'trello.com', 'atlassian.com', 'zendesk.com',
    
    // Common business domains
    'stripe.com', 'paypal.com', 'square.com', 'quickbooks.com', 'freshbooks.com',
    'xero.com', 'mint.com', 'creditkarma.com', 'nerdwallet.com',
    
    // Government and official sites
    'gov.uk', 'usa.gov', 'canada.ca', 'europa.eu', 'who.int', 'unesco.org'
  ],
  USER_AGENT: 'Mozilla/5.0 (compatible; Design-Analysis-Bot/1.0)',
  MAX_REDIRECTS: 3
};

function isAllowedDomain(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    // Check if the domain or any parent domain is in the allowed list
    return WEBSITE_CONFIG.ALLOWED_DOMAINS.some(allowedDomain => {
      return hostname === allowedDomain || hostname.endsWith('.' + allowedDomain);
    });
  } catch {
    return false;
  }
}

function extractTextFromHtml(html: string): string {
  // Remove script and style elements and their content
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  
  // Remove HTML tags but keep the text content
  text = text.replace(/<[^>]*>/g, ' ');
  
  // Decode HTML entities
  text = text.replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'");
  
  // Clean up whitespace
  text = text.replace(/\s+/g, ' ').trim();
  
  // Limit content size
  if (text.length > WEBSITE_CONFIG.MAX_CONTENT_SIZE) {
    text = text.substring(0, WEBSITE_CONFIG.MAX_CONTENT_SIZE) + '... [Content truncated due to size limit]';
  }
  
  return text;
}

export async function fetchWebsiteContent(url: string): Promise<string | null> {
  try {
    console.log('=== FETCHING WEBSITE CONTENT ===');
    console.log('URL:', url);
    
    // Validate URL format
    let urlObj;
    try {
      urlObj = new URL(url);
    } catch {
      console.error('Invalid URL format');
      return `[Website URL: ${url} - Invalid URL format. Please provide a valid website URL starting with http:// or https://]`;
    }
    
    // Security checks
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      console.error('Unsupported protocol:', urlObj.protocol);
      return `[Website URL: ${url} - Only HTTP and HTTPS protocols are supported for security reasons.]`;
    }
    
    // Check if domain is allowed
    if (!isAllowedDomain(url)) {
      const hostname = urlObj.hostname;
      console.log('Domain not in allowlist:', hostname);
      
      // Provide more helpful feedback for unsupported domains
      const supportedExamples = [
        'amazon.com', 'apple.com', 'figma.com', 'behance.net', 'dribbble.com',
        'github.com', 'linkedin.com', 'medium.com', 'airbnb.com', 'netflix.com'
      ];
      
      return `[Website Analysis Unavailable]

The domain "${hostname}" is not currently supported for automated content analysis. 

Our system supports major platforms including:
• E-commerce sites (Amazon, eBay, Shopify stores)
• Design portfolios (Behance, Dribbble, Figma)
• Popular brands and services (Apple, Google, Nike, Airbnb)
• Development platforms (GitHub, CodePen, Vercel)
• Business sites (Salesforce, HubSpot, Slack)
• Content platforms (Medium, YouTube, LinkedIn)

Alternative options:
1. Take screenshots of the specific pages you want analyzed
2. If this is a business website, provide the company name for general analysis
3. Share specific design elements or components as images

Would you like to upload screenshots of the website instead?`;
    }
    
    console.log('Domain allowed, proceeding with fetch');
    
    // Set up timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.log('Website fetch timeout');
    }, WEBSITE_CONFIG.TIMEOUT_MS);
    
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': WEBSITE_CONFIG.USER_AGENT,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Cache-Control': 'no-cache'
        },
        redirect: 'follow'
      });
      
      clearTimeout(timeoutId);
      
      console.log('Website fetch response:', {
        status: response.status,
        statusText: response.statusText,
        contentType: response.headers.get('content-type')
      });
      
      if (!response.ok) {
        console.error('Website fetch failed:', response.status, response.statusText);
        
        // Provide specific error messages based on status codes
        switch (response.status) {
          case 403:
            return `[Website Access Blocked]

The website "${urlObj.hostname}" is blocking automated access (HTTP 403 Forbidden). This is common for sites with strict bot protection.

Suggested alternatives:
• Take screenshots of the pages you want analyzed
• Look for a public API or developer documentation
• Try accessing a different page on the same domain
• Upload images of the specific design elements instead`;
          
          case 404:
            return `[Page Not Found]

The URL "${url}" could not be found (HTTP 404). Please check:
• The URL is correct and complete
• The page hasn't been moved or deleted
• Try accessing the main website domain first

You can also upload screenshots of the page if you have access to it.`;
          
          case 429:
            return `[Rate Limited]

The website "${urlObj.hostname}" is currently rate-limiting requests. Please try again later or upload screenshots of the content you want analyzed.`;
          
          default:
            return `[Website Unavailable]

Could not access "${url}" (HTTP ${response.status}). The website may be:
• Temporarily down for maintenance
• Experiencing high traffic
• Blocking automated requests
• Requiring authentication

Please try uploading screenshots of the content you'd like me to analyze instead.`;
        }
      }
      
      const contentType = response.headers.get('content-type') || '';
      
      if (!contentType.includes('text/html')) {
        console.log('Non-HTML content type:', contentType);
        return `[Non-Web Content]

The URL "${url}" points to a ${contentType.split(';')[0]} file rather than a webpage. 

For design analysis, please provide:
• Direct links to web pages (HTML content)
• Screenshots of the designs you want analyzed
• Image files of the design elements

If this should be a webpage, please check the URL is correct.`;
      }
      
      const html = await response.text();
      
      if (html.length === 0) {
        console.error('Empty HTML response');
        return `[Empty Content]

The webpage at "${url}" appears to be empty or failed to load properly. This could be due to:
• JavaScript-heavy content that requires browser rendering
• Server-side issues
• Content loading errors

Please try uploading screenshots of the page content instead.`;
      }
      
      const extractedText = extractTextFromHtml(html);
      
      if (extractedText.length < 100) {
        console.log('Very little text content extracted');
        return `[Limited Content Available]

The webpage at "${url}" has very little readable text content (${extractedText.length} characters). This often happens with:
• Image-heavy or visual-focused pages
• Single-page applications with dynamic content
• Pages that rely heavily on JavaScript

Extracted content preview: "${extractedText.substring(0, 200)}..."

For better analysis, please upload screenshots of the specific design elements you'd like me to analyze.`;
      }
      
      console.log('Website content extracted successfully:', {
        originalSize: html.length,
        extractedSize: extractedText.length,
        url: url
      });
      
      // Add context header to help with analysis
      const contextHeader = `[Website Content from ${urlObj.hostname}]\n\n`;
      return contextHeader + extractedText;
      
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.error('Website fetch timed out');
        return `[Request Timeout]

The request to "${url}" timed out after ${WEBSITE_CONFIG.TIMEOUT_MS/1000} seconds. This could be due to:
• Slow server response
• Network connectivity issues
• Website performance problems

Please try:
• Accessing a different page on the same site
• Uploading screenshots of the content instead
• Trying again later`;
      } else {
        console.error('Website fetch error:', fetchError);
        return `[Network Error]

Could not connect to "${url}" due to a network error. This might be caused by:
• DNS resolution issues
• Server connectivity problems
• Network firewall restrictions

Please verify the URL is accessible and try uploading screenshots of the content you'd like me to analyze.`;
      }
    }
    
  } catch (error) {
    console.error('Error fetching website content:', error);
    return `[Analysis Error]

An unexpected error occurred while trying to access "${url}". 

To proceed with your design analysis, please:
• Upload screenshots of the specific pages or elements
• Verify the URL is correct and publicly accessible
• Try a different URL from the same website

This will ensure I can provide you with detailed design insights.`;
  }
}
