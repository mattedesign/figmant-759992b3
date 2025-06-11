
import { supabase } from '@/integrations/supabase/client';
import { DesignUseCase } from '@/types/design';

export const triggerAnalysis = async (uploadId: string, useCase: DesignUseCase) => {
  console.log('Triggering analysis for upload:', uploadId);
  
  // Update upload status to processing
  await supabase
    .from('design_uploads')
    .update({ status: 'processing' })
    .eq('id', uploadId);

  console.log('Status updated to processing');

  // Get the uploaded file URL
  const { data: upload } = await supabase
    .from('design_uploads')
    .select('file_path')
    .eq('id', uploadId)
    .single();

  if (!upload) throw new Error('Upload not found');

  console.log('Getting signed URL for file:', upload.file_path);

  const { data: urlData } = await supabase.storage
    .from('design-uploads')
    .createSignedUrl(upload.file_path, 3600);

  if (!urlData?.signedUrl) {
    console.error('Failed to get signed URL');
    throw new Error('Failed to get file URL');
  }

  console.log('Signed URL created, calling Claude AI...');

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Call Claude AI for analysis
  const { data: analysisResponse, error: claudeError } = await supabase.functions.invoke('claude-ai', {
    body: {
      prompt: `${useCase.prompt_template}\n\nPlease analyze the design at this URL: ${urlData.signedUrl}`,
      userId: user.id,
      requestType: 'design_analysis'
    }
  });

  if (claudeError) {
    console.error('Claude AI error:', claudeError);
    throw claudeError;
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
    throw saveError;
  }

  console.log('Analysis saved successfully:', analysis.id);

  // Update upload status to completed
  await supabase
    .from('design_uploads')
    .update({ status: 'completed' })
    .eq('id', uploadId);

  console.log('Upload status updated to completed');
  return analysis;
};
