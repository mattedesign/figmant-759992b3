
import { supabase } from '@/integrations/supabase/client';

export interface ImpactSummary {
  business_impact: {
    conversion_potential: number; // 1-10 scale
    user_engagement_score: number; // 1-10 scale
    brand_alignment: number; // 1-10 scale
    competitive_advantage: string[];
  };
  user_experience: {
    usability_score: number; // 1-10 scale
    accessibility_rating: number; // 1-10 scale
    pain_points: string[];
    positive_aspects: string[];
  };
  recommendations: {
    priority: 'high' | 'medium' | 'low';
    category: string;
    description: string;
    expected_impact: string;
  }[];
  key_metrics: {
    overall_score: number; // 1-10 scale
    improvement_areas: string[];
    strengths: string[];
  };
}

export const generateImpactSummary = async (
  analysisResults: string,
  analysisType: string,
  userId: string
): Promise<ImpactSummary | null> => {
  try {
    console.log('Generating impact summary for analysis...');
    
    const impactPrompt = `
      Based on the following design analysis, generate a structured impact summary that provides business and user experience insights.

      Analysis Results:
      ${analysisResults}

      Please provide a comprehensive impact summary in JSON format with the following structure:
      {
        "business_impact": {
          "conversion_potential": [1-10 score],
          "user_engagement_score": [1-10 score], 
          "brand_alignment": [1-10 score],
          "competitive_advantage": ["advantage 1", "advantage 2"]
        },
        "user_experience": {
          "usability_score": [1-10 score],
          "accessibility_rating": [1-10 score],
          "pain_points": ["pain point 1", "pain point 2"],
          "positive_aspects": ["positive 1", "positive 2"]
        },
        "recommendations": [
          {
            "priority": "high|medium|low",
            "category": "category name",
            "description": "detailed recommendation",
            "expected_impact": "expected outcome"
          }
        ],
        "key_metrics": {
          "overall_score": [1-10 score],
          "improvement_areas": ["area 1", "area 2"],
          "strengths": ["strength 1", "strength 2"]
        }
      }

      Focus on actionable insights, measurable impacts, and specific recommendations that can drive business results and improve user experience.
      Provide realistic scores based on the analysis and be specific in your recommendations.
    `;

    const { data: impactResponse, error: claudeError } = await supabase.functions.invoke('claude-ai', {
      body: {
        prompt: impactPrompt,
        userId: userId,
        requestType: 'impact_summary_generation'
      }
    });

    if (claudeError) {
      console.error('Claude AI error for impact summary:', claudeError);
      return null;
    }

    // Parse the JSON response from Claude
    try {
      const analysisText = impactResponse.analysis || impactResponse.response;
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const impactSummary = JSON.parse(jsonMatch[0]);
        console.log('Generated impact summary:', impactSummary);
        return impactSummary as ImpactSummary;
      } else {
        console.warn('No valid JSON found in impact summary response');
        return null;
      }
    } catch (parseError) {
      console.error('Failed to parse impact summary JSON:', parseError);
      return null;
    }

  } catch (error) {
    console.error('Error generating impact summary:', error);
    return null;
  }
};
