
import { ContextualField } from '@/types/figmant';

export const PREDEFINED_FIELDS: Array<ContextualField & { id: string }> = [
  {
    id: 'project_type',
    label: 'Project Type',
    type: 'select' as const,
    options: ['landing_page', 'product_page', 'ecommerce_site', 'saas_homepage', 'mobile_app', 'other'],
    required: true
  },
  {
    id: 'business_goal',
    label: 'Business Goal',
    type: 'select' as const,
    options: ['increase_conversions', 'improve_engagement', 'generate_leads', 'boost_sales', 'reduce_bounce', 'other'],
    required: true
  },
  {
    id: 'target_metric',
    label: 'Target Metric',
    type: 'text' as const,
    placeholder: 'e.g., "Increase demo requests by 25%"',
    description: 'Describe your specific target metric',
    required: false
  },
  {
    id: 'industry',
    label: 'Industry',
    type: 'select' as const,
    options: ['saas', 'ecommerce', 'finance', 'healthcare', 'education', 'real_estate', 'other'],
    required: true
  },
  {
    id: 'target_audience',
    label: 'Target Audience',
    type: 'select' as const,
    options: ['b2b_decision_makers', 'consumers', 'small_business', 'enterprise', 'creative_professionals', 'other'],
    required: true
  },
  {
    id: 'competitor_urls',
    label: 'Competitor URLs',
    type: 'textarea' as const,
    placeholder: 'Enter 3-5 URLs with reasons (one per line)',
    description: 'List competitor URLs with brief explanations',
    required: false
  },
  {
    id: 'design_challenge',
    label: 'Design Challenge',
    type: 'textarea' as const,
    placeholder: 'What specific aspect needs improvement?',
    description: 'Describe the main design challenge you want to address',
    required: false
  },
  {
    id: 'design_upload',
    label: 'Design Upload Type',
    type: 'select' as const,
    options: ['figma_link', 'image_upload', 'live_url', 'sketch_file'],
    required: false
  },
  {
    id: 'focus_elements',
    label: 'Focus Elements',
    type: 'select' as const,
    options: ['header', 'hero', 'cta_buttons', 'trust_signals', 'mobile', 'forms', 'pricing', 'all'],
    description: 'Which elements should we focus on?',
    required: false
  },
  {
    id: 'success_measurement',
    label: 'Success Measurement',
    type: 'select' as const,
    options: ['conversion_rate', 'engagement', 'ab_test', 'stakeholder_approval', 'implementation'],
    required: false
  },
  {
    id: 'implementation_timeline',
    label: 'Implementation Timeline',
    type: 'select' as const,
    options: ['this_week', 'two_weeks', 'month', 'planning_only'],
    required: false
  }
];
