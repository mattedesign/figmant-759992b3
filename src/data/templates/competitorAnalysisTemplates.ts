
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
        id: 'targetAudience',
        label: 'Target Audience',
        type: 'textarea',
        required: true,
        placeholder: 'e.g., Small business owners, 25-45 years old, tech-savvy',
        description: 'Describe your primary target audience demographics and characteristics'
      },
      {
        id: 'businessGoals',
        label: 'Business Goals',
        type: 'textarea',
        required: true,
        placeholder: 'e.g., Increase trial signups by 25%, improve conversion rates, enter new market',
        description: 'What specific business objectives are you trying to achieve?'
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
  },
  {
    id: 'master_competitor_analysis',
    name: 'Master Competitor Analysis',
    displayName: 'Master Competitor Analysis',
    description: 'Comprehensive UX and conversion analysis across all design dimensions',
    category: 'competitor',
    prompt_template: `Conduct a comprehensive competitor analysis covering all critical UX and business dimensions.

Industry Context: {industry}
Target Audience: {targetAudience}
Business Objectives: {businessGoals}
Current Position: {currentPosition}

Analyze competitors across:
1. Visual design and brand positioning
2. User experience and conversion flows
3. Content strategy and messaging
4. Technical implementation and performance
5. Market positioning and differentiation

Provide detailed recommendations for competitive advantage.`,
    analysis_focus: [
      'Visual design assessment',
      'UX flow analysis',
      'Conversion optimization',
      'Brand positioning',
      'Technical performance',
      'Content strategy'
    ],
    best_for: [
      'Complete competitive audits',
      'Market entry strategy',
      'Design system benchmarking'
    ],
    contextual_fields: [
      {
        id: 'industry',
        label: 'Industry',
        type: 'select',
        required: true,
        options: ['E-commerce', 'SaaS', 'Healthcare', 'Finance', 'Education', 'Real Estate', 'Travel', 'Other']
      },
      {
        id: 'targetAudience',
        label: 'Target Audience',
        type: 'textarea',
        required: true,
        placeholder: 'Describe your target users and their characteristics'
      },
      {
        id: 'businessGoals',
        label: 'Business Goals',
        type: 'textarea',
        required: true,
        placeholder: 'What are your primary business objectives?'
      },
      {
        id: 'currentPosition',
        label: 'Current Market Position',
        type: 'textarea',
        placeholder: 'How do you currently position yourself in the market?'
      }
    ]
  },
  {
    id: 'quick_competitive_scan',
    name: 'Quick Competitive Scan',
    displayName: 'Quick Competitive Scan',
    description: 'Rapid 30-second assessment of key competitive factors',
    category: 'competitor',
    prompt_template: `Perform a rapid competitive assessment focusing on immediate insights.

Industry: {industry}
Key Focus: {focusArea}
Business Priority: {businessPriority}

Provide quick insights on:
1. Visual hierarchy and first impressions
2. Key conversion elements
3. Unique differentiators
4. Immediate improvement opportunities

Deliver concise, actionable recommendations for quick implementation.`,
    analysis_focus: [
      'First impression analysis',
      'Key conversion elements',
      'Visual hierarchy',
      'Quick wins identification'
    ],
    best_for: [
      'Fast competitive checks',
      'Pre-meeting insights',
      'Quick decision making'
    ],
    contextual_fields: [
      {
        id: 'industry',
        label: 'Industry',
        type: 'select',
        required: true,
        options: ['E-commerce', 'SaaS', 'Healthcare', 'Finance', 'Education', 'Real Estate', 'Travel', 'Other']
      },
      {
        id: 'focusArea',
        label: 'Primary Focus Area',
        type: 'select',
        required: true,
        options: ['Conversion Rate', 'User Experience', 'Visual Design', 'Content Strategy', 'Technical Performance']
      },
      {
        id: 'businessPriority',
        label: 'Business Priority',
        type: 'textarea',
        required: true,
        placeholder: 'What is your most urgent business need right now?'
      }
    ]
  },
  {
    id: 'saas_competitor_analysis',
    name: 'SaaS Competitor Analysis',
    displayName: 'SaaS Competitor Analysis',
    description: 'Trial conversion optimization focus for SaaS businesses',
    category: 'competitor',
    prompt_template: `Analyze SaaS competitors with focus on trial conversion and user onboarding.

Target Market: {targetMarket}
Trial Goals: {trialGoals}
Pricing Strategy: {pricingStrategy}
Feature Focus: {featureFocus}

Analyze:
1. Trial signup flows and conversion optimization
2. Onboarding experience and user activation
3. Feature presentation and value communication
4. Pricing strategy and plan positioning
5. Free trial vs freemium strategies

Provide SaaS-specific recommendations for trial conversion improvement.`,
    analysis_focus: [
      'Trial conversion flows',
      'User onboarding',
      'Feature positioning',
      'Pricing strategy',
      'Value communication',
      'Free trial optimization'
    ],
    best_for: [
      'SaaS trial optimization',
      'Onboarding improvement',
      'Pricing strategy analysis'
    ],
    contextual_fields: [
      {
        id: 'targetMarket',
        label: 'Target Market',
        type: 'select',
        required: true,
        options: ['SMB', 'Mid-Market', 'Enterprise', 'Consumer', 'Mixed']
      },
      {
        id: 'trialGoals',
        label: 'Trial Conversion Goals',
        type: 'textarea',
        required: true,
        placeholder: 'What are your trial-to-paid conversion objectives?'
      },
      {
        id: 'pricingStrategy',
        label: 'Pricing Approach',
        type: 'select',
        options: ['Freemium', 'Free Trial', 'Paid Only', 'Hybrid']
      },
      {
        id: 'featureFocus',
        label: 'Core Feature Set',
        type: 'textarea',
        placeholder: 'What are your main product features and differentiators?'
      }
    ]
  },
  {
    id: 'ecommerce_competitor_analysis',
    name: 'E-commerce Competitor Analysis',
    displayName: 'E-commerce Competitor Analysis',
    description: 'Purchase conversion and revenue optimization for e-commerce',
    category: 'competitor',
    prompt_template: `Analyze e-commerce competitors focusing on purchase conversion and revenue optimization.

Product Category: {productCategory}
Target Customer: {targetCustomer}
Price Point: {pricePoint}
Revenue Goals: {revenueGoals}

Analyze:
1. Product discovery and search experience
2. Product pages and conversion elements
3. Shopping cart and checkout optimization
4. Trust signals and payment options
5. Mobile commerce experience
6. Customer retention strategies

Provide e-commerce specific recommendations for revenue growth.`,
    analysis_focus: [
      'Product discovery',
      'Conversion funnels',
      'Checkout optimization',
      'Trust and security',
      'Mobile experience',
      'Revenue optimization'
    ],
    best_for: [
      'E-commerce conversion optimization',
      'Product page improvement',
      'Checkout flow analysis'
    ],
    contextual_fields: [
      {
        id: 'productCategory',
        label: 'Product Category',
        type: 'select',
        required: true,
        options: ['Fashion', 'Electronics', 'Home & Garden', 'Health & Beauty', 'Sports', 'Books', 'Food', 'Other']
      },
      {
        id: 'targetCustomer',
        label: 'Target Customer',
        type: 'textarea',
        required: true,
        placeholder: 'Describe your ideal customer demographics and behavior'
      },
      {
        id: 'pricePoint',
        label: 'Price Range',
        type: 'select',
        options: ['Budget ($0-50)', 'Mid-range ($50-200)', 'Premium ($200-500)', 'Luxury ($500+)']
      },
      {
        id: 'revenueGoals',
        label: 'Revenue Objectives',
        type: 'textarea',
        placeholder: 'What are your revenue and conversion rate goals?'
      }
    ]
  },
  {
    id: 'uc-024-competitive-intelligence',
    name: 'Competitive Intelligence & Positioning',
    displayName: 'Competitive Intelligence & Positioning',
    description: 'Comprehensive competitor analysis combining design insights with market positioning strategy for business growth',
    category: 'competitor',
    requires_context: true,
    best_for: [
      'Market positioning strategy', 
      'Competitive differentiation', 
      'Revenue optimization',
      'Business strategy alignment',
      'Design & messaging optimization'
    ],
    example_use_cases: [
      'Market entry competitive audit',
      'Positioning gap identification',
      'Revenue-focused design optimization'
    ],
    analysis_focus: [
      'Strategic market positioning',
      'Competitive differentiation opportunities',
      'Revenue impact predictions',
      'Business-focused design insights',
      'Implementation roadmaps'
    ],
    prompt_template: `You are an expert UX strategist, market positioning analyst, and competitive intelligence specialist. Analyze the provided competitor screenshots to deliver both design insights and strategic market positioning opportunities.

**ANALYSIS CONTEXT:**
- Industry: {industry}
- Client's Current Position: {currentPosition}
- Target Audience: {targetAudience}
- Business Goals: {businessGoals}
- Market Challenges: {marketChallenges}

## DUAL-ANALYSIS FRAMEWORK

### PART A: DESIGN & UX COMPETITIVE ANALYSIS
1. **Visual Hierarchy & Design Patterns**
2. **Conversion Optimization Elements**
3. **Brand & Design Psychology**

### PART B: MARKET POSITIONING INTELLIGENCE
4. **Competitive Positioning Map**
5. **Market Gap Analysis**

## DELIVERABLE FORMAT
- Executive Summary
- Competitor Analysis Matrix
- Strategic Positioning Recommendations (Ranked by Impact)
- Design Optimization Recommendations
- Mobile vs Desktop Insights
- Revenue-Focused Messaging Framework
- Implementation Roadmap

Focus on actionable insights that directly impact business metrics: trial signups, conversion rates, average order value, customer lifetime value, and market positioning strength.`,
    contextual_fields: [
      {
        id: 'industry',
        label: 'Industry/Market',
        type: 'select',
        required: true,
        options: ['SaaS', 'E-commerce', 'Healthcare', 'Finance', 'Education', 'Real Estate', 'Travel', 'Other'],
        description: 'Select your industry for market-specific analysis'
      },
      {
        id: 'currentPosition',
        label: 'Current Market Position',
        type: 'textarea',
        required: true,
        placeholder: 'e.g., Budget-friendly tool for small teams, Premium solution for enterprise',
        description: 'How do you currently position yourself in the market?'
      },
      {
        id: 'targetAudience',
        label: 'Target Audience',
        type: 'textarea',
        required: true,
        placeholder: 'e.g., Small business owners, 10-50 employees, tech-savvy but budget-conscious',
        description: 'Describe your target customer segment in detail'
      },
      {
        id: 'businessGoals',
        label: 'Business Goals',
        type: 'textarea',
        required: true,
        placeholder: 'e.g., Increase trial signups by 25%, move upmarket, expand to enterprise',
        description: 'What specific business objectives are you trying to achieve?'
      },
      {
        id: 'marketChallenges',
        label: 'Current Market Challenges',
        type: 'textarea',
        placeholder: 'e.g., High customer acquisition cost, low trial conversion, strong competition',
        description: 'What are your biggest competitive or market challenges?'
      }
    ]
  }
];
