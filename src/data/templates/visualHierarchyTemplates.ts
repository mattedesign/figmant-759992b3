
import { FigmantPromptTemplate } from '@/types/figmant';

export const visualHierarchyTemplates: FigmantPromptTemplate[] = [
  {
    id: 'uc012_visual_hierarchy',
    name: 'Visual Hierarchy Analysis',
    displayName: 'Visual Hierarchy Analysis',
    description: 'Score visual hierarchy effectiveness using eye-tracking simulation',
    category: 'visual_hierarchy',
    prompt_template: `Analyze the visual hierarchy of this design to improve information architecture and user flow.

Design Context:
- Design type: {designType}
- Target audience: {targetAudience}
- Business goals: {businessGoals}
- Content priority: {contentPriority}
- Information density: {informationDensity}

Focus on:
1. Visual weight distribution and focal points
2. Typography hierarchy and readability
3. Information architecture effectiveness
4. User scanning patterns optimization
5. Content grouping and spatial relationships
6. Call-to-action prominence and hierarchy

Provide hierarchy heat maps with specific improvement recommendations.`,
    analysis_focus: [
      'Visual weight distribution',
      'Typography hierarchy',
      'Information architecture',
      'User scanning patterns',
      'Content organization'
    ],
    best_for: [
      'UX Designers improving clarity',
      'Content strategists optimizing flow',
      'Product teams reducing user confusion'
    ],
    contextual_fields: [
      {
        id: 'designType',
        label: 'Design Type',
        type: 'select',
        required: true,
        options: ['Landing page', 'Product page', 'Dashboard', 'Form', 'Article/Blog', 'App interface', 'Other'],
        description: 'What type of design are you analyzing?'
      },
      {
        id: 'contentPriority',
        label: 'Content Priority',
        type: 'textarea',
        placeholder: 'List the most important elements users should see first',
        description: 'What content should have the highest visual priority?'
      },
      {
        id: 'informationDensity',
        label: 'Information Density',
        type: 'select',
        options: ['Low (minimal content)', 'Medium (balanced)', 'High (content-rich)', 'Very high (data-heavy)'],
        description: 'How much information is displayed on this design?'
      }
    ]
  }
];
