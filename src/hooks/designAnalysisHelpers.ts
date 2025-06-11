
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
      source_url: upload.source_url,
      analysis_goals: upload.analysis_goals
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

    // Build enhanced prompt with user context
    let enhancedPrompt = useCase.prompt_template;
    
    if (upload.analysis_goals) {
      enhancedPrompt += `\n\nSpecific Analysis Goals & Context: ${upload.analysis_goals}`;
      enhancedPrompt += '\n\nPlease tailor your analysis to address these specific goals and provide insights that directly relate to the user\'s objectives.';
    }

    enhancedPrompt += `\n\n${analysisTarget}`;

    // Call Claude AI for analysis with enhanced prompt
    const { data: analysisResponse, error: claudeError } = await supabase.functions.invoke('claude-ai', {
      body: {
        prompt: enhancedPrompt,
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
        prompt_used: enhancedPrompt,
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

export const triggerBatchAnalysis = async (batchId: string, useCase: DesignUseCase) => {
  console.log('Triggering batch analysis for batch:', batchId);
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get all uploads in the batch
    const { data: uploads } = await supabase
      .from('design_uploads')
      .select('*')
      .eq('batch_id', batchId)
      .eq('status', 'completed');

    if (!uploads || uploads.length === 0) {
      throw new Error('No completed uploads found in batch');
    }

    // Get all individual analyses for this batch
    const analysisPromises = uploads.map(upload => 
      supabase
        .from('design_analysis')
        .select('*')
        .eq('design_upload_id', upload.id)
        .single()
    );

    const analysisResults = await Promise.allSettled(analysisPromises);
    const successfulAnalyses = analysisResults
      .filter(result => result.status === 'fulfilled')
      .map(result => (result as any).value.data)
      .filter(Boolean);

    if (successfulAnalyses.length === 0) {
      throw new Error('No individual analyses found for batch comparison');
    }

    // Create comparative analysis prompt
    const batchPrompt = `
      ${useCase.prompt_template}
      
      BATCH ANALYSIS REQUEST:
      You are analyzing a batch of ${uploads.length} designs for comparative insights.
      
      Please provide:
      1. A comparative analysis highlighting key differences and similarities
      2. Identify the strongest performing design and explain why
      3. Key metrics and patterns across all designs
      4. Actionable recommendations for improvement
      
      Individual Analysis Results:
      ${successfulAnalyses.map((analysis, index) => `
        Design ${index + 1} (${uploads[index]?.file_name}):
        ${analysis.analysis_results?.response}
        ---
      `).join('\n')}
    `;

    // Call Claude AI for batch analysis
    const { data: batchAnalysisResponse, error: claudeError } = await supabase.functions.invoke('claude-ai', {
      body: {
        prompt: batchPrompt,
        userId: user.id,
        requestType: 'batch_design_analysis'
      }
    });

    if (claudeError) {
      console.error('Claude AI batch analysis error:', claudeError);
      throw new Error(`Batch analysis failed: ${claudeError.message}`);
    }

    // Save batch analysis results
    const { data: batchAnalysis, error: saveError } = await supabase
      .from('design_batch_analysis')
      .insert({
        batch_id: batchId,
        user_id: user.id,
        analysis_type: useCase.name,
        prompt_used: batchPrompt,
        analysis_results: { response: batchAnalysisResponse.response },
        confidence_score: 0.85
      })
      .select()
      .single();

    if (saveError) {
      console.error('Failed to save batch analysis:', saveError);
      throw new Error(`Database error: ${saveError.message}`);
    }

    console.log('Batch analysis saved successfully:', batchAnalysis.id);
    return batchAnalysis;

  } catch (error) {
    console.error('Batch analysis failed:', error);
    throw error;
  }
};
