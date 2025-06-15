import { BarChart3, Users, CreditCard, Bot, Settings, Bell, MessageSquare, Target, History, FileText, Lightbulb, Crown, Plug, Brain } from 'lucide-react';

export const sectionConfig = {
  workspace: {
    title: 'Design Analysis',
    items: [
      { id: 'design', label: 'AI Chat Analysis', icon: MessageSquare },
      { id: 'all-analysis', label: 'All Analysis', icon: FileText },
      { id: 'insights', label: 'Insights', icon: Lightbulb },
      { id: 'prompts', label: 'Prompts', icon: MessageSquare },
      { id: 'premium-analysis', label: 'Premium Analysis', icon: Crown },
      { id: 'integrations', label: 'Integrations', icon: Plug },
      // Hidden navigation items - keeping functionality but removing from UI
      // { id: 'batch', label: 'Batch Analysis', icon: BarChart3 },
      // { id: 'history', label: 'Analysis History', icon: Target },
      // { id: 'legacy', label: 'Legacy View', icon: History },
    ]
  },
  users: {
    title: 'User Management',
    items: [
      { id: 'users', label: 'All Users', icon: Users },
    ]
  },
  settings: {
    title: 'Settings',
    items: [
      { id: 'settings', label: 'Admin Settings', icon: Settings },
      { id: 'claude', label: 'Applications', icon: Bot },
      { id: 'plans', label: 'Plans & Products', icon: CreditCard },
      { id: 'prompt-manager', label: 'Prompt Manager', icon: Brain },
      { 
        id: 'alerts', 
        label: 'Alerts', 
        icon: Bell, 
        disabled: true,
        badge: 'Soon'
      },
    ]
  },
};
