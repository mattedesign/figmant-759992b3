
import React from 'react';
import { Brain, Plus, TrendingUp, Target, Zap } from 'lucide-react';
import { ClaudePromptExample } from '@/hooks/useClaudePromptExamples';
import { PromptCategoryCard } from './PromptCategoryCard';

const CATEGORIES = [
  { value: 'master', label: 'Master Analysis', icon: Brain },
  { value: 'competitor', label: 'Competitor Analysis', icon: Target },
  { value: 'visual_hierarchy', label: 'Visual Hierarchy', icon: TrendingUp },
  { value: 'copy_messaging', label: 'Copy & Messaging', icon: Zap },
  { value: 'ecommerce_revenue', label: 'E-commerce Revenue', icon: TrendingUp },
  { value: 'ab_testing', label: 'A/B Testing', icon: Target },
  { value: 'general', label: 'General Analysis', icon: Brain }
] as const;

interface PromptCategoryListProps {
  groupedPrompts: Record<string, ClaudePromptExample[]>;
}

export const PromptCategoryList: React.FC<PromptCategoryListProps> = ({ groupedPrompts }) => {
  return (
    <div className="space-y-4">
      {CATEGORIES.map(category => {
        const prompts = groupedPrompts[category.value] || [];
        
        return (
          <PromptCategoryCard 
            key={category.value} 
            category={category} 
            prompts={prompts} 
          />
        );
      })}
    </div>
  );
};
