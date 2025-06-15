import { MessageSquare, Target, History, FileText, Lightbulb, Crown, Plug } from 'lucide-react';

export const sectionConfig = {
  workspace: {
    title: 'Design Analysis',
    items: [
      { id: 'design', label: 'AI Chat Analysis', icon: MessageSquare, disabled: false },
      { id: 'all-analysis', label: 'All Analysis', icon: FileText, disabled: false },
      { id: 'insights', label: 'Insights', icon: Lightbulb, disabled: false },
      { id: 'prompts', label: 'Prompts', icon: MessageSquare, disabled: false },
      { id: 'premium-analysis', label: 'Premium Analysis', icon: Crown, disabled: false, badge: 'Pro' },
      { id: 'integrations', label: 'Integrations', icon: Plug, disabled: false },
      // Hidden navigation items - keeping functionality but removing from UI
      // { id: 'batch', label: 'Batch Analysis', icon: BarChart3 },
      // { id: 'history', label: 'Analysis History', icon: Target },
      // { id: 'legacy', label: 'Legacy View', icon: History },
    ]
  }
};
