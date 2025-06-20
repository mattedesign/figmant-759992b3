
import { FigmantPromptTemplate } from '@/types/figmant';

export const crossDeviceTemplates: FigmantPromptTemplate[] = [
  {
    id: 'uc032_mobile_desktop',
    name: 'Mobile vs Desktop Analysis',
    displayName: 'Mobile vs Desktop Analysis',
    description: 'Compare design performance across device types',
    category: 'cross_device',
    prompt_template: `Analyze and optimize the cross-device experience for maximum performance on all platforms.

Device Context:
- Primary device focus: {primaryDevice}
- Mobile traffic percentage: {mobileTraffic}
- Desktop traffic percentage: {desktopTraffic}
- Tablet consideration: {tabletSupport}
- Performance priorities: {performancePriorities}
- User behavior differences: {behaviorDifferences}

Analyze for:
1. Responsive design effectiveness across breakpoints
2. Touch vs click interaction optimization
3. Screen size utilization and content adaptation
4. Performance differences across devices
5. User behavior pattern variations
6. Conversion funnel efficiency by device

Provide device-specific optimization recommendations with performance forecasts.`,
    analysis_focus: [
      'Responsive design effectiveness',
      'Touch vs click interactions',
      'Screen utilization',
      'Performance optimization',
      'User behavior patterns'
    ],
    best_for: [
      'UX designers optimizing responsiveness',
      'Product teams improving mobile experience',
      'Developers focusing on performance'
    ],
    contextual_fields: [
      {
        id: 'primaryDevice',
        label: 'Primary Device Focus',
        type: 'select',
        required: true,
        options: ['Mobile-first', 'Desktop-first', 'Equal priority', 'Tablet-focused'],
        description: 'Which device experience is most important?'
      },
      {
        id: 'mobileTraffic',
        label: 'Mobile Traffic Percentage',
        type: 'number',
        placeholder: '65',
        validation: { min: 0, max: 100 },
        description: 'What percentage of your traffic comes from mobile?'
      },
      {
        id: 'desktopTraffic',
        label: 'Desktop Traffic Percentage',
        type: 'number',
        placeholder: '30',
        validation: { min: 0, max: 100 },
        description: 'What percentage of your traffic comes from desktop?'
      },
      {
        id: 'tabletSupport',
        label: 'Tablet Support Priority',
        type: 'select',
        options: ['High priority', 'Medium priority', 'Low priority', 'Not important'],
        description: 'How important is tablet optimization?'
      },
      {
        id: 'performancePriorities',
        label: 'Performance Priorities',
        type: 'textarea',
        placeholder: 'e.g. Fast loading, smooth animations, minimal data usage',
        description: 'What performance aspects are most important?'
      },
      {
        id: 'behaviorDifferences',
        label: 'Known Behavior Differences',
        type: 'textarea',
        placeholder: 'How do users behave differently on mobile vs desktop?',
        description: 'Any observed differences in user behavior by device'
      }
    ]
  }
];
