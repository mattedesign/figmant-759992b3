
import React from 'react';
import { Brain, Plus, TrendingUp, Target, Zap, Crown } from 'lucide-react';
import { ClaudePromptExample } from '@/hooks/useClaudePromptExamples';
import { PromptTemplateCard } from './PromptTemplateCard';

const CATEGORIES = [
  { value: 'master', label: 'Master Analysis', icon: Brain },
  { value: 'competitor', label: 'Competitor Analysis', icon: Target },
  { value: 'visual_hierarchy', label: 'Visual Hierarchy', icon: TrendingUp },
  { value: 'copy_messaging', label: 'Copy & Messaging', icon: Zap },
  { value: 'ecommerce_revenue', label: 'E-commerce Revenue', icon: TrendingUp },
  { value: 'ab_testing', label: 'A/B Testing', icon: Target },
  { value: 'premium', label: 'Premium Analysis', icon: Crown },
  { value: 'general', label: 'General Analysis', icon: Brain }
] as const;

interface PromptTemplateListProps {
  groupedTemplates: Record<string, ClaudePromptExample[]>;
}

export const PromptTemplateList: React.FC<PromptTemplateListProps> = ({ groupedTemplates }) => {
  return (
    <div className="space-y-4">
      {CATEGORIES.map(category => {
        const templates = groupedTemplates[category.value] || [];
        
        return (
          <PromptTemplateCard 
            key={category.value} 
            category={category} 
            templates={templates} 
          />
        );
      })}
    </div>
  );
};
