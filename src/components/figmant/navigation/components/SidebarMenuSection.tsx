
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MenuItem {
  id: string;
  label: string;
  icon: any;
}

interface SidebarMenuSectionProps {
  title?: string;
  items: MenuItem[];
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const SidebarMenuSection: React.FC<SidebarMenuSectionProps> = ({
  title,
  items,
  activeSection,
  onSectionChange
}) => {
  return (
    <div className="space-y-1">
      {title && (
        <h3 
          className="text-xs font-medium px-3 mb-2 uppercase tracking-wide"
          style={{ color: '#6B7280' }}
        >
          {title}
        </h3>
      )}
      {items.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          onClick={() => onSectionChange(item.id)}
          className={cn(
            "w-full justify-start transition-all duration-200 border-none shadow-none group",
            "hover:bg-transparent"
          )}
          style={
            activeSection === item.id 
              ? {
                  display: 'flex',
                  height: '40px',
                  padding: '0px 12px 0px 4px',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  alignSelf: 'stretch',
                  overflow: 'hidden',
                  color: '#1812E9',
                  textOverflow: 'ellipsis',
                  fontFamily: '"Instrument Sans"',
                  fontSize: '12px',
                  fontStyle: 'normal',
                  fontWeight: '500',
                  lineHeight: '16px',
                  letterSpacing: '-0.12px',
                  backgroundColor: 'transparent'
                }
              : {
                  display: 'flex',
                  height: '40px',
                  padding: '0px 12px 0px 4px',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  alignSelf: 'stretch',
                  overflow: 'hidden',
                  color: '#6B7280',
                  textOverflow: 'ellipsis',
                  fontFamily: '"Instrument Sans"',
                  fontSize: '12px',
                  fontStyle: 'normal',
                  fontWeight: '500',
                  lineHeight: '16px',
                  letterSpacing: '-0.12px',
                  backgroundColor: 'transparent'
                }
          }
          onMouseEnter={(e) => {
            if (activeSection !== item.id) {
              e.currentTarget.style.color = '#1812E9';
            }
          }}
          onMouseLeave={(e) => {
            if (activeSection !== item.id) {
              e.currentTarget.style.color = '#6B7280';
            }
          }}
        >
          <item.icon 
            className={cn(
              "h-5 w-5 mr-3",
              activeSection === item.id 
                ? "text-blue-600" 
                : "text-gray-500 group-hover:text-blue-600"
            )}
          />
          <span className="font-medium text-sm flex-1 text-left">
            {item.label}
          </span>
        </Button>
      ))}
    </div>
  );
};
