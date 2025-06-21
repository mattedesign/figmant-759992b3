
import { 
  Home, 
  BarChart3, 
  Star, 
  FileText, 
  CreditCard, 
  Settings, 
  HelpCircle, 
  Shield,
  Wand2,
  User,
  LucideIcon
} from 'lucide-react';

export interface NavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
  priority: number;
  description?: string;
  hidden?: boolean;
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
      id: 'analysis', 
      label: 'Analysis', 
      icon: BarChart3, 
      priority: 1,
      description: 'UC-024 - AI-powered competitor insights'
    },
    { 
      id: 'wizard-analysis', 
      label: 'Wizard Analysis', 
      icon: Wand2, 
      priority: 1,
      description: 'Step-by-step guided analysis workflow'
    },
    { 
      id: 'premium-analysis', 
      label: 'Premium Analysis', 
      icon: Star, 
      priority: 1,
      description: 'UC-018 - E-commerce revenue impact predictions',
      hidden: true
    },
    { 
      id: 'templates', 
      label: 'Templates', 
      icon: FileText, 
      priority: 1,
      description: 'Analysis templates and prompt management'
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: User, 
      priority: 1,
      description: 'User profile and account management'
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

// Helper function to get navigation items by priority, filtering out hidden items
export const getNavigationItemsByPriority = (priority: number) => {
  return navigationConfig.mainItems.filter(item => item.priority <= priority && !item.hidden);
};

// Helper function to get all navigation items, filtering out hidden items
export const getAllNavigationItems = () => {
  const visibleMainItems = navigationConfig.mainItems.filter(item => !item.hidden);
  return [
    ...visibleMainItems,
    ...navigationConfig.supportItems,
    ...navigationConfig.adminItems
  ];
};
