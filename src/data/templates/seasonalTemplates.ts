
import { FigmantPromptTemplate } from '@/types/figmant';

export const seasonalTemplates: FigmantPromptTemplate[] = [
  {
    id: 'seasonal_campaign',
    name: 'Seasonal Campaign Optimization',
    displayName: 'Seasonal Campaign',
    description: 'Optimize design patterns for seasonal performance and holiday campaigns',
    category: 'seasonal',
    requires_context: true,
    best_for: ['Holiday campaigns', 'Seasonal optimization', 'Event-driven design'],
    example_use_cases: ['Black Friday optimization', 'Holiday shopping experience', 'Seasonal brand alignment'],
    analysis_focus: [
      'Seasonal design patterns',
      'Holiday psychology optimization',
      'Urgency and scarcity tactics',
      'Gift-giving optimization',
      'Seasonal traffic handling'
    ],
    prompt_template: `You are a seasonal marketing and UX optimization expert. Analyze this design for seasonal campaign effectiveness and holiday conversion optimization.

**SEASONAL CAMPAIGN OPTIMIZATION FRAMEWORK:**

**1. SEASONAL DESIGN PSYCHOLOGY**
- Evaluate seasonal color psychology and emotional triggers
- Assess holiday-specific imagery and iconography
- Review seasonal messaging and tone adaptation
- Analyze gift-giving and seasonal shopping motivations
- Check cultural sensitivity and inclusivity

**2. URGENCY & SCARCITY OPTIMIZATION**
- Evaluate countdown timers and deadline communication
- Assess limited-time offer presentation
- Review inventory scarcity indicators
- Analyze early bird and last-minute optimization
- Check promotional hierarchy and visibility

**3. GIFT-GIVING EXPERIENCE OPTIMIZATION**
- Evaluate gift guide integration and navigation
- Assess gift wrapping and personalization options
- Review gift card and voucher presentation
- Analyze recipient information collection
- Check gift receipt and return policy clarity

**4. SEASONAL TRAFFIC & PERFORMANCE**
- Assess high-traffic handling and performance optimization
- Evaluate mobile experience during peak shopping
- Review checkout flow for seasonal volume
- Analyze search and filtering for seasonal needs
- Check customer service integration during peaks

**5. PROMOTIONAL STRATEGY INTEGRATION**
- Evaluate discount and offer presentation
- Assess bundle and package deal optimization
- Review loyalty program seasonal integration
- Analyze email and social media campaign alignment
- Check cross-selling seasonal item recommendations

**6. POST-SEASON OPTIMIZATION**
- Plan for post-holiday transition and clearance
- Evaluate return and exchange process optimization
- Assess customer retention post-campaign
- Review data collection for next season optimization
- Check inventory management and clearance strategy

**CONTEXT INTEGRATION:**
If seasonal timeline, target holidays, or historical performance data is provided, create specific recommendations for those periods.

**OUTPUT FORMAT:**
- Seasonal Performance Forecast
- Holiday Psychology Optimization Plan
- Urgency and Scarcity Strategy
- Gift Experience Enhancement Plan
- Peak Traffic Handling Strategy
- Promotional Integration Roadmap
- Post-Season Optimization Plan

Focus on maximizing seasonal revenue while building long-term customer relationships.`
  }
];
