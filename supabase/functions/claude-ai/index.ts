
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ClaudeRequest {
  prompt: string;
  userId: string;
  requestType: 'insights' | 'analysis' | 'test';
  context?: {
    useCase?: string;
    category?: string;
    businessDomain?: string;
    analysisGoals?: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get Claude settings
    const { data: settings, error: settingsError } = await supabase.rpc('get_claude_settings')
    if (settingsError) throw settingsError
    
    const claudeSettings = settings[0]
    if (!claudeSettings?.claude_ai_enabled) {
      throw new Error('Claude AI is not enabled')
    }

    // Get API key
    const { data: apiKeyData, error: apiKeyError } = await supabase
      .from('admin_settings')
      .select('setting_value')
      .eq('setting_key', 'claude_api_key')
      .single()

    if (apiKeyError || !apiKeyData?.setting_value) {
      throw new Error('Claude API key not configured')
    }

    const apiKey = typeof apiKeyData.setting_value === 'object' && apiKeyData.setting_value !== null
      ? (apiKeyData.setting_value as any).value
      : apiKeyData.setting_value

    if (!apiKey) {
      throw new Error('Invalid Claude API key format')
    }

    const requestBody: ClaudeRequest = await req.json()
    let optimizedPrompt = requestBody.prompt
    let exampleId: string | null = null

    // Try to get optimized prompt if context is provided
    if (requestBody.context?.category) {
      try {
        const { data: bestPrompt, error: promptError } = await supabase.rpc('get_best_prompt_for_category', {
          category_name: requestBody.context.category
        })

        if (!promptError && bestPrompt && bestPrompt.length > 0) {
          optimizedPrompt = bestPrompt[0].original_prompt
          exampleId = bestPrompt[0].example_id
          
          // Replace variables in the prompt
          if (requestBody.context.useCase) {
            optimizedPrompt = optimizedPrompt.replace(/\{\{useCase\}\}/g, requestBody.context.useCase)
          }
          if (requestBody.context.businessDomain) {
            optimizedPrompt = optimizedPrompt.replace(/\{\{businessDomain\}\}/g, requestBody.context.businessDomain)
          }
          if (requestBody.context.analysisGoals) {
            optimizedPrompt = optimizedPrompt.replace(/\{\{analysisGoals\}\}/g, requestBody.context.analysisGoals)
          }
          
          console.log('Using optimized prompt from example:', bestPrompt[0].title)
        }
      } catch (error) {
        console.warn('Failed to get optimized prompt, using original:', error)
      }
    }

    const startTime = Date.now()

    // Make request to Claude API
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: claudeSettings.claude_model,
        max_tokens: 4000,
        system: claudeSettings.claude_system_prompt,
        messages: [{
          role: 'user',
          content: optimizedPrompt
        }]
      })
    })

    const responseTime = Date.now() - startTime

    if (!claudeResponse.ok) {
      const errorText = await claudeResponse.text()
      console.error('Claude API Error:', errorText)
      throw new Error(`Claude API error: ${claudeResponse.status} ${errorText}`)
    }

    const claudeData = await claudeResponse.json()
    const responseText = claudeData.content?.[0]?.text || 'No response generated'
    const tokensUsed = claudeData.usage?.input_tokens + claudeData.usage?.output_tokens || 0

    // Track usage in logs
    await supabase.from('claude_usage_logs').insert({
      user_id: requestBody.userId,
      request_type: requestBody.requestType,
      request_data: {
        prompt: optimizedPrompt,
        context: requestBody.context,
        model: claudeSettings.claude_model
      },
      response_data: claudeData,
      tokens_used: tokensUsed,
      success: true
    })

    // Track prompt performance if we used an optimized prompt
    if (exampleId) {
      await supabase.from('claude_prompt_analytics').insert({
        example_id: exampleId,
        user_id: requestBody.userId,
        usage_context: requestBody.requestType,
        response_time_ms: responseTime,
        tokens_used: tokensUsed,
        business_outcome_data: { success: true, context: requestBody.context }
      })
    }

    // For insights, parse and store the structured data
    if (requestBody.requestType === 'insights') {
      try {
        // Attempt to extract structured insights from the response
        const insights = extractInsightsFromResponse(responseText)
        
        for (const insight of insights) {
          await supabase.from('claude_insights').insert({
            user_id: requestBody.userId,
            title: insight.title,
            description: insight.description,
            insight_type: insight.type || 'general',
            priority: insight.priority || 'medium',
            impact_area: insight.impact_area,
            confidence_score: insight.confidence || 0.8,
            recommendations: insight.recommendations ? { items: insight.recommendations } : null,
            data_source: { 
              prompt_used: optimizedPrompt,
              response_source: 'claude_ai',
              example_id: exampleId 
            }
          })
        }
      } catch (insightError) {
        console.warn('Failed to parse insights:', insightError)
      }
    }

    return new Response(JSON.stringify({
      success: true,
      response: responseText,
      metadata: {
        model: claudeSettings.claude_model,
        tokens_used: tokensUsed,
        response_time_ms: responseTime,
        optimized_prompt_used: !!exampleId
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error in claude-ai function:', error)
    
    return new Response(JSON.stringify({
      error: error.message || 'Internal server error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

function extractInsightsFromResponse(responseText: string) {
  const insights = []
  
  // Simple parsing logic - this could be enhanced with more sophisticated parsing
  const lines = responseText.split('\n').filter(line => line.trim())
  
  let currentInsight: any = null
  
  for (const line of lines) {
    const trimmed = line.trim()
    
    // Look for insight headers (lines that might indicate new insights)
    if (trimmed.match(/^(insight|recommendation|finding|issue|opportunity):/i)) {
      if (currentInsight) {
        insights.push(currentInsight)
      }
      
      currentInsight = {
        title: trimmed.replace(/^(insight|recommendation|finding|issue|opportunity):\s*/i, ''),
        description: '',
        type: 'general',
        priority: 'medium'
      }
    } else if (currentInsight && trimmed) {
      // Add to current insight description
      currentInsight.description += (currentInsight.description ? ' ' : '') + trimmed
    }
  }
  
  if (currentInsight) {
    insights.push(currentInsight)
  }
  
  // If no structured insights found, create a general one
  if (insights.length === 0) {
    insights.push({
      title: 'AI Analysis Results',
      description: responseText.substring(0, 500),
      type: 'general',
      priority: 'medium'
    })
  }
  
  return insights
}
