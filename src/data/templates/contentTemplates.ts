
import { FigmantPromptTemplate } from '@/types/figmant';

export const contentTemplates: FigmantPromptTemplate[] = [
  {
    id: 'copy_messaging',
    name: 'Copy & Messaging Analysis',
    displayName: 'Copy & Messaging',
    description: 'Analyze copy effectiveness, tone, and messaging strategy',
    category: 'copy_messaging',
    requires_context: true,
    best_for: ['Content strategy', 'Messaging optimization', 'Brand voice consistency'],
    example_use_cases: ['Landing page copy', 'Product descriptions', 'CTA optimization'],
    analysis_focus: [
      'Message clarity',
      'Brand voice consistency',
      'Call-to-action effectiveness',
      'Value proposition communication',
      'User language alignment'
    ],
    prompt_template: `You are a UX copywriter and conversion optimization specialist. Analyze the copy and messaging strategy for clarity, persuasion, and conversion effectiveness.

**COPY & MESSAGING ANALYSIS FRAMEWORK:**

**1. MESSAGE CLARITY & COMPREHENSION**
- Evaluate headline effectiveness and clarity
- Assess value proposition communication
- Review jargon usage and accessibility
- Analyze information hierarchy in copy
- Check cognitive load and processing ease

**2. BRAND VOICE & TONE CONSISTENCY**
- Evaluate brand personality expression
- Assess tone appropriateness for audience
- Review voice consistency across elements
- Analyze emotional resonance and connection
- Check alignment with brand guidelines

**3. PERSUASION & CONVERSION PSYCHOLOGY**
- Analyze persuasion techniques usage
- Evaluate social proof integration
- Review urgency and scarcity messaging
- Assess benefit vs. feature communication
- Check emotional vs. rational appeals balance

**4. CALL-TO-ACTION OPTIMIZATION**
- Evaluate CTA copy effectiveness
- Analyze action verb strength and clarity
- Review CTA placement and prominence
- Assess micro-copy supporting conversions
- Check form labels and helper text

**5. USER LANGUAGE ALIGNMENT**
- Compare copy to target audience language
- Evaluate technical complexity appropriateness
- Review cultural sensitivity and inclusivity
- Assess reading level and accessibility
- Check localization considerations

**6. CONTENT STRATEGY ASSESSMENT**
- Evaluate content structure and flow
- Analyze storytelling effectiveness
- Review information prioritization
- Assess content-to-action ratio
- Check content supporting user goals

**CONTEXT INTEGRATION:**
If brand guidelines or target audience information is provided, evaluate alignment and suggest optimizations.

**OUTPUT FORMAT:**
- Copy Effectiveness Scorecard
- Message Clarity Assessment
- Brand Voice Consistency Review
- CTA Optimization Recommendations
- Content Strategy Improvements
- A/B Testing Copy Suggestions

Focus on improving message clarity and conversion rates.`
  }
];
