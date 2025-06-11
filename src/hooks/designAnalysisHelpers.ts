
import { supabase } from '@/integrations/supabase/client';
import { DesignUseCase, AnalysisPreferences } from '@/types/design';

export const triggerAnalysis = async (uploadId: string, useCase: DesignUseCase) => {
  console.log('Triggering analysis for upload:', uploadId);
  
  try {
    // Update upload status to processing
    await supabase
      .from('design_uploads')
      .update({ status: 'processing' })
      .eq('id', uploadId);

    console.log('Status updated to processing');

    // Get the uploaded design details and context files
    const { data: upload } = await supabase
      .from('design_uploads')
      .select('*')
      .eq('id', uploadId)
      .single();

    if (!upload) throw new Error('Upload not found');

    // Parse analysis preferences safely
    const analysisPreferences = upload.analysis_preferences as AnalysisPreferences | null;

    // Get context files if context integration is enabled
    let contextContent = '';
    if (analysisPreferences?.context_integration) {
      const { data: contextFiles } = await supabase
        .from('design_context_files')
        .select('*')
        .eq('upload_id', uploadId);

      if (contextFiles && contextFiles.length > 0) {
        console.log('Found context files:', contextFiles.length);
        contextContent = '\n\nAdditional Context Files:\n';
        
        for (const contextFile of contextFiles) {
          contextContent += `\n--- ${contextFile.file_name} ---\n`;
          if (contextFile.content_preview) {
            contextContent += contextFile.content_preview + '\n';
          } else {
            contextContent += `[File: ${contextFile.file_name}, Type: ${contextFile.file_type}]\n`;
          }
        }
      }
    }

    console.log('Upload details:', { 
      source_type: upload.source_type, 
      file_path: upload.file_path, 
      source_url: upload.source_url,
      analysis_goals: upload.analysis_goals,
      has_context: contextContent.length > 0
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

    // Build enhanced prompt with user context and analysis preferences
    let enhancedPrompt = useCase.prompt_template;
    
    // Add analysis depth preference
    const analysisDepth = analysisPreferences?.analysis_depth || 'detailed';
    if (analysisDepth === 'comprehensive') {
      enhancedPrompt += '\n\nPlease provide a comprehensive analysis with detailed explanations, multiple perspectives, and thorough recommendations.';
    } else if (analysisDepth === 'basic') {
      enhancedPrompt += '\n\nPlease provide a concise, focused analysis highlighting the most critical points.';
    }
    
    if (upload.analysis_goals) {
      enhancedPrompt += `\n\nSpecific Analysis Goals & Context: ${upload.analysis_goals}`;
      enhancedPrompt += '\n\nPlease tailor your analysis to address these specific goals and provide insights that directly relate to the user\'s objectives.';
    }

    // Add context files content if available
    if (contextContent) {
      enhancedPrompt += contextContent;
      enhancedPrompt += '\n\nPlease incorporate insights from the provided context files into your analysis where relevant.';
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

    // Get context files for the batch
    let batchContextContent = '';
    const { data: contextFiles } = await supabase
      .from('design_context_files')
      .select('*')
      .in('upload_id', uploads.map(u => u.id));

    if (contextFiles && contextFiles.length > 0) {
      console.log('Found batch context files:', contextFiles.length);
      batchContextContent = '\n\nBatch Context Files:\n';
      
      for (const contextFile of contextFiles) {
        batchContextContent += `\n--- ${contextFile.file_name} ---\n`;
        if (contextFile.content_preview) {
          batchContextContent += contextFile.content_preview + '\n';
        } else {
          batchContextContent += `[File: ${contextFile.file_name}, Type: ${contextFile.file_type}]\n`;
        }
      }
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

    // Create comparative analysis prompt with context
    const batchPrompt = `
      ${useCase.prompt_template}
      
      COMPARATIVE BATCH ANALYSIS REQUEST:
      You are analyzing a batch of ${uploads.length} designs for comprehensive comparative insights.
      
      Please provide:
      1. A detailed comparative analysis highlighting key differences, similarities, and patterns
      2. Identify the strongest performing design(s) and explain why with specific criteria
      3. Key metrics, trends, and insights across all designs
      4. Actionable recommendations for improvement and optimization
      5. Best practices identified from the comparison
      
      ${batchContextContent}
      
      Individual Analysis Results:
      ${successfulAnalyses.map((analysis, index) => `
        Design ${index + 1} (${uploads[index]?.file_name}):
        ${analysis.analysis_results?.response}
        ---
      `).join('\n')}
      
      Please incorporate any relevant context from the provided files and focus on delivering actionable, data-driven insights for decision making.
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

    // Prepare context summary
    const contextSummary = contextFiles && contextFiles.length > 0 ? 
      `Analysis enhanced with ${contextFiles.length} context files: ${contextFiles.map(f => f.file_name).join(', ')}` : 
      null;

    // Parse analysis preferences from first upload for settings
    const firstUploadPreferences = uploads[0]?.analysis_preferences as AnalysisPreferences | null;

    // Save batch analysis results with enhanced metadata
    const { data: batchAnalysis, error: saveError } = await supabase
      .from('design_batch_analysis')
      .insert({
        batch_id: batchId,
        user_id: user.id,
        analysis_type: useCase.name,
        prompt_used: batchPrompt,
        analysis_results: { response: batchAnalysisResponse.response },
        context_summary: contextSummary,
        analysis_settings: {
          uploads_count: uploads.length,
          context_files_count: contextFiles?.length || 0,
          analysis_depth: firstUploadPreferences?.analysis_depth || 'detailed'
        },
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
