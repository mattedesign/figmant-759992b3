import { BarChart3, Users, CreditCard, Bot, Settings, Bell, MessageSquare, Target, History, FileText } from 'lucide-react';

export const sectionConfig = {
  workspace: {
    title: 'Design Analysis',
    items: [
      { id: 'design', label: 'AI Chat Analysis', icon: MessageSquare },
      { id: 'all-analysis', label: 'All Analysis', icon: FileText },
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
  products: {
    title: 'Products & Plans',
    items: [
      { id: 'plans', label: 'Subscription Plans', icon: CreditCard },
    ]
  },
  apps: {
    title: 'Applications',
    items: [
      { id: 'claude', label: 'Claude AI', icon: Bot },
    ]
  },
  settings: {
    title: 'Settings',
    items: [
      { id: 'settings', label: 'Admin Settings', icon: Settings },
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
