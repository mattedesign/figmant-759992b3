
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreatePromptExample } from '@/hooks/useClaudePromptExamples';
import { useToast } from '@/hooks/use-toast';
import { Database, Loader2 } from 'lucide-react';

const SEED_PROMPTS = [
  {
    title: 'Master UX Analysis - Comprehensive',
    display_name: 'Master UX Analysis',
    description: 'Complete UX evaluation covering all major design principles',
    category: 'master' as const,
    original_prompt: 'Conduct a comprehensive UX analysis of this design, evaluating: 1) Visual hierarchy and information architecture, 2) User flow and navigation patterns, 3) Accessibility and inclusivity, 4) Brand consistency and visual appeal, 5) Content clarity and messaging effectiveness, 6) Mobile responsiveness and cross-platform compatibility. Provide specific, actionable recommendations for improvement.',
    claude_response: 'I will analyze your design comprehensively across all major UX dimensions and provide detailed, actionable recommendations.',
    effectiveness_rating: 5,
    use_case_context: 'Complete UX evaluation',
    business_domain: 'All industries',
    is_template: true,
    is_active: true
  },
  {
    title: 'Competitor Analysis - Market Positioning',
    display_name: 'Competitor Analysis',
    description: 'Compare design against competitor interfaces and industry standards',
    category: 'competitor' as const,
    original_prompt: 'Analyze this design in comparison to industry standards and competitor interfaces. Focus on: 1) Competitive positioning and differentiation, 2) Industry best practices adoption, 3) User experience gaps compared to market leaders, 4) Unique value proposition presentation, 5) Feature parity and innovation opportunities. Include specific competitor references when possible.',
    claude_response: 'I will compare your design against industry leaders and provide competitive analysis with specific recommendations.',
    effectiveness_rating: 4,
    use_case_context: 'Competitive analysis',
    business_domain: 'All industries',
    is_template: true,
    is_active: true
  },
  {
    title: 'Visual Hierarchy - Design System Analysis',
    display_name: 'Visual Hierarchy Analysis',
    description: 'Deep dive into visual hierarchy, typography, and information architecture',
    category: 'visual_hierarchy' as const,
    original_prompt: 'Perform a detailed visual hierarchy analysis focusing on: 1) Typography scale and readability, 2) Color usage and contrast ratios, 3) Spacing and layout consistency, 4) Visual weight distribution, 5) Information prioritization and scanning patterns, 6) Call-to-action prominence and placement. Provide specific design system recommendations.',
    claude_response: 'I will analyze your visual hierarchy and provide detailed design system recommendations for improved user experience.',
    effectiveness_rating: 5,
    use_case_context: 'Visual design optimization',
    business_domain: 'All industries',
    is_template: true,
    is_active: true
  },
  {
    title: 'Copy & Messaging - Content Strategy',
    display_name: 'Copy & Messaging Strategy',
    description: 'Evaluate content strategy, tone of voice, and messaging effectiveness',
    category: 'copy_messaging' as const,
    original_prompt: 'Analyze the copy and messaging strategy of this design: 1) Tone of voice and brand personality alignment, 2) Content clarity and scanability, 3) Value proposition communication, 4) Call-to-action effectiveness, 5) Microcopy and UX writing quality, 6) Content hierarchy and information flow. Suggest improvements for better user engagement.',
    claude_response: 'I will evaluate your content strategy and provide recommendations for more effective messaging and user engagement.',
    effectiveness_rating: 4,
    use_case_context: 'Content optimization',
    business_domain: 'All industries',
    is_template: true,
    is_active: true
  },
  {
    title: 'E-commerce Revenue Optimization',
    display_name: 'E-commerce Revenue Optimizer',
    description: 'Optimize for conversions, sales, and revenue generation',
    category: 'ecommerce_revenue' as const,
    original_prompt: 'Evaluate this design for e-commerce conversion optimization: 1) Product presentation and merchandising, 2) Checkout flow and friction points, 3) Trust signals and social proof, 4) Pricing strategy presentation, 5) Cart abandonment prevention, 6) Upselling and cross-selling opportunities, 7) Mobile commerce optimization. Focus on revenue impact and conversion rate improvements.',
    claude_response: 'I will analyze your e-commerce design for revenue optimization and provide specific conversion improvement recommendations.',
    effectiveness_rating: 5,
    use_case_context: 'E-commerce optimization',
    business_domain: 'E-commerce, Retail',
    is_template: true,
    is_active: true
  },
  {
    title: 'A/B Testing Strategy - Experiment Design',
    display_name: 'A/B Testing Strategy',
    description: 'Identify testable hypotheses and experiment opportunities',
    category: 'ab_testing' as const,
    original_prompt: 'Develop A/B testing recommendations for this design: 1) Identify high-impact testing opportunities, 2) Formulate specific hypotheses for key elements, 3) Suggest measurable success metrics, 4) Prioritize tests by potential impact and effort, 5) Recommend testing methodologies and sample sizes, 6) Analyze current design for baseline performance indicators. Focus on data-driven optimization opportunities.',
    claude_response: 'I will identify key A/B testing opportunities and provide a strategic experimentation roadmap for your design.',
    effectiveness_rating: 4,
    use_case_context: 'Experimentation strategy',
    business_domain: 'All industries',
    is_template: true,
    is_active: true
  }
];

export const PromptSeeder: React.FC = () => {
  const { toast } = useToast();
  const createPromptMutation = useCreatePromptExample();

  const handleSeedDatabase = async () => {
    try {
      for (const prompt of SEED_PROMPTS) {
        await createPromptMutation.mutateAsync(prompt);
      }
      toast({
        title: "Database Seeded Successfully",
        description: `Added ${SEED_PROMPTS.length} prompt templates to the database.`,
      });
    } catch (error) {
      toast({
        title: "Seeding Failed",
        description: "Failed to seed the database with prompts. Some may have been added.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="h-5 w-5" />
          <span>Database Seeding</span>
        </CardTitle>
        <CardDescription>
          Seed the database with initial prompt templates for all categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This will add {SEED_PROMPTS.length} high-quality prompt templates covering:
          </p>
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
            <li>Master UX Analysis (comprehensive evaluation)</li>
            <li>Competitor Analysis (market positioning)</li>
            <li>Visual Hierarchy (design system analysis)</li>
            <li>Copy & Messaging (content strategy)</li>
            <li>E-commerce Revenue Optimization</li>
            <li>A/B Testing Strategy (experiment design)</li>
          </ul>
          <Button 
            onClick={handleSeedDatabase}
            disabled={createPromptMutation.isPending}
            className="w-full"
          >
            {createPromptMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Seeding Database...
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                Seed Database with Prompts
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
