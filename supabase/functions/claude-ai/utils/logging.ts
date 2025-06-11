
export async function logClaudeUsage(
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
