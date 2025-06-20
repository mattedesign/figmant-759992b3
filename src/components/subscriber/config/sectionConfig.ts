
import { MessageSquare, Target, History, FileText, Lightbulb, Crown, Plug, Eye, TrendingUp } from 'lucide-react';

export const sectionConfig = {
  workspace: {
    title: 'Design Analysis',
    items: [
      { 
        id: 'design', 
        label: 'Analysis Chat', 
        icon: MessageSquare, 
        disabled: false,
        description: 'Universal analysis hub with all templates'
      },
      { 
        id: 'competitor-analysis', 
        label: 'Competitor Analysis', 
        icon: Target, 
        disabled: false,
        badge: 'Popular',
        description: 'Compare against competitors'
      },
      { 
        id: 'conversion-optimization', 
        label: 'Conversion Optimization', 
        icon: TrendingUp, 
        disabled: false,
        description: 'Improve conversion rates'
      },
      { 
        id: 'visual-hierarchy', 
        label: 'Visual Hierarchy', 
        icon: Eye, 
        disabled: false,
        description: 'Analyze visual flow and hierarchy'
      },
      { id: 'all-analysis', label: 'All Analysis', icon: FileText, disabled: false },
      { id: 'insights', label: 'Insights', icon: Lightbulb, disabled: false },
      { id: 'prompts', label: 'Prompt Templates', icon: MessageSquare, disabled: false },
      { id: 'premium-analysis', label: 'Premium Analysis', icon: Crown, disabled: false, badge: 'Pro' },
      { id: 'integrations', label: 'Integrations', icon: Plug, disabled: false },
    ]
  }
};
