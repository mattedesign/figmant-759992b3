
import { ImpactSummary } from '@/hooks/batch-upload/impactSummaryGenerator';

export interface BarChartData {
  name: string;
  value: number;
  category: string;
}

export interface RadarChartData {
  metric: string;
  score: number;
  fullMark: number;
}

export const prepareBarChartData = (impactSummary: ImpactSummary): BarChartData[] => {
  return [
    {
      name: 'Conversion',
      value: impactSummary.business_impact.conversion_potential,
      category: 'Business'
    },
    {
      name: 'Engagement',
      value: impactSummary.business_impact.user_engagement_score,
      category: 'Business'
    },
    {
      name: 'Brand Alignment',
      value: impactSummary.business_impact.brand_alignment,
      category: 'Business'
    },
    {
      name: 'Usability',
      value: impactSummary.user_experience.usability_score,
      category: 'UX'
    },
    {
      name: 'Accessibility',
      value: impactSummary.user_experience.accessibility_rating,
      category: 'UX'
    },
    {
      name: 'Overall',
      value: impactSummary.key_metrics.overall_score,
      category: 'Overall'
    }
  ];
};

export const prepareRadarChartData = (impactSummary: ImpactSummary): RadarChartData[] => {
  return [
    {
      metric: 'Conversion',
      score: impactSummary.business_impact.conversion_potential,
      fullMark: 10
    },
    {
      metric: 'Engagement',
      score: impactSummary.business_impact.user_engagement_score,
      fullMark: 10
    },
    {
      metric: 'Brand',
      score: impactSummary.business_impact.brand_alignment,
      fullMark: 10
    },
    {
      metric: 'Usability',
      score: impactSummary.user_experience.usability_score,
      fullMark: 10
    },
    {
      metric: 'Accessibility',
      score: impactSummary.user_experience.accessibility_rating,
      fullMark: 10
    }
  ];
};
