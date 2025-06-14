
import { supabase } from '@/integrations/supabase/client';
import { DesignUpload } from '@/types/design';
import { generateImpactSummary } from './impactSummaryGenerator';

export const processAnalysis = async (
  uploads: DesignUpload[], 
  batchId: string, 
  useCase: string,
  shouldRunBatchAnalysis: boolean = false
) => {
  console.log('Starting analysis processing for uploads:', uploads.length);
  
  try {
    // Process individual analyses first
    const individualResults = await Promise.allSettled(
      uploads.map(upload => processIndividualAnalysis(upload, useCase))
    );

    console.log('Individual analysis results:', individualResults);

    // If batch analysis is enabled and we have multiple uploads, run comparative analysis
    if (shouldRunBatchAnalysis && uploads.length > 1) {
      await processBatchAnalysis(uploads, batchId, useCase);
    }

    return {
      success: true,
      individualResults,
      batchAnalysisTriggered: shouldRunBatchAnalysis && uploads.length > 1
    };
  } catch (error) {
    console.error('Analysis processing failed:', error);
    throw error;
  }
};

const processIndividualAnalysis = async (upload: DesignUpload, useCase: string) => {
  console.log('Processing individual analysis for upload:', upload.id);
  
  try {
    // Call Claude AI for analysis
    const { data: claudeResponse, error: claudeError } = await supabase.functions.invoke('claude-ai', {
      body: {
        designUploadId: upload.id,
        useCase,
        analysisType: 'individual'
      }
    });

    if (claudeError) {
      console.error('Claude AI analysis failed:', claudeError);
      throw claudeError;
    }

    console.log('Claude AI response:', claudeResponse);

    // Generate impact summary from Claude response
    const impactSummary = generateImpactSummary(claudeResponse);
    console.log('Generated impact summary:', impactSummary);

    // Save analysis to database with impact summary
    const { data: analysisData, error: analysisError } = await supabase
      .from('design_analysis')
      .insert({
        design_upload_id: upload.id,
        user_id: upload.user_id,
        analysis_type: 'individual',
        prompt_used: claudeResponse.prompt_used || '',
        analysis_results: claudeResponse,
        confidence_score: claudeResponse.confidence_score || 0.8,
        suggestions: claudeResponse.suggestions,
        improvement_areas: claudeResponse.improvement_areas,
        impact_summary: impactSummary
      })
      .select()
      .single();

    if (analysisError) {
      console.error('Failed to save analysis:', analysisError);
      throw analysisError;
    }

    console.log('Analysis saved successfully:', analysisData);

    // Update upload status
    await supabase
      .from('design_uploads')
      .update({ status: 'completed' })
      .eq('id', upload.id);

    return { success: true, analysisId: analysisData.id };
  } catch (error) {
    console.error('Individual analysis failed for upload:', upload.id, error);
    
    // Update upload status to failed
    await supabase
      .from('design_uploads')
      .update({ status: 'failed' })
      .eq('id', upload.id);

    throw error;
  }
};

const processBatchAnalysis = async (uploads: DesignUpload[], batchId: string, useCase: string) => {
  console.log('Processing batch analysis for batch:', batchId);
  
  try {
    // Call Claude AI for batch analysis
    const { data: claudeResponse, error: claudeError } = await supabase.functions.invoke('claude-ai', {
      body: {
        batchId,
        uploads: uploads.map(u => ({ id: u.id, file_name: u.file_name })),
        useCase,
        analysisType: 'batch_comparative'
      }
    });

    if (claudeError) {
      console.error('Batch Claude AI analysis failed:', claudeError);
      throw claudeError;
    }

    console.log('Batch Claude AI response:', claudeResponse);

    // Generate impact summary for batch analysis
    const impactSummary = generateImpactSummary(claudeResponse);
    console.log('Generated batch impact summary:', impactSummary);

    // Save batch analysis to database
    const { data: batchAnalysisData, error: batchError } = await supabase
      .from('design_batch_analysis')
      .insert({
        batch_id: batchId,
        user_id: uploads[0].user_id,
        analysis_type: 'batch_comparative',
        prompt_used: claudeResponse.prompt_used || '',
        analysis_results: claudeResponse,
        winner_upload_id: claudeResponse.winner_upload_id,
        key_metrics: claudeResponse.key_metrics,
        recommendations: claudeResponse.recommendations,
        confidence_score: claudeResponse.confidence_score || 0.8,
        context_summary: claudeResponse.context_summary,
        impact_summary: impactSummary
      })
      .select()
      .single();

    if (batchError) {
      console.error('Failed to save batch analysis:', batchError);
      throw batchError;
    }

    console.log('Batch analysis saved successfully:', batchAnalysisData);
    return { success: true, batchAnalysisId: batchAnalysisData.id };
  } catch (error) {
    console.error('Batch analysis failed for batch:', batchId, error);
    throw error;
  }
};
