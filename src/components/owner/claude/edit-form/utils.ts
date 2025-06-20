
import { ContextualField } from '@/types/figmant';

// Determine if a template should have contextual fields based on category
export const shouldHaveContextualFields = (category: string): boolean => {
  return ['competitor', 'ecommerce_revenue', 'ab_testing', 'copy_messaging', 'visual_hierarchy'].includes(category);
};

// Provide default contextual fields for categories that should have them
export const getDefaultContextualFields = (category: string): ContextualField[] => {
  if (!shouldHaveContextualFields(category)) {
    return [];
  }

  switch (category) {
    case 'competitor':
      return [
        {
          id: 'competitor_urls',
          label: 'Competitor URLs',
          type: 'textarea',
          placeholder: 'Enter competitor website URLs (one per line)',
          required: true,
          description: 'List of competitor websites to analyze'
        },
        {
          id: 'industry_focus',
          label: 'Industry Focus',
          type: 'text',
          placeholder: 'e.g., SaaS, E-commerce, Healthcare',
          required: false,
          description: 'Specific industry context for analysis'
        }
      ];
    case 'ecommerce_revenue':
      return [
        {
          id: 'current_conversion_rate',
          label: 'Current Conversion Rate (%)',
          type: 'number',
          placeholder: '2.5',
          required: false,
          description: 'Current website conversion rate for baseline comparison'
        },
        {
          id: 'target_audience',
          label: 'Target Audience',
          type: 'text',
          placeholder: 'Demographics and psychographics',
          required: false,
          description: 'Description of target customer segment'
        }
      ];
    case 'ab_testing':
      return [
        {
          id: 'test_hypothesis',
          label: 'Test Hypothesis',
          type: 'textarea',
          placeholder: 'We believe that changing X will improve Y because...',
          required: true,
          description: 'Clear hypothesis for the A/B test'
        },
        {
          id: 'success_metric',
          label: 'Primary Success Metric',
          type: 'select',
          placeholder: 'Select metric',
          required: true,
          options: ['Conversion Rate', 'Click-through Rate', 'Time on Page', 'Bounce Rate', 'Revenue per Visitor'],
          description: 'Main metric to measure test success'
        }
      ];
    case 'copy_messaging':
      return [
        {
          id: 'brand_voice',
          label: 'Brand Voice',
          type: 'select',
          placeholder: 'Select tone',
          required: false,
          options: ['Professional', 'Friendly', 'Casual', 'Authoritative', 'Playful', 'Urgent'],
          description: 'Desired tone and voice for messaging'
        },
        {
          id: 'key_benefits',
          label: 'Key Benefits to Highlight',
          type: 'textarea',
          placeholder: 'List main value propositions',
          required: false,
          description: 'Primary benefits or features to emphasize'
        }
      ];
    case 'visual_hierarchy':
      return [
        {
          id: 'primary_action',
          label: 'Primary Call-to-Action',
          type: 'text',
          placeholder: 'Sign Up, Buy Now, Learn More, etc.',
          required: false,
          description: 'Main action you want users to take'
        },
        {
          id: 'content_priority',
          label: 'Content Priority Order',
          type: 'textarea',
          placeholder: 'List content elements in order of importance',
          required: false,
          description: 'Hierarchy of information importance'
        }
      ];
    default:
      return [];
  }
};

// Extract contextual fields from metadata with proper type checking and defaults
export const getContextualFieldsFromMetadata = (metadata: any, category: string): ContextualField[] => {
  if (!metadata || typeof metadata !== 'object') {
    return getDefaultContextualFields(category);
  }
  if (!Array.isArray(metadata.contextual_fields)) {
    return getDefaultContextualFields(category);
  }
  
  const fields = metadata.contextual_fields as ContextualField[];
  return fields.length > 0 ? fields : getDefaultContextualFields(category);
};
