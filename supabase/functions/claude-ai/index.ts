
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
      systemPromptLength: settings.claude_system_prompt?.length || 0,
      hasApiKey: false // Don't log the actual API key
    });

    // Get the API key from admin settings
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
      model: settings.claude_model || 'claude-3-5-haiku-20241022',
      systemPrompt: settings.claude_system_prompt || 'You are a UX analytics expert that provides insights on user behavior and experience patterns. When analyzing designs or images, provide detailed feedback on usability, visual hierarchy, accessibility, and conversion optimization opportunities.'
    };
  } catch (error) {
    console.error('Error getting Claude settings:', error);
    throw error;
  }
}

async function testStorageAccess(supabase: any): Promise<void> {
  console.log('=== TESTING STORAGE ACCESS ===');
  try {
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    console.log('Available buckets:', buckets?.map(b => b.name) || []);
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
    }
    
    // Test design-uploads bucket specifically
    const { data: files, error: filesError } = await supabase.storage
      .from('design-uploads')
      .list('', { limit: 5 });
    
    console.log('Recent files in design-uploads bucket:', files?.length || 0);
    if (filesError) {
      console.error('Error listing files in design-uploads:', filesError);
    }
  } catch (error) {
    console.error('Storage access test failed:', error);
  }
  console.log('=== STORAGE ACCESS TEST END ===');
}

async function downloadImageFromStorage(supabase: any, filePath: string): Promise<{ base64: string; mimeType: string } | null> {
  try {
    console.log('=== DOWNLOADING IMAGE FROM STORAGE ===');
    console.log('Attempting to download:', filePath);
    
    // Create a signed URL that's valid for 1 hour
    const { data: urlData, error: urlError } = await supabase.storage
      .from('design-uploads')
      .createSignedUrl(filePath, 3600);

    if (urlError || !urlData?.signedUrl) {
      console.error('Failed to create signed URL:', urlError);
      return null;
    }

    console.log('Signed URL created successfully, length:', urlData.signedUrl.length);
    
    // Download the file using the signed URL
    const response = await fetch(urlData.signedUrl);
    
    console.log('Download response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    if (!response.ok) {
      console.error('Failed to download file:', response.status, response.statusText);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    
    // Determine MIME type from file extension or response headers
    const contentType = response.headers.get('content-type') || 'image/png';
    
    console.log('Image downloaded successfully:', {
      sizeBytes: arrayBuffer.byteLength,
      mimeType: contentType,
      base64Length: base64.length
    });
    
    console.log('=== DOWNLOAD COMPLETE ===');
    return { base64, mimeType: contentType };
  } catch (error) {
    console.error('Error downloading image from storage:', error);
    return null;
  }
}

async function downloadImageFromUrl(url: string): Promise<{ base64: string; mimeType: string } | null> {
  try {
    console.log('=== DOWNLOADING IMAGE FROM URL ===');
    console.log('Downloading from URL:', url);
    
    const response = await fetch(url);
    
    console.log('URL download response:', {
      status: response.status,
      statusText: response.statusText,
      contentType: response.headers.get('content-type')
    });
    
    if (!response.ok) {
      console.error('Failed to download from URL:', response.status, response.statusText);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    const contentType = response.headers.get('content-type') || 'image/png';
    
    console.log('URL image downloaded successfully:', {
      sizeBytes: arrayBuffer.byteLength,
      mimeType: contentType,
      base64Length: base64.length
    });
    
    console.log('=== URL DOWNLOAD COMPLETE ===');
    return { base64, mimeType: contentType };
  } catch (error) {
    console.error('Error downloading image from URL:', error);
    return null;
  }
}

async function processAttachmentsForVision(supabase: any, attachments: AttachmentData[]): Promise<Array<{ type: 'text' | 'image'; text?: string; source?: any }>> {
  console.log('=== PROCESSING ATTACHMENTS FOR VISION ===');
  console.log('Processing', attachments.length, 'attachments');
  
  const contentItems: Array<{ type: 'text' | 'image'; text?: string; source?: any }> = [];
  
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
      
      // Check if it's an image file
      const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(attachment.name);
      console.log('Is image file:', isImage);
      
      if (isImage) {
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
          console.log('Successfully added image to vision analysis:', attachment.name);
        } else {
          // If image download failed, add a text description
          contentItems.push({
            type: 'text',
            text: `[Image attachment: ${attachment.name} - Could not be loaded for analysis]`
          });
          console.log('Failed to load image, added text fallback:', attachment.name);
        }
      } else {
        // Non-image file, add as text reference
        contentItems.push({
          type: 'text',
          text: `[File attachment: ${attachment.name}]`
        });
        console.log('Added non-image file as text reference:', attachment.name);
      }
    } else if (attachment.type === 'url' && attachment.url) {
      console.log('Processing URL attachment:', attachment.url);
      
      // URL attachment - try to determine if it's an image
      const isImageUrl = /\.(jpg|jpeg|png|gif|webp)$/i.test(attachment.url) || 
                        attachment.url.includes('image') ||
                        attachment.url.includes('img');
      
      console.log('Is image URL:', isImageUrl);
      
      if (isImageUrl) {
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
          console.log('Successfully added URL image to vision analysis:', attachment.url);
        } else {
          contentItems.push({
            type: 'text',
            text: `[Image URL: ${attachment.url} - Could not be loaded for analysis]`
          });
          console.log('Failed to load URL image, added text fallback:', attachment.url);
        }
      } else {
        // Non-image URL, add as text reference
        contentItems.push({
          type: 'text',
          text: `[Website URL: ${attachment.url}]`
        });
        console.log('Added non-image URL as text reference:', attachment.url);
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
    textItems: contentItems.filter(item => item.type === 'text').length
  });
  
  console.log('=== VISION PROCESSING END ===');
  return contentItems;
}

