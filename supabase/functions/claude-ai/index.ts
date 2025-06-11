
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

async function downloadImageFromStorage(supabase: any, filePath: string): Promise<{ base64: string; mimeType: string } | null> {
  try {
    console.log('Downloading image from storage:', filePath);
    
    // Create a signed URL that's valid for 1 hour
    const { data: urlData, error: urlError } = await supabase.storage
      .from('design-uploads')
      .createSignedUrl(filePath, 3600);

    if (urlError || !urlData?.signedUrl) {
      console.error('Failed to create signed URL:', urlError);
      return null;
    }

    console.log('Signed URL created, downloading file...');
    
    // Download the file using the signed URL
    const response = await fetch(urlData.signedUrl);
    
    if (!response.ok) {
      console.error('Failed to download file:', response.status, response.statusText);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    
    // Determine MIME type from file extension or response headers
    const contentType = response.headers.get('content-type') || 'image/png';
    
    console.log('Image downloaded successfully, size:', arrayBuffer.byteLength, 'bytes');
    return { base64, mimeType: contentType };
  } catch (error) {
    console.error('Error downloading image from storage:', error);
    return null;
  }
}

async function processAttachmentsForVision(supabase: any, attachments: AttachmentData[]): Promise<Array<{ type: 'text' | 'image'; text?: string; source?: any }>> {
  const contentItems: Array<{ type: 'text' | 'image'; text?: string; source?: any }> = [];
  
  for (const attachment of attachments) {
    if (attachment.type === 'file' && attachment.uploadPath) {
      console.log('Processing file attachment:', attachment.name);
      
      // Check if it's an image file
      const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(attachment.name);
      
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
          console.log('Added image to vision analysis:', attachment.name);
        } else {
          // If image download failed, add a text description
          contentItems.push({
            type: 'text',
            text: `[Image attachment: ${attachment.name} - Could not be loaded for analysis]`
          });
        }
      } else {
        // Non-image file, add as text reference
        contentItems.push({
          type: 'text',
          text: `[File attachment: ${attachment.name}]`
        });
      }
    } else if (attachment.type === 'url' && attachment.url) {
      // URL attachment - try to determine if it's an image
      const isImageUrl = /\.(jpg|jpeg|png|gif|webp)$/i.test(attachment.url) || 
                        attachment.url.includes('image') ||
                        attachment.url.includes('img');
      
      if (isImageUrl) {
        try {
          console.log('Downloading image from URL:', attachment.url);
          const response = await fetch(attachment.url);
          
          if (response.ok) {
            const arrayBuffer = await response.arrayBuffer();
            const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
            const contentType = response.headers.get('content-type') || 'image/png';
            
            contentItems.push({
              type: 'image',
              source: {
                type: 'base64',
                media_type: contentType,
                data: base64
              }
            });
            console.log('Added URL image to vision analysis:', attachment.url);
          } else {
            contentItems.push({
              type: 'text',
              text: `[Image URL: ${attachment.url} - Could not be loaded for analysis]`
            });
          }
        } catch (error) {
          console.error('Error downloading image from URL:', error);
          contentItems.push({
            type: 'text',
            text: `[Image URL: ${attachment.url} - Error loading for analysis]`
          });
        }
      } else {
        // Non-image URL, add as text reference
        contentItems.push({
          type: 'text',
          text: `[Website URL: ${attachment.url}]`
        });
      }
    }
  }
  
  return contentItems;
}

serve(async (req) => {
  console.log('Claude AI function called with method:', req.method);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, attachments = [], uploadIds = [], model, systemPrompt } = await req.json();
    
    console.log('Request data:', { 
      messageLength: message?.length, 
      attachmentsCount: attachments.length,
      uploadIdsCount: uploadIds.length,
      model,
      systemPromptLength: systemPrompt?.length 
    });

    // Get Claude API key from environment
    const claudeApiKey = Deno.env.get('CLAUDE_API_KEY');
    if (!claudeApiKey) {
      throw new Error('Claude API key not configured');
    }

    // Get Supabase credentials
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration not found');
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Process attachments to handle file paths from uploadIds
    const processedAttachments = [...attachments];
    
    // If we have uploadIds, fetch the file paths from the database
    if (uploadIds && uploadIds.length > 0) {
      console.log('Fetching upload paths for IDs:', uploadIds);
      
      const { data: uploads, error: uploadsError } = await supabase
        .from('design_uploads')
        .select('file_path, file_name')
        .in('id', uploadIds);

      if (uploadsError) {
        console.error('Error fetching uploads:', uploadsError);
      } else if (uploads) {
        // Add file paths to attachments
        uploads.forEach((upload, index) => {
          if (upload.file_path) {
            processedAttachments.push({
              type: 'file',
              name: upload.file_name || `Upload ${index + 1}`,
              uploadPath: upload.file_path
            });
          }
        });
      }
    }

    console.log('Processing attachments for vision analysis...');
    
    // Process attachments for vision analysis
    const visionContent = await processAttachmentsForVision(supabase, processedAttachments);
    
    // Build the message content
    const messageContent: Array<{ type: 'text' | 'image'; text?: string; source?: any }> = [
      { type: 'text', text: message },
      ...visionContent
    ];

    // Prepare the messages for Claude
    const messages: ClaudeMessage[] = [
      {
        role: 'user',
        content: messageContent
      }
    ];

    console.log('Sending request to Claude with', messageContent.length, 'content items');
    console.log('Content types:', messageContent.map(item => item.type));

    // Call Claude API
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model || 'claude-3-5-haiku-20241022',
        max_tokens: 4000,
        system: systemPrompt || 'You are a UX analytics expert that provides insights on user behavior and experience patterns. When analyzing designs or images, provide detailed feedback on usability, visual hierarchy, accessibility, and conversion optimization opportunities.',
        messages: messages
      })
    });

    if (!claudeResponse.ok) {
      const errorData = await claudeResponse.text();
      console.error('Claude API error:', claudeResponse.status, errorData);
      throw new Error(`Claude API error: ${claudeResponse.status} - ${errorData}`);
    }

    const claudeData = await claudeResponse.json();
    console.log('Claude response received successfully');

    // Extract the text content from Claude's response
    const analysis = claudeData.content?.[0]?.text || 'No analysis available';

    return new Response(
      JSON.stringify({
        analysis,
        success: true,
        attachmentsProcessed: visionContent.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in Claude AI function:', error);
    
    return new Response(
      JSON.stringify({
        error: error.message || 'An unexpected error occurred',
        success: false
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
