
import { 
  Home, 
  BarChart3, 
  Star, 
  FileText, 
  CreditCard, 
  Settings, 
  HelpCircle, 
  Shield,
  LucideIcon
} from 'lucide-react';

export interface NavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
  priority: number;
  description?: string;
}

export const navigationConfig = {
  mainItems: [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: Home, 
      priority: 1,
      description: 'Main overview and activity center'
    },
    { 
      id: 'competitor-analysis', 
      label: 'Competitor Analysis', 
      icon: BarChart3, 
      priority: 1,
      description: 'UC-024 - AI-powered competitor insights'
    },
    { 
      id: 'premium-analysis', 
      label: 'Premium Analysis', 
      icon: Star, 
      priority: 1,
      description: 'UC-018 - E-commerce revenue impact predictions'
    },
    { 
      id: 'templates', 
      label: 'Templates', 
      icon: FileText, 
      priority: 1,
      description: 'Analysis templates and prompt management'
    },
    { 
      id: 'credits', 
      label: 'Credits', 
      icon: CreditCard, 
      priority: 1,
      description: 'Credit balance and purchase management'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings, 
      priority: 1,
      description: 'Account preferences and configuration'
    },
  ] as NavigationItem[],
  
  supportItems: [
    { 
      id: 'help-support', 
      label: 'Help & Support', 
      icon: HelpCircle, 
      priority: 2,
      description: 'Documentation and customer support'
    },
  ] as NavigationItem[],
  
  adminItems: [
    { 
      id: 'admin', 
      label: 'Admin Panel', 
      icon: Shield, 
      priority: 2,
      description: 'Administrative tools and user management'
    },
  ] as NavigationItem[]
};

// Helper function to get navigation items by priority
export const getNavigationItemsByPriority = (priority: number) => {
  return navigationConfig.mainItems.filter(item => item.priority <= priority);
};

// Helper function to get all navigation items
export const getAllNavigationItems = () => {
  return [
    ...navigationConfig.mainItems,
    ...navigationConfig.supportItems,
    ...navigationConfig.adminItems
  ];
};