serve(async (req) => {
  console.log('=== CLAUDE AI FUNCTION START ===');
  console.log('Request method:', req.method);

  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    console.log('Raw request body:', JSON.stringify(requestBody, null, 2));
    
    // More flexible parameter extraction
    const message = requestBody.message || requestBody.prompt || '';
    const attachments = requestBody.attachments || [];
    const uploadIds = requestBody.uploadIds || [];
    
    console.log('Extracted parameters:', { 
      messageLength: message?.length || 0, 
      attachmentsCount: attachments.length,
      uploadIdsCount: uploadIds.length,
      messagePreview: message ? message.substring(0, 100) + '...' : 'No message',
      attachmentSummary: attachments.map((att: any) => ({
        type: att.type,
        name: att.name,
        hasUploadPath: !!att.uploadPath,
        hasUrl: !!att.url
      }))
    });

    // Validate that we have a message
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      console.error('Invalid message received:', { message, type: typeof message });
      throw new Error('Message is required and must be a non-empty string');
    }

    // Environment check
    console.log('Environment check:', {
      hasSupabaseUrl: !!Deno.env.get('SUPABASE_URL'),
      hasSupabaseServiceKey: !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    });

    // Get Supabase credentials
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration not found');
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log('Supabase client initialized');

    // Test storage access
    await testStorageAccess(supabase);
    
    // Get Claude settings from admin settings
    console.log('Fetching Claude settings from admin settings...');
    const claudeSettings = await getClaudeSettings(supabase);
    
    // Process attachments for vision analysis
    console.log('Starting attachment processing...');
    const visionContent = await processAttachmentsForVision(supabase, attachments);
    
    // Build the message content - simple string for text-only, array for mixed content
    let messageContent: string | Array<{ type: 'text' | 'image'; text?: string; source?: any }>;
    
    if (visionContent.length === 0) {
      // Simple text-only message
      messageContent = message;
      console.log('Using simple text message format');
    } else {
      // Mixed content with attachments
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

    // Prepare the messages for Claude
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

    // Call Claude API
    const claudePayload = {
      model: claudeSettings.model,
      max_tokens: 4000,
      system: claudeSettings.systemPrompt,
      messages: messages
    };

    console.log('Claude API payload prepared:', {
      model: claudePayload.model,
      maxTokens: claudePayload.max_tokens,
      systemPromptLength: claudePayload.system.length,
      messagesCount: claudePayload.messages.length,
      messageContentType: typeof claudePayload.messages[0].content
    });

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
      throw new Error(`Claude API error: ${claudeResponse.status} - ${errorData}`);
    }

    const claudeData = await claudeResponse.json();
    console.log('Claude API response data:', {
      hasContent: !!claudeData.content,
      contentLength: claudeData.content?.length || 0,
      contentType: claudeData.content?.[0]?.type,
      usage: claudeData.usage
    });

    // Extract the text content from Claude's response
    const analysis = claudeData.content?.[0]?.text || 'No analysis available';

    console.log('Analysis extracted:', {
      analysisLength: analysis.length,
      analysisPreview: analysis.substring(0, 100) + '...'
    });

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
        messageLength: message.length
      }
    };

    console.log('Sending successful response:', response);
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
    
    return new Response(
      JSON.stringify({
        error: error.message || 'An unexpected error occurred',
        success: false,
        debugInfo: {
          errorType: error.name,
          timestamp: new Date().toISOString(),
          settingsSource: 'admin_settings'
        }
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
