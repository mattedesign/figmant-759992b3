
// Transform raw database data for widget consumption

interface RawAnalysisData {
  id: string;
  source_type: 'file' | 'url';
  source_url?: string;
  design_analysis?: Array<{
    confidence_score: number;
    suggestions?: any;
    improvement_areas?: string[];
    impact_summary?: {
      business_impact?: {
        conversion_potential: number;
      };
    };
  }>;
  [key: string]: any; // For other database fields
}

interface CompetitorWidgetData {
  id: string;
  source_type: 'file' | 'url';
  confidence_score: number;
  source_url?: string;
  design_analysis?: Array<{
    confidence_score: number;
    suggestions?: any;
    improvement_areas?: string[];
  }>;
}

interface RevenueWidgetData {
  id: string;
  confidence_score: number;
  impact_summary?: {
    business_impact?: {
      conversion_potential: number;
    };
  };
  suggestions?: any;
}

export const transformForCompetitorWidget = (rawData: any[]): CompetitorWidgetData[] => {
  return rawData.map(item => {
    // Get confidence score from first design analysis or use default
    const firstAnalysis = item.design_analysis?.[0];
    const confidence_score = firstAnalysis?.confidence_score || 75; // Default confidence score

    return {
      id: item.id,
      source_type: item.source_type || 'file',
      confidence_score,
      source_url: item.source_url,
      design_analysis: item.design_analysis || []
    };
  });
};

export const transformForRevenueWidget = (rawData: any[]): RevenueWidgetData[] => {
  return rawData.map(item => {
    // Get confidence score from first design analysis or use default
    const firstAnalysis = item.design_analysis?.[0];
    const confidence_score = firstAnalysis?.confidence_score || 75; // Default confidence score

    return {
      id: item.id,
      confidence_score,
      impact_summary: firstAnalysis?.impact_summary,
      suggestions: firstAnalysis?.suggestions
    };
  });
};
