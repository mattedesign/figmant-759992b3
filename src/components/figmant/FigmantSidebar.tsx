
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart3, 
  Search, 
  Home, 
  Star, 
  FileText, 
  CreditCard, 
  Settings,
  Bell,
  Activity,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { NotificationCenter } from './notifications/NotificationCenter';
import { RealTimeStatusIndicator } from './status/RealTimeStatusIndicator';

interface FigmantSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const FigmantSidebar: React.FC<FigmantSidebarProps> = ({
  activeSection,
  onSectionChange
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['main']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const mainSections = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'analysis', label: 'Analysis', icon: BarChart3, badge: '12' },
    { id: 'search', label: 'Smart Search', icon: Search },
  ];

  const toolsSections = [
    { id: 'premium-analysis', label: 'Premium Analysis', icon: Star, badge: 'Pro' },
    { id: 'templates', label: 'Templates', icon: FileText },
  ];

  const accountSections = [
    { id: 'credits', label: 'Credits', icon: CreditCard, badge: '47' },
    { id: 'preferences', label: 'Preferences', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Figmant</h1>
        <p className="text-sm text-gray-600">AI Design Analysis</p>
      </div>

      {/* Real-time Status */}
      <div className="p-4 border-b border-gray-200">
        <RealTimeStatusIndicator />
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Main Section */}
        <div>
          <button
            onClick={() => toggleSection('main')}
            className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-900 mb-3"
          >
            <span>Main</span>
            {expandedSections.includes('main') ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          
          {expandedSections.includes('main') && (
            <div className="space-y-1">
              {mainSections.map((section) => (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? 'secondary' : 'ghost'}
                  className={cn(
                    "w-full justify-start",
                    activeSection === section.id && "bg-blue-50 text-blue-700 border-blue-200"
                  )}
                  onClick={() => onSectionChange(section.id)}
                >
                  <section.icon className="h-4 w-4 mr-3" />
                  {section.label}
                  {section.badge && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {section.badge}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Tools Section */}
        <div>
          <button
            onClick={() => toggleSection('tools')}
            className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-900 mb-3"
          >
            <span>Tools</span>
            {expandedSections.includes('tools') ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          
          {expandedSections.includes('tools') && (
            <div className="space-y-1">
              {toolsSections.map((section) => (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? 'secondary' : 'ghost'}
                  className={cn(
                    "w-full justify-start",
                    activeSection === section.id && "bg-blue-50 text-blue-700 border-blue-200"
                  )}
                  onClick={() => onSectionChange(section.id)}
                >
                  <section.icon className="h-4 w-4 mr-3" />
                  {section.label}
                  {section.badge && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {section.badge}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Account Section */}
        <div>
          <button
            onClick={() => toggleSection('account')}
            className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-900 mb-3"
          >
            <span>Account</span>
            {expandedSections.includes('account') ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          
          {expandedSections.includes('account') && (
            <div className="space-y-1">
              {accountSections.map((section) => (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? 'secondary' : 'ghost'}
                  className={cn(
                    "w-full justify-start",
                    activeSection === section.id && "bg-blue-50 text-blue-700 border-blue-200"
                  )}
                  onClick={() => onSectionChange(section.id)}
                >
                  <section.icon className="h-4 w-4 mr-3" />
                  {section.label}
                  {section.badge && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {section.badge}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer with Notifications */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications
              <Badge variant="secondary" className="ml-auto text-xs">
                3
              </Badge>
            </Button>
            <NotificationCenter 
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
            />
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-start"
          onClick={() => setShowActivity(!showActivity)}
        >
          <Activity className="h-4 w-4 mr-2" />
          Activity
        </Button>
      </div>
    </div>
  );
};
