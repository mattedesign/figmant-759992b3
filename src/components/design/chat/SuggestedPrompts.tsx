
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Target, TrendingUp, Zap, Eye, ShoppingCart, Users } from 'lucide-react';

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

const SUGGESTED_PROMPTS = [
  {
    icon: Target,
    text: "Analyze this design for conversion optimization",
    category: "Conversion"
  },
  {
    icon: Eye,
    text: "Review the visual hierarchy and user flow",
    category: "UX"
  },
  {
    icon: ShoppingCart,
    text: "Evaluate this e-commerce page for revenue impact",
    category: "E-commerce"
  },
  {
    icon: Users,
    text: "Compare these designs and recommend the best one",
    category: "A/B Testing"
  },
  {
    icon: Zap,
    text: "Assess the messaging and copy effectiveness",
    category: "Copy"
  },
  {
    icon: TrendingUp,
    text: "Provide a comprehensive UX analysis",
    category: "Analysis"
  }
];

export const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({ onSelectPrompt }) => {
  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-muted-foreground">
        Try asking me about:
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {SUGGESTED_PROMPTS.map((prompt, index) => {
          const Icon = prompt.icon;
          return (
            <Button
              key={index}
              variant="outline"
              onClick={() => onSelectPrompt(prompt.text)}
              className="justify-start h-auto p-3 text-left"
            >
              <div className="flex items-start space-x-2 w-full">
                <Icon className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {prompt.text}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {prompt.category}
                  </div>
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
