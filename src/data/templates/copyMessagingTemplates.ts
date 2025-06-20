
import { FigmantPromptTemplate } from '@/types/figmant';

export const copyMessagingTemplates: FigmantPromptTemplate[] = [
  {
    id: 'uc031_copy_messaging',
    name: 'Copy & Messaging Testing',
    displayName: 'Copy & Messaging Testing',
    description: 'Test headline, CTA, and messaging variations for performance',
    category: 'copy_messaging',
    prompt_template: `Analyze and optimize the copy and messaging strategy for maximum impact and conversion.

Context:
- Brand voice: {brandVoice}
- Target audience: {targetAudience}
- Primary message: {primaryMessage}
- Conversion goal: {conversionGoal}
- Competitive positioning: {competitivePositioning}
- Tone preference: {tonePreference}

Analyze for:
1. Message clarity and comprehension
2. Brand voice consistency and alignment
3. Emotional resonance and persuasion
4. Call-to-action effectiveness
5. Value proposition communication
6. Audience language alignment

Provide message performance rankings with audience segment insights.`,
    analysis_focus: [
      'Message clarity',
      'Brand voice consistency',
      'Persuasion effectiveness',
      'CTA optimization',
      'Audience alignment'
    ],
    best_for: [
      'Marketing managers optimizing campaigns',
      'Copywriters testing variations',
      'Product teams improving messaging'
    ],
    contextual_fields: [
      {
        id: 'brandVoice',
        label: 'Brand Voice',
        type: 'select',
        required: true,
        options: ['Professional', 'Friendly', 'Authoritative', 'Playful', 'Innovative', 'Trustworthy', 'Casual', 'Premium'],
        description: 'How should your brand sound to customers?'
      },
      {
        id: 'primaryMessage',
        label: 'Primary Message',
        type: 'textarea',
        required: true,
        placeholder: 'What is the main message you want to communicate?',
        description: 'The core value proposition or key message'
      },
      {
        id: 'conversionGoal',
        label: 'Conversion Goal',
        type: 'select',
        options: ['Sign up', 'Purchase', 'Download', 'Contact', 'Subscribe', 'Learn more', 'Other'],
        description: 'What action do you want users to take?'
      },
      {
        id: 'competitivePositioning',
        label: 'Competitive Positioning',
        type: 'textarea',
        placeholder: 'How do you differentiate from competitors?',
        description: 'Your unique position in the market'
      },
      {
        id: 'tonePreference',
        label: 'Tone Preference',
        type: 'select',
        options: ['Urgent', 'Calm', 'Exciting', 'Reassuring', 'Bold', 'Subtle', 'Direct', 'Conversational'],
        description: 'What tone should the messaging convey?'
      }
    ]
  }
];
