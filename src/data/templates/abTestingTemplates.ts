
import { FigmantPromptTemplate } from '@/types/figmant';

export const abTestingTemplates: FigmantPromptTemplate[] = [
  {
    id: 'uc005_ab_testing',
    name: 'A/B Testing Validation',
    displayName: 'A/B Testing Validation',
    description: 'Design statistically valid A/B tests with proper sample sizes',
    category: 'ab_testing',
    prompt_template: `Design a comprehensive A/B testing strategy for this design to validate improvements.

Testing Context:
- Current performance: {currentMetrics}
- Test hypothesis: {testHypothesis}
- Primary metric: {primaryMetric}
- Secondary metrics: {secondaryMetrics}
- Expected improvement: {expectedImprovement}
- Traffic volume: {trafficVolume}
- Test duration preference: {testDuration}

Create:
1. Statistically valid test design with proper sample sizes
2. Test configuration and duration estimates
3. Success criteria and significance thresholds
4. Variation recommendations with rationale
5. Results analysis framework
6. Implementation timeline

Provide automated test design and statistical significance tracking recommendations.`,
    analysis_focus: [
      'Test design validation',
      'Statistical significance planning',
      'Hypothesis generation',
      'Success metrics definition',
      'Implementation strategy'
    ],
    best_for: [
      'Product managers running experiments',
      'Growth teams optimizing conversion',
      'UX designers validating changes'
    ],
    contextual_fields: [
      {
        id: 'currentMetrics',
        label: 'Current Performance Metrics',
        type: 'textarea',
        required: true,
        placeholder: 'e.g. Conversion rate: 3.2%, CTR: 1.8%, Bounce rate: 45%',
        description: 'Current performance baseline for comparison'
      },
      {
        id: 'testHypothesis',
        label: 'Test Hypothesis',
        type: 'textarea',
        required: true,
        placeholder: 'We believe that changing X will improve Y because...',
        description: 'Clear hypothesis statement for the test'
      },
      {
        id: 'primaryMetric',
        label: 'Primary Success Metric',
        type: 'select',
        required: true,
        options: ['Conversion rate', 'Click-through rate', 'Sign-up rate', 'Revenue per visitor', 'Time on page', 'Bounce rate', 'Other'],
        description: 'Main metric you want to improve'
      },
      {
        id: 'secondaryMetrics',
        label: 'Secondary Metrics',
        type: 'textarea',
        placeholder: 'List additional metrics to track',
        description: 'Other important metrics to monitor during the test'
      },
      {
        id: 'expectedImprovement',
        label: 'Expected Improvement',
        type: 'text',
        placeholder: 'e.g. 15% increase in conversion rate',
        description: 'What improvement do you expect to see?'
      },
      {
        id: 'trafficVolume',
        label: 'Weekly Traffic Volume',
        type: 'number',
        placeholder: '10000',
        description: 'Average weekly visitors for sample size calculation'
      },
      {
        id: 'testDuration',
        label: 'Preferred Test Duration',
        type: 'select',
        options: ['1-2 weeks', '2-4 weeks', '1-2 months', 'Until significance', 'Flexible'],
        description: 'How long do you want to run the test?'
      }
    ]
  }
];
