
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string | Array<{
    type: 'text' | 'image';
    text?: string;
    source?: {
      type: 'base64';
      media_type: string;
      data: string;
    };
  }>;
}

interface AttachmentData {
  type: 'file' | 'url';
  name: string;
  file?: File;
  url?: string;
  uploadPath?: string;
}

async function logClaudeUsage(
  supabase: any, 
  userId: string, 
  requestType: string,
  success: boolean,
  tokensUsed?: number,
  costUsd?: number,
  responseTimeMs?: number,
  errorMessage?: string,
  modelUsed?: string
) {
  try {
    const { error } = await supabase
      .from('claude_usage_logs')
      .insert({
        user_id: userId,
        request_type: requestType,
        success,
        tokens_used: tokensUsed,
        cost_usd: costUsd,
        response_time_ms: responseTimeMs,
        error_message: errorMessage,
        model_used: modelUsed
      });

    if (error) {
      console.error('Failed to log Claude usage:', error);
    }
  } catch (error) {
    console.error('Error logging Claude usage:', error);
  }
}

async function getClaudeSettings(supabase: any): Promise<{ apiKey: string; model: string; systemPrompt: string }> {
  console.log('=== FETCHING CLAUDE SETTINGS FROM ADMIN SETTINGS ===');
  
  try {
    const { data: settingsData, error: settingsError } = await supabase
      .rpc('get_claude_settings');

    if (settingsError) {
      console.error('Failed to get Claude settings:', settingsError);
      throw new Error('Failed to get Claude AI configuration');
    }

    const settings = Array.isArray(settingsData) ? settingsData[0] : settingsData;
    
    if (!settings?.claude_ai_enabled) {
      console.error('Claude AI is not enabled in admin settings');
      throw new Error('Claude AI is not enabled. Please contact your administrator.');
    }

    console.log('Claude settings retrieved:', {
      enabled: settings.claude_ai_enabled,
      model: settings.claude_model,
      systemPromptLength: settings.claude_system_prompt?.length || 0
    });

    const { data: apiKeyData, error: apiKeyError } = await supabase
      .from('admin_settings')
      .select('setting_value')
      .eq('setting_key', 'claude_api_key')
      .single();

    if (apiKeyError || !apiKeyData) {
      console.error('Failed to get Claude API key from admin settings:', apiKeyError);
      throw new Error('Claude API key not configured in admin settings');
    }

    const apiKey = apiKeyData.setting_value?.value;
    if (!apiKey) {
      console.error('Claude API key is empty in admin settings');
      throw new Error('Claude API key not set in admin settings');
    }

    console.log('Claude API key retrieved from admin settings successfully');

    return {
      apiKey,
      model: settings.claude_model || 'claude-sonnet-4-20250514',
      systemPrompt: settings.claude_system_prompt || 'You are a UX analytics expert that provides insights on user behavior and experience patterns. When analyzing designs or images, provide detailed feedback on usability, visual hierarchy, accessibility, and conversion optimization opportunities.'
    };
  } catch (error) {
    console.error('Error getting Claude settings:', error);
    throw error;
  }
}

