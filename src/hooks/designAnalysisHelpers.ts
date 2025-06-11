
import { supabase } from '@/integrations/supabase/client';
import { DesignUseCase } from '@/types/design';

export const triggerAnalysis = async (uploadId: string, useCase: DesignUseCase) => {
  console.log('Triggering analysis for upload:', uploadId);
  
  try {
    // Update upload status to processing
    await supabase
      .from('design_uploads')
      .update({ status: 'processing' })
      .eq('id', uploadId);

    console.log('Status updated to processing');

    // Get the uploaded design details
    const { data: upload } = await supabase
      .from('design_uploads')
      .select('*')
      .eq('id', uploadId)
      .single();

    if (!upload) throw new Error('Upload not found');

    console.log('Upload details:', { 
      source_type: upload.source_type, 
      file_path: upload.file_path, 
      source_url: upload.source_url 
    });

    let analysisTarget = '';

    if (upload.source_type === 'file') {
      // Handle file analysis with better error handling
      console.log('Getting signed URL for file:', upload.file_path);

      // Check if file exists first
      const { data: fileExists } = await supabase.storage
        .from('design-uploads')
        .list(upload.file_path.split('/')[0], {
          search: upload.file_path.split('/')[1]
        });

      if (!fileExists || fileExists.length === 0) {
        throw new Error('File not found in storage');
      }

      const { data: urlData, error: urlError } = await supabase.storage
        .from('design-uploads')
        .createSignedUrl(upload.file_path, 3600);

      if (urlError || !urlData?.signedUrl) {
        console.error('Failed to get signed URL:', urlError);
        throw new Error(`Failed to get file URL: ${urlError?.message || 'Unknown error'}`);
      }

      analysisTarget = `Please analyze the design image at this URL: ${urlData.signedUrl}`;
    } else if (upload.source_type === 'url') {
      // Handle URL analysis with validation
      try {
        new URL(upload.source_url);
        analysisTarget = `Please analyze the website design at this URL: ${upload.source_url}`;
      } catch {
        throw new Error('Invalid URL format');
      }
    } else {
      throw new Error('Invalid source type');
    }

    console.log('Calling Claude AI for analysis...');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Call Claude AI for analysis with enhanced prompt
    const { data: analysisResponse, error: claudeError } = await supabase.functions.invoke('claude-ai', {
      body: {
        prompt: `${useCase.prompt_template}\n\n${analysisTarget}`,
        userId: user.id,
        requestType: 'design_analysis'
      }
    });

    if (claudeError) {
      console.error('Claude AI error:', claudeError);
      throw new Error(`Claude AI analysis failed: ${claudeError.message}`);
    }

    console.log('Claude analysis completed, saving results...');

    // Save analysis results
    const { data: analysis, error: saveError } = await supabase
      .from('design_analysis')
      .insert({
        design_upload_id: uploadId,
        user_id: user.id,
        analysis_type: useCase.name,
        prompt_used: useCase.prompt_template,
        analysis_results: { response: analysisResponse.response },
        confidence_score: 0.8
      })
      .select()
      .single();

    if (saveError) {
      console.error('Failed to save analysis:', saveError);
      throw new Error(`Database error: ${saveError.message}`);
    }

    console.log('Analysis saved successfully:', analysis.id);

    // Update upload status to completed
    await supabase
      .from('design_uploads')
      .update({ status: 'completed' })
      .eq('id', uploadId);

    console.log('Upload status updated to completed');
    return analysis;

  } catch (error) {
    console.error('Analysis failed:', error);
    
    // Update status to failed
    await supabase
      .from('design_uploads')
      .update({ 
        status: 'failed',
        updated_at: new Date().toISOString()
      })
      .eq('id', uploadId);

    throw error;
  }
};

export const retryFailedAnalysis = async (uploadId: string) => {
  console.log('Retrying failed analysis for upload:', uploadId);
  
  // Get the upload details
  const { data: upload } = await supabase
    .from('design_uploads')
    .select('*')
    .eq('id', uploadId)
    .single();

  if (!upload) {
    throw new Error('Upload not found');
  }

  // Get the use case details
  const { data: useCase } = await supabase
    .from('design_use_cases')
    .select('*')
    .eq('id', upload.use_case)
    .single();

  if (!useCase) {
    throw new Error('Use case not found');
  }

  // Reset status to pending before retrying
  await supabase
    .from('design_uploads')
    .update({ status: 'pending' })
    .eq('id', uploadId);

  // Trigger analysis again
  return await triggerAnalysis(uploadId, useCase);
};
