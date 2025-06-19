
import { AttachmentData } from './types.ts';
import { arrayBufferToBase64 } from './storage.ts';

export async function processUrlAttachment(attachment: AttachmentData): Promise<Array<{ type: 'text' | 'image'; text?: string; source?: any }>> {
  console.log('=== PROCESSING URL ATTACHMENT ===');
  console.log('URL attachment details:', {
    name: attachment.name,
    url: attachment.url
  });

  if (!attachment.url) {
    return [{
      type: 'text',
      text: `[URL: ${attachment.name} - No URL provided]`
    }];
  }

  try {
    console.log('Fetching website content:', attachment.url);
    
    const response = await fetch(attachment.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; FigmantBot/1.0)'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || '';
    console.log('Website response:', {
      status: response.status,
      contentType,
      url: attachment.url
    });

    // Check if it's an image
    if (contentType.startsWith('image/')) {
      const arrayBuffer = await response.arrayBuffer();
      const base64 = arrayBufferToBase64(arrayBuffer);
      
      return [{
        type: 'image',
        source: {
          type: 'base64',
          media_type: contentType,
          data: base64
        }
      }];
    } else {
      // Assume it's a webpage
      const html = await response.text();
      const cleanText = extractTextFromHTML(html);
      
      return [{
        type: 'text',
        text: `[Website: ${attachment.url}]\n${cleanText.slice(0, 8000)}${cleanText.length > 8000 ? '...' : ''}`
      }];
    }

  } catch (error) {
    console.error('Error fetching URL:', error);
    return [{
      type: 'text',
      text: `[URL: ${attachment.url} - Failed to fetch: ${error.message}]`
    }];
  }
}

function extractTextFromHTML(html: string): string {
  // Remove script and style elements
  let cleanHtml = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  cleanHtml = cleanHtml.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  
  // Remove HTML tags
  cleanHtml = cleanHtml.replace(/<[^>]*>/g, ' ');
  
  // Decode HTML entities
  cleanHtml = cleanHtml.replace(/&amp;/g, '&')
                     .replace(/&lt;/g, '<')
                     .replace(/&gt;/g, '>')
                     .replace(/&quot;/g, '"')
                     .replace(/&#39;/g, "'")
                     .replace(/&nbsp;/g, ' ');
  
  // Clean up whitespace
  cleanHtml = cleanHtml.replace(/\s+/g, ' ').trim();
  
  return cleanHtml;
}