async function verifyStorageBucket(supabase: any): Promise<boolean> {
  try {
    console.log('=== VERIFYING STORAGE BUCKET ===');
    
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      return false;
    }
    
    const designUploadsBucket = buckets?.find(bucket => bucket.name === 'design-uploads');
    
    if (!designUploadsBucket) {
      console.error('design-uploads bucket not found');
      return false;
    }
    
    console.log('Storage bucket verified successfully:', designUploadsBucket);
    return true;
  } catch (error) {
    console.error('Storage bucket verification failed:', error);
    return false;
  }
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function downloadImageFromStorage(supabase: any, filePath: string): Promise<{ base64: string; mimeType: string } | null> {
  const maxRetries = 2;
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      console.log(`=== DOWNLOADING IMAGE FROM STORAGE (Attempt ${attempt + 1}/${maxRetries}) ===`);
      console.log('File path:', filePath);
      
      // Verify bucket exists first
      const bucketExists = await verifyStorageBucket(supabase);
      if (!bucketExists) {
        console.error('Storage bucket verification failed');
        throw new Error('Storage bucket not accessible');
      }
      
      // Create a signed URL with appropriate timeout
      const { data: urlData, error: urlError } = await supabase.storage
        .from('design-uploads')
        .createSignedUrl(filePath, 300); // 5 minutes

      if (urlError || !urlData?.signedUrl) {
        console.error('Failed to create signed URL:', urlError);
        throw new Error(`Signed URL creation failed: ${urlError?.message || 'Unknown error'}`);
      }

      console.log('Signed URL created successfully');
      
      // Download with enhanced error handling and timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.log('Download timeout after 20 seconds');
      }, 20000);
      
      try {
        const response = await fetch(urlData.signedUrl, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Supabase-Edge-Function'
          }
        });
        
        clearTimeout(timeoutId);
        
        console.log('Download response:', {
          status: response.status,
          statusText: response.statusText,
          contentType: response.headers.get('content-type'),
          contentLength: response.headers.get('content-length')
        });
        
        if (!response.ok) {
          console.error(`Download failed with status ${response.status}: ${response.statusText}`);
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type') || 'image/png';
        
        // Enhanced content type validation
        if (!contentType.startsWith('image/')) {
          console.error('Downloaded file is not an image:', contentType);
          throw new Error(`Invalid content type: ${contentType}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        
        // Enhanced size validation
        const maxSize = 20 * 1024 * 1024; // 20MB limit
        if (arrayBuffer.byteLength > maxSize) {
          console.error('File too large:', arrayBuffer.byteLength);
          throw new Error(`File size ${Math.round(arrayBuffer.byteLength / 1024 / 1024)}MB exceeds 20MB limit`);
        }
        
        if (arrayBuffer.byteLength === 0) {
          console.error('Downloaded file is empty');
          throw new Error('Downloaded file is empty');
        }
        
        // Convert to base64 using proper method
        const base64 = arrayBufferToBase64(arrayBuffer);
        
        console.log('Image downloaded and converted successfully:', {
          sizeBytes: arrayBuffer.byteLength,
          mimeType: contentType,
          base64Length: base64.length
        });
        
        console.log('=== DOWNLOAD COMPLETE ===');
        return { base64, mimeType: contentType };
        
      } catch (fetchError) {
        clearTimeout(timeoutId);
        
        if (fetchError.name === 'AbortError') {
          console.error('Download timed out');
          throw new Error('Download timeout - file may be too large or connection is slow');
        } else {
          console.error('Fetch error:', fetchError);
          throw fetchError;
        }
      }
      
    } catch (error) {
      console.error(`Download attempt ${attempt + 1} failed:`, error);
      attempt++;
      
      if (attempt >= maxRetries) {
        console.error('All download attempts failed');
        return null;
      }
      
      // Exponential backoff with jitter
      const backoffMs = Math.min(1000 * Math.pow(2, attempt) + Math.random() * 1000, 5000);
      await new Promise(resolve => setTimeout(resolve, backoffMs));
    }
  }
  
  return null;
}

async function downloadImageFromUrl(url: string): Promise<{ base64: string; mimeType: string } | null> {
  try {
    console.log('=== DOWNLOADING IMAGE FROM URL ===');
    console.log('URL:', url);
    
    // Enhanced URL validation
    let urlObj;
    try {
      urlObj = new URL(url);
    } catch {
      console.error('Invalid URL format');
      return null;
    }
    
    // Basic security check
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      console.error('Unsupported protocol:', urlObj.protocol);
      return null;
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.log('URL download timeout after 15 seconds');
    }, 15000);
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Supabase-Edge-Function',
        'Accept': 'image/*'
      }
    });
    
    clearTimeout(timeoutId);
    
    console.log('URL download response:', {
      status: response.status,
      statusText: response.statusText,
      contentType: response.headers.get('content-type')
    });
    
    if (!response.ok) {
      console.error('Failed to download from URL:', response.status, response.statusText);
      return null;
    }

    const contentType = response.headers.get('content-type') || 'image/png';
    
    if (!contentType.startsWith('image/')) {
      console.error('URL does not point to an image:', contentType);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    
    if (arrayBuffer.byteLength > 20 * 1024 * 1024) {
      console.error('Image too large from URL:', arrayBuffer.byteLength);
      return null;
    }
    
    const base64 = arrayBufferToBase64(arrayBuffer);
    
    console.log('URL image downloaded successfully:', {
      sizeBytes: arrayBuffer.byteLength,
      mimeType: contentType,
      base64Length: base64.length
    });
    
    console.log('=== URL DOWNLOAD COMPLETE ===');
    return { base64, mimeType: contentType };
  } catch (error) {
    console.error('Error downloading image from URL:', error);
    
    if (error.name === 'AbortError') {
      console.error('URL download timed out');
    }
    
    return null;
  }
}

async function processAttachmentsForVision(supabase: any, attachments: AttachmentData[]): Promise<Array<{ type: 'text' | 'image'; text?: string; source?: any }>> {
  console.log('=== PROCESSING ATTACHMENTS FOR VISION ===');
  console.log('Processing', attachments.length, 'attachments');
  
  const contentItems: Array<{ type: 'text' | 'image'; text?: string; source?: any }> = [];
  let successfulImages = 0;
  let failedImages = 0;
  
  for (let i = 0; i < attachments.length; i++) {
    const attachment = attachments[i];
    console.log(`Processing attachment ${i + 1}/${attachments.length}:`, {
      type: attachment.type,
      name: attachment.name,
      hasUploadPath: !!attachment.uploadPath,
      hasUrl: !!attachment.url
    });

    if (attachment.type === 'file' && attachment.uploadPath) {
      console.log('Processing file attachment with upload path:', attachment.uploadPath);
      
      const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(attachment.name);
      console.log('Is image file:', isImage);
      
      if (isImage) {
        try {
          const imageData = await downloadImageFromStorage(supabase, attachment.uploadPath);
          
          if (imageData) {
            contentItems.push({
              type: 'image',
              source: {
                type: 'base64',
                media_type: imageData.mimeType,
                data: imageData.base64
              }
            });
            successfulImages++;
            console.log('Successfully added image to vision analysis:', attachment.name);
          } else {
            failedImages++;
            contentItems.push({
              type: 'text',
              text: `[Image attachment: ${attachment.name} - Failed to load for analysis. The image may be corrupted, too large, or in an unsupported format. Please try uploading a smaller JPEG or PNG file.]`
            });
            console.log('Failed to load image, added detailed error message:', attachment.name);
          }
        } catch (error) {
          failedImages++;
          console.error('Image processing error:', error);
          contentItems.push({
            type: 'text',
            text: `[Image attachment: ${attachment.name} - Processing error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try re-uploading the image.]`
          });
        }
      } else {
        contentItems.push({
          type: 'text',
          text: `[File attachment: ${attachment.name} - Non-image files cannot be analyzed visually. For document analysis, please describe the content or provide screenshots.]`
        });
        console.log('Added non-image file as text reference:', attachment.name);
      }
    } else if (attachment.type === 'url' && attachment.url) {
      console.log('Processing URL attachment:', attachment.url);
      
      const isImageUrl = /\.(jpg|jpeg|png|gif|webp)$/i.test(attachment.url) || 
                        attachment.url.includes('image') ||
                        attachment.url.includes('img');
      
      console.log('Is image URL:', isImageUrl);
      
      if (isImageUrl) {
        try {
          const imageData = await downloadImageFromUrl(attachment.url);
          
          if (imageData) {
            contentItems.push({
              type: 'image',
              source: {
                type: 'base64',
                media_type: imageData.mimeType,
                data: imageData.base64
              }
            });
            successfulImages++;
            console.log('Successfully added URL image to vision analysis:', attachment.url);
          } else {
            failedImages++;
            contentItems.push({
              type: 'text',
              text: `[Image URL: ${attachment.url} - Could not be loaded for analysis. The URL may be inaccessible, the image may be too large, or it may not be a valid image. Please check the URL and try again.]`
            });
            console.log('Failed to load URL image, added detailed error message:', attachment.url);
          }
        } catch (error) {
          failedImages++;
          console.error('URL image processing error:', error);
          contentItems.push({
            type: 'text',
            text: `[Image URL: ${attachment.url} - Processing error: ${error instanceof Error ? error.message : 'Unknown error'}]`
          });
        }
      } else {
        contentItems.push({
          type: 'text',
          text: `[Website URL: ${attachment.url} - For website analysis, I cannot directly access live websites. Please provide screenshots of the specific pages or elements you'd like me to analyze.]`
        });
        console.log('Added enhanced non-image URL guidance:', attachment.url);
      }
    } else {
      console.log('Skipping attachment (no valid path or URL):', {
        type: attachment.type,
        name: attachment.name,
        hasUploadPath: !!attachment.uploadPath,
        hasUrl: !!attachment.url
      });
    }
  }
  
  console.log('Vision processing complete:', {
    totalContentItems: contentItems.length,
    imageItems: contentItems.filter(item => item.type === 'image').length,
    textItems: contentItems.filter(item => item.type === 'text').length,
    successfulImages,
    failedImages
  });
  
  console.log('=== VISION PROCESSING END ===');
  return contentItems;
}

