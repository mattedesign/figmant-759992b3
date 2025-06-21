
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { 
  User, 
  Mail, 
  MapPin, 
  Shield, 
  CreditCard, 
  Link2, 
  Settings, 
  Bell, 
  Key,
  BarChart3,
  Database
} from 'lucide-react';

interface ProfileSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isMobile: boolean;
}

const sidebarSections = [
  {
    id: 'personal',
    label: 'Personal Info',
    icon: User,
    description: 'Name, photo, and basic details'
  },
  {
    id: 'contact',
    label: 'Contact Details',
    icon: Mail,
    description: 'Email and phone information'
  },
  {
    id: 'address',
    label: 'Address',
    icon: MapPin,
    description: 'Location and shipping details'
  },
  {
    id: 'security',
    label: 'Security',
    icon: Shield,
    description: 'Password and two-factor auth'
  },
  {
    id: 'billing',
    label: 'Billing & Payments',
    icon: CreditCard,
    description: 'Payment methods and billing'
  },
  {
    id: 'connected-accounts',
    label: 'Connected Accounts',
    icon: Link2,
    description: 'Social media and integrations'
  },
  {
    id: 'preferences',
    label: 'Preferences',
    icon: Settings,
    description: 'App settings and customization'
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    description: 'Email and push preferences'
  },
  {
    id: 'api-access',
    label: 'API & Integrations',
    icon: Key,
    description: 'API keys and third-party access'
  },
  {
    id: 'analytics',
    label: 'Usage Analytics',
    icon: BarChart3,
    description: 'Your activity and insights'
  },
  {
    id: 'data-export',
    label: 'Data & Privacy',
    icon: Database,
    description: 'Export data and privacy settings'
  },
];

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  activeSection,
  onSectionChange,
  isMobile
}) => {
  if (isMobile) {
    return (
      <Card>
        <CardContent className="p-4">
          {/* Enhanced responsive grid that works on mobile and tablet */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-2 gap-2">
            {sidebarSections.map((section) => {
              const Icon = section.icon;
              return (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? "default" : "ghost"}
                  className={cn(
                    "justify-center h-auto p-3 text-center flex-col min-h-[80px]",
                    activeSection === section.id && "bg-blue-50 border-blue-200 text-blue-700"
                  )}
                  onClick={() => onSectionChange(section.id)}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Icon className="h-5 w-5" />
                    <span className="text-xs leading-tight">{section.label}</span>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Settings</h2>
        
        {sidebarSections.map((section) => {
          const Icon = section.icon;
          return (
            <Button
              key={section.id}
              variant="ghost"
              className={cn(
                "w-full justify-start h-auto p-4 text-left",
                activeSection === section.id && "bg-blue-50 border border-blue-200 text-blue-700"
              )}
              onClick={() => onSectionChange(section.id)}
            >
              <div className="flex items-start gap-3">
                <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-medium">{section.label}</div>
                  <div className="text-sm text-gray-500 mt-1">{section.description}</div>
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
