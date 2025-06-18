import React from 'react';
import { Plus, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { StepProps } from '../types';
import { StepHeader } from '../components/StepHeader';
import { FormField } from '../components/FormField';
import { ActionButton } from '../components/ActionButton';
import { useClaudePromptExamplesByCategory } from '@/hooks/useClaudePromptExamplesByCategory';
import { figmantPromptTemplates } from '@/data/figmantPromptTemplates';

interface FieldConfig {
  id: string;
  label: string;
  placeholder: string;
  type: 'input' | 'textarea';
  required?: boolean;
}

export const Step4ProjectDetails: React.FC<StepProps> = ({ 
  stepData, 
  setStepData, 
  currentStep, 
  totalSteps 
}) => {
  const { data: premiumPrompts } = useClaudePromptExamplesByCategory('premium');

  const getFieldsForPromptType = (selectedType: string): FieldConfig[] => {
    // First try to find in premium prompts (database)
    const premiumPrompt = premiumPrompts?.find(prompt => prompt.id === selectedType);
    if (premiumPrompt) {
      return getFieldsForCategory(premiumPrompt.category);
    }
    
    // If not found in premium prompts, try figmant templates
    const figmantTemplate = figmantPromptTemplates.find(template => template.id === selectedType);
    if (figmantTemplate) {
      return getFieldsForCategory(figmantTemplate.category);
    }
    
    // Default fields if no match found
    return getDefaultFields();
  };

  const getFieldsForCategory = (category: string): FieldConfig[] => {
    switch (category) {
      case 'competitor':
      case 'competitor_analysis':
        return [
          {
            id: 'targetMarket',
            label: 'Target Market',
            placeholder: 'e.g., B2B SaaS companies, small businesses',
            type: 'input',
            required: true
          },
          {
            id: 'competitorUrls',
            label: 'Competitor URLs',
            placeholder: 'Enter competitor website URLs (one per line)',
            type: 'textarea'
          },
          {
            id: 'marketPosition',
            label: 'Current Market Position',
            placeholder: 'How do you currently position yourself in the market?',
            type: 'input'
          },
          {
            id: 'competitiveAdvantage',
            label: 'Unique Value Proposition',
            placeholder: 'What makes you different from competitors?',
            type: 'textarea'
          }
        ];

      case 'ecommerce_revenue':
      case 'ecommerce':
        return [
          {
            id: 'currentConversionRate',
            label: 'Current Conversion Rate',
            placeholder: 'e.g., 2.5%',
            type: 'input'
          },
          {
            id: 'averageOrderValue',
            label: 'Average Order Value',
            placeholder: 'e.g., $85',
            type: 'input'
          },
          {
            id: 'revenueGoal',
            label: 'Revenue Goal',
            placeholder: 'e.g., Increase revenue by 25%',
            type: 'input',
            required: true
          },
          {
            id: 'customerSegments',
            label: 'Key Customer Segments',
            placeholder: 'Describe your main customer types',
            type: 'textarea'
          }
        ];

      case 'ab_testing':
        return [
          {
            id: 'testHypothesis',
            label: 'Test Hypothesis',
            placeholder: 'What do you want to test and why?',
            type: 'textarea',
            required: true
          },
          {
            id: 'successMetrics',
            label: 'Success Metrics',
            placeholder: 'e.g., Conversion rate, click-through rate',
            type: 'input'
          },
          {
            id: 'testDuration',
            label: 'Planned Test Duration',
            placeholder: 'e.g., 2 weeks',
            type: 'input'
          },
          {
            id: 'trafficVolume',
            label: 'Expected Traffic Volume',
            placeholder: 'e.g., 1000 visitors per week',
            type: 'input'
          }
        ];

      case 'visual_hierarchy':
        return [
          {
            id: 'primaryGoal',
            label: 'Primary User Goal',
            placeholder: 'What should users accomplish on this page?',
            type: 'input',
            required: true
          },
          {
            id: 'keyElements',
            label: 'Key Elements to Highlight',
            placeholder: 'Which elements are most important?',
            type: 'textarea'
          },
          {
            id: 'userFlow',
            label: 'Desired User Flow',
            placeholder: 'Describe the ideal user journey',
            type: 'textarea'
          },
          {
            id: 'brandGuidelines',
            label: 'Brand Guidelines',
            placeholder: 'Any specific brand or design constraints?',
            type: 'input'
          }
        ];

      case 'copy_messaging':
        return [
          {
            id: 'targetAudience',
            label: 'Target Audience',
            placeholder: 'Who are you trying to reach?',
            type: 'input',
            required: true
          },
          {
            id: 'keyMessage',
            label: 'Key Message',
            placeholder: 'What\'s the main message you want to convey?',
            type: 'textarea'
          },
          {
            id: 'toneOfVoice',
            label: 'Tone of Voice',
            placeholder: 'e.g., Professional, friendly, authoritative',
            type: 'input'
          },
          {
            id: 'callToAction',
            label: 'Desired Call to Action',
            placeholder: 'What action should users take?',
            type: 'input'
          }
        ];

      case 'accessibility':
        return [
          {
            id: 'complianceLevel',
            label: 'Target Compliance Level',
            placeholder: 'e.g., WCAG 2.1 AA',
            type: 'input'
          },
          {
            id: 'userNeeds',
            label: 'Specific Accessibility Needs',
            placeholder: 'Any specific accessibility requirements?',
            type: 'textarea'
          },
          {
            id: 'assistiveTech',
            label: 'Assistive Technologies',
            placeholder: 'Which assistive technologies should be supported?',
            type: 'input'
          },
          {
            id: 'currentIssues',
            label: 'Known Accessibility Issues',
            placeholder: 'Any current accessibility problems?',
            type: 'textarea'
          }
        ];

      default:
        return getDefaultFields();
    }
  };

  const getDefaultFields = (): FieldConfig[] => {
    return [
      {
        id: 'desiredOutcome',
        label: 'Desired Outcome',
        placeholder: 'What do you want to achieve?',
        type: 'input',
        required: true
      },
      {
        id: 'improvementMetric',
        label: 'Success Metric',
        placeholder: 'How will you measure success?',
        type: 'input'
      },
      {
        id: 'timeline',
        label: 'Timeline',
        placeholder: 'When do you need this completed?',
        type: 'input'
      },
      {
        id: 'constraints',
        label: 'Constraints or Requirements',
        placeholder: 'Any specific limitations or requirements?',
        type: 'textarea'
      }
    ];
  };

  const fields = getFieldsForPromptType(stepData.selectedType);

  const handleFieldChange = (fieldId: string, value: string) => {
    setStepData({
      ...stepData,
      [fieldId]: value
    });
  };

  const handleStakeholderAdd = () => {
    setStepData({
      ...stepData,
      stakeholders: [...stepData.stakeholders, { name: '', title: '' }]
    });
  };

  const handleStakeholderRemove = (index: number) => {
    const newStakeholders = stepData.stakeholders.filter((_, i) => i !== index);
    setStepData({ ...stepData, stakeholders: newStakeholders });
  };

  const handleStakeholderChange = (index: number, field: 'name' | 'title', value: string) => {
    const newStakeholders = [...stepData.stakeholders];
    newStakeholders[index][field] = value;
    setStepData({ ...stepData, stakeholders: newStakeholders });
  };

  return (
    <div className="space-y-6">
      <StepHeader 
        title="Project Details"
        currentStep={currentStep}
        totalSteps={totalSteps}
      />

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Dynamic fields based on prompt type */}
        <div className="grid grid-cols-1 gap-4">
          {fields.map((field) => (
            <FormField
              key={field.id}
              id={field.id}
              type={field.type}
              label={field.label}
              placeholder={field.placeholder}
              value={(stepData as any)[field.id] || ''}
              onChange={(value) => handleFieldChange(field.id, value)}
              minHeight={field.type === 'textarea' ? 'min-h-[100px]' : undefined}
            />
          ))}
        </div>

        {/* Stakeholders section - keep this for all prompt types */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <Label className="text-base font-medium">Stakeholders</Label>
            <Label className="text-base font-medium">Title & Role</Label>
          </div>
          
          {stepData.stakeholders.map((stakeholder, index) => (
            <div key={index} className="flex items-center gap-4 mb-4">
              <Input
                placeholder="Name"
                value={stakeholder.name}
                onChange={(e) => handleStakeholderChange(index, 'name', e.target.value)}
              />
              <Input
                placeholder="Title/Role"
                value={stakeholder.title}
                onChange={(e) => handleStakeholderChange(index, 'title', e.target.value)}
              />
              <ActionButton 
                variant="outline"
                icon={X}
                onClick={() => handleStakeholderRemove(index)}
                className="px-2"
              >
                Remove
              </ActionButton>
            </div>
          ))}

          <ActionButton 
            icon={Plus}
            onClick={handleStakeholderAdd}
            className="mt-2"
          >
            Add Stakeholder
          </ActionButton>
        </div>
      </div>
    </div>
  );
};
