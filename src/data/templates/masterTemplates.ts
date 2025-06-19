
import { FigmantPromptTemplate } from '@/types/figmant';

export const masterTemplates: FigmantPromptTemplate[] = [
  {
    id: 'master_analysis',
    name: 'Master UX Analysis',
    displayName: 'Master UX Analysis',
    description: 'Comprehensive analysis covering all aspects of UX design',
    category: 'master',
    requires_context: false,
    best_for: ['Overall design evaluation', 'Complete UX audit', 'Design system review'],
    example_use_cases: ['New product launch', 'Complete redesign', 'UX maturity assessment'],
    analysis_focus: [
      'Visual hierarchy',
      'User experience flow',
      'Accessibility',
      'Mobile responsiveness',
      'Brand consistency',
      'Conversion optimization',
      'Performance indicators'
    ],
    prompt_template: `You are a senior UX designer and conversion optimization expert. Analyze this design comprehensively across all critical UX dimensions.

**ANALYSIS FRAMEWORK:**

**1. VISUAL HIERARCHY & DESIGN PRINCIPLES**
- Evaluate visual weight distribution and focal points
- Assess typography hierarchy and readability
- Analyze color usage and contrast ratios
- Review spacing, alignment, and grid systems
- Check brand consistency and design system adherence

**2. USER EXPERIENCE & USABILITY**
- Map user journey and interaction flows
- Identify potential friction points and usability issues
- Evaluate navigation clarity and information architecture
- Assess form design and input efficiency
- Review error handling and feedback mechanisms

**3. CONVERSION OPTIMIZATION**
- Analyze CTA placement, design, and messaging
- Evaluate trust signals and social proof elements
- Review value proposition clarity and positioning
- Assess checkout/signup flow optimization
- Identify abandonment risk factors

**4. TECHNICAL & ACCESSIBILITY**
- Check mobile responsiveness and cross-device experience
- Evaluate loading speed implications of design choices
- Assess accessibility compliance (WCAG guidelines)
- Review SEO-friendly design elements
- Check browser compatibility considerations

**5. PERFORMANCE METRICS POTENTIAL**
- Predict impact on key metrics (conversion rate, bounce rate, engagement)
- Identify A/B testing opportunities
- Suggest performance tracking recommendations

**DELIVERABLE FORMAT:**
- Executive Summary (3-4 key insights)
- Detailed Analysis by Category
- Priority Action Items (High/Medium/Low)
- Quick Wins vs. Long-term Improvements
- Measurable Success Metrics

Focus on actionable insights that can directly impact business KPIs.`
  }
];
