
import { FigmantPromptTemplate } from '@/types/figmant';

export const ecommerceTemplates: FigmantPromptTemplate[] = [
  {
    id: 'uc018_ecommerce_revenue',
    name: 'E-commerce Revenue Impact',
    displayName: 'E-commerce Revenue Impact Analysis',
    description: 'Predict revenue impact of design changes before implementation',
    category: 'ecommerce_revenue',
    prompt_template: `Analyze this e-commerce design for revenue optimization potential.

Business Context:
- Product category: {productCategory}
- Average order value: {averageOrderValue}
- Current conversion rate: {currentConversionRate}
- Monthly traffic: {monthlyTraffic}
- Target revenue goal: {revenueGoal}
- Primary revenue model: {revenueModel}
- Peak selling season: {peakSeason}

Analyze for:
1. Revenue impact predictions with confidence intervals
2. Conversion funnel optimization opportunities
3. Average order value improvement strategies  
4. Cart abandonment reduction tactics
5. Mobile commerce optimization
6. Seasonal/promotional design considerations

Provide ROI projections and implementation timeline recommendations.`,
    analysis_focus: [
      'Revenue impact prediction',
      'Conversion optimization',
      'AOV improvement',
      'Cart abandonment reduction',
      'Mobile commerce'
    ],
    best_for: [
      'E-commerce managers optimizing conversion',
      'Product teams planning redesigns',
      'Marketing teams validating investments'
    ],
    contextual_fields: [
      {
        id: 'productCategory',
        label: 'Product Category',
        type: 'select',
        required: true,
        options: ['Fashion/Apparel', 'Electronics', 'Home & Garden', 'Beauty & Health', 'Sports & Outdoors', 'Books & Media', 'Food & Beverage', 'Other'],
        description: 'Select your primary product category'
      },
      {
        id: 'averageOrderValue',
        label: 'Average Order Value',
        type: 'number',
        required: true,
        placeholder: '75.00',
        description: 'Current average order value in USD'
      },
      {
        id: 'currentConversionRate',
        label: 'Current Conversion Rate',
        type: 'number',
        placeholder: '2.5',
        description: 'Current conversion rate as a percentage'
      },
      {
        id: 'monthlyTraffic',
        label: 'Monthly Traffic',
        type: 'number',
        placeholder: '50000',
        description: 'Average monthly website visitors'
      },
      {
        id: 'revenueGoal',
        label: 'Revenue Goal',
        type: 'text',
        placeholder: 'Increase monthly revenue by 20%',
        description: 'Specific revenue improvement target'
      },
      {
        id: 'revenueModel',
        label: 'Revenue Model',
        type: 'select',
        options: ['One-time purchases', 'Subscription', 'Marketplace', 'B2B sales', 'Mixed model'],
        description: 'Primary way you generate revenue'
      },
      {
        id: 'peakSeason',
        label: 'Peak Selling Season',
        type: 'select',
        options: ['Holiday season (Nov-Dec)', 'Back to school (Aug-Sep)', 'Spring (Mar-May)', 'Summer (Jun-Aug)', 'Year-round', 'Other'],
        description: 'When do you see highest sales volume?'
      }
    ]
  }
];