serve(async (req) => {
  console.log('=== CLAUDE AI FUNCTION START ===');
  console.log('Request method:', req.method);
  
  const startTime = Date.now();

  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  let userId: string | null = null;
  let requestType = 'unknown';

  try {
    const requestBody = await req.json();
    console.log('Request received with attachments:', requestBody.attachments?.length || 0);
    
    const message = requestBody.message || requestBody.prompt || '';
    const attachments = requestBody.attachments || [];
    const uploadIds = requestBody.uploadIds || [];
    requestType = requestBody.requestType || 'analysis';
    
    console.log('Extracted parameters:', { 
      messageLength: message?.length || 0, 
      attachmentsCount: attachments.length,
      uploadIdsCount: uploadIds.length,
      requestType
    });

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      console.error('Invalid message received:', { message, type: typeof message });
      throw new Error('Message is required and must be a non-empty string');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration not found');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log('Supabase client initialized');

    const claudeSettings = await getClaudeSettings(supabase);
    
    console.log('Starting enhanced attachment processing...');
    const visionContent = await processAttachmentsForVision(supabase, attachments);
    
    let messageContent: string | Array<{ type: 'text' | 'image'; text?: string; source?: any }>;
    
    if (visionContent.length === 0) {
      messageContent = message;
      console.log('Using simple text message format');
    } else {
      messageContent = [
        { type: 'text', text: message },
        ...visionContent
      ];
      console.log('Using complex message format with attachments');
    }

    console.log('Final message content structure:', {
      isSimpleString: typeof messageContent === 'string',
      hasImages: Array.isArray(messageContent) && messageContent.some(item => item.type === 'image'),
      contentLength: Array.isArray(messageContent) ? messageContent.length : 1
    });

    const messages: ClaudeMessage[] = [
      {
        role: 'user',
        content: messageContent
      }
    ];

    console.log('Sending request to Claude API...', {
      model: claudeSettings.model,
      messageType: typeof messageContent,
      hasImages: Array.isArray(messageContent) && messageContent.some(item => item.type === 'image')
    });

    const claudePayload = {
      model: claudeSettings.model,
      max_tokens: 4000,
      system: claudeSettings.systemPrompt,
      messages: messages
    };

    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeSettings.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(claudePayload)
    });

    console.log('Claude API response received:', {
      status: claudeResponse.status,
      statusText: claudeResponse.statusText,
      ok: claudeResponse.ok
    });

    if (!claudeResponse.ok) {
      const errorData = await claudeResponse.text();
      console.error('Claude API error response:', {
        status: claudeResponse.status,
        statusText: claudeResponse.statusText,
        errorData: errorData
      });

      await logClaudeUsage(
        supabase,
        userId || 'unknown',
        requestType,
        false,
        undefined,
        undefined,
        Date.now() - startTime,
        `Claude API error: ${claudeResponse.status} - ${errorData}`,
        claudeSettings.model
      );

      throw new Error(`Claude API error: ${claudeResponse.status} - ${errorData}`);
    }

    const claudeData = await claudeResponse.json();
    console.log('Claude API response data:', {
      hasContent: !!claudeData.content,
      contentLength: claudeData.content?.length || 0,
      contentType: claudeData.content?.[0]?.type,
      usage: claudeData.usage
    });

    const analysis = claudeData.content?.[0]?.text || 'No analysis available';
    const responseTime = Date.now() - startTime;

    const tokensUsed = claudeData.usage?.input_tokens + claudeData.usage?.output_tokens || 0;
    const estimatedCost = tokensUsed * 0.0001;

    console.log('Analysis extracted:', {
      analysisLength: analysis.length,
      tokensUsed,
      responseTime,
      estimatedCost
    });

    await logClaudeUsage(
      supabase,
      userId || 'system',
      requestType,
      true,
      tokensUsed,
      estimatedCost,
      responseTime,
      undefined,
      claudeSettings.model
    );

    const response = {
      analysis,
      success: true,
      attachmentsProcessed: visionContent.length,
      debugInfo: {
        totalAttachments: attachments.length,
        processedContent: visionContent.length,
        imagesProcessed: visionContent.filter(item => item.type === 'image').length,
        textItemsProcessed: visionContent.filter(item => item.type === 'text').length,
        settingsSource: 'admin_settings',
        model: claudeSettings.model,
        messageReceived: !!message,
        messageLength: message.length,
        tokensUsed,
        responseTimeMs: responseTime,
        estimatedCost,
        enhancedProcessing: true
      }
    };

    console.log('Sending successful response with enhanced processing');
    console.log('=== CLAUDE AI FUNCTION END ===');

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('=== ERROR IN CLAUDE AI FUNCTION ===');
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      
      if (supabaseUrl && supabaseServiceKey) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        await logClaudeUsage(
          supabase,
          userId || 'unknown',
          requestType,
          false,
          undefined,
          undefined,
          Date.now() - startTime,
          error.message,
          undefined
        );
      }
    } catch (logError) {
      console.error('Failed to log error usage:', logError);
    }
    
    return new Response(
      JSON.stringify({
        error: error.message || 'An unexpected error occurred',
        success: false,
        debugInfo: {
          errorType: error.name,
          timestamp: new Date().toISOString(),
          settingsSource: 'admin_settings',
          responseTimeMs: Date.now() - startTime,
          enhancedProcessing: true
        }
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
