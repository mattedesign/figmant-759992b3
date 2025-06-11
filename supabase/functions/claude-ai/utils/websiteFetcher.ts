const WEBSITE_CONFIG = {
  MAX_CONTENT_SIZE: 50000, // 50KB limit for extracted text
  TIMEOUT_MS: 15000, // 15 second timeout
  ALLOWED_DOMAINS: [
    // Popular business/design domains - can be expanded
    'amazon.com', 'ebay.com', 'etsy.com', 'shopify.com', 'wix.com', 'squarespace.com',
    'nike.com', 'adidas.com', 'apple.com', 'google.com', 'microsoft.com', 'netflix.com',
    'airbnb.com', 'uber.com', 'spotify.com', 'figma.com', 'behance.net', 'dribbble.com',
    'github.com', 'stackoverflow.com', 'medium.com', 'linkedin.com', 'twitter.com',
    'facebook.com', 'instagram.com', 'youtube.com', 'tiktok.com', 'pinterest.com'
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
      return null;
    }
    
    // Security checks
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      console.error('Unsupported protocol:', urlObj.protocol);
      return null;
    }
    
    // Check if domain is allowed
    if (!isAllowedDomain(url)) {
      console.log('Domain not in allowlist:', urlObj.hostname);
      return `[Website URL: ${url} - This domain is not currently supported for content analysis. Supported domains include major e-commerce, design, and business websites. Please provide screenshots of the specific pages you'd like me to analyze.]`;
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
        return `[Website URL: ${url} - Could not access this website (HTTP ${response.status}). The site may be down, require authentication, or block automated access. Please provide screenshots of the specific pages you'd like me to analyze.]`;
      }
      
      const contentType = response.headers.get('content-type') || '';
      
      if (!contentType.includes('text/html')) {
        console.log('Non-HTML content type:', contentType);
        return `[Website URL: ${url} - This URL does not point to a web page that can be analyzed. Please provide the actual webpage URL or screenshots.]`;
      }
      
      const html = await response.text();
      
      if (html.length === 0) {
        console.error('Empty HTML response');
        return `[Website URL: ${url} - The webpage appears to be empty or could not be loaded properly.]`;
      }
      
      const extractedText = extractTextFromHtml(html);
      
      if (extractedText.length < 50) {
        console.log('Very little text content extracted');
        return `[Website URL: ${url} - This webpage has very little readable text content. It may be heavily image-based or use dynamic content loading. Please provide screenshots of the specific elements you'd like me to analyze.]`;
      }
      
      console.log('Website content extracted successfully:', {
        originalSize: html.length,
        extractedSize: extractedText.length,
        url: url
      });
      
      return extractedText;
      
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.error('Website fetch timed out');
        return `[Website URL: ${url} - Request timed out. The website may be slow to respond or have loading issues. Please try again later or provide screenshots.]`;
      } else {
        console.error('Website fetch error:', fetchError);
        return `[Website URL: ${url} - Could not access this website due to a network error. Please check the URL and try again, or provide screenshots of the pages you'd like me to analyze.]`;
      }
    }
    
  } catch (error) {
    console.error('Error fetching website content:', error);
    return `[Website URL: ${url} - An error occurred while trying to access this website. Please verify the URL is correct or provide screenshots of the specific pages you'd like me to analyze.]`;
  }
}
