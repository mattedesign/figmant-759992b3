
import { FigmantPromptTemplate } from '@/types/figmant';

export const competitorAnalysisTemplates: FigmantPromptTemplate[] = [
  {
    id: 'uc024_competitor_analysis',
    name: 'AI Competitor Analysis',
    displayName: 'AI Competitor Analysis',
    description: 'Compare your design against 5-7 competitor screenshots with AI analysis',
    category: 'competitor',
    prompt_template: `Analyze this design against competitor best practices in the {industry} industry. 
    
Target audience: {targetAudience}
Business goals: {businessGoals}
Competitor URLs for reference: {competitorUrls}
Current performance metrics: {currentMetrics}
Brand positioning: {brandPositioning}
Key differentiators: {keyDifferentiators}

Focus on:
1. Visual hierarchy and information architecture
2. Conversion optimization opportunities  
3. User experience improvements
4. Competitive advantages and gaps
5. Industry-specific best practices

Provide specific, actionable recommendations with competitor examples.`,
    analysis_focus: [
      'Competitive positioning',
      'Visual hierarchy comparison',
      'Conversion optimization',
      'Industry best practices',
      'UX improvements'
    ],
    best_for: [
      'UX Designers validating design decisions',
      'Product teams entering new markets',
      'Startups analyzing competition'
    ],
    contextual_fields: [
      {
        id: 'industry',
        label: 'Industry/Market',
        type: 'select',
        required: true,
        options: ['E-commerce', 'SaaS', 'Healthcare', 'Finance', 'Education', 'Real Estate', 'Travel', 'Other'],
        description: 'Select your industry for relevant competitor comparisons'
      },
      {
        id: 'competitorUrls',
        label: 'Competitor URLs',
        type: 'textarea',
        required: true,
        placeholder: 'Enter 3-5 competitor URLs, one per line',
        description: 'Provide URLs of your main competitors for analysis'
      },
      {
        id: 'currentMetrics',
        label: 'Current Performance Metrics',
        type: 'textarea',
        placeholder: 'e.g. Conversion rate: 2.3%, Bounce rate: 45%, Time on page: 2:30',
        description: 'Share current performance data if available'
      },
      {
        id: 'brandPositioning',
        label: 'Brand Positioning',
        type: 'textarea',
        placeholder: 'How do you position your brand vs competitors?',
        description: 'Describe your unique value proposition and market position'
      },
      {
        id: 'keyDifferentiators',
        label: 'Key Differentiators',
        type: 'textarea',
        placeholder: 'What makes you different from competitors?',
        description: 'List your main competitive advantages'
      }
    ]
  }
];
