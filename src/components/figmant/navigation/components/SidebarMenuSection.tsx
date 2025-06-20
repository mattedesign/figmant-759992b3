
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
                  backgroundColor: '#D8F1FF'
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
              e.currentTarget.style.backgroundColor = '#D8F1FF';
              // Apply hover styles to icon container
              const iconContainer = e.currentTarget.querySelector('.icon-container') as HTMLElement;
              if (iconContainer) {
                iconContainer.style.background = '#FFF';
                iconContainer.style.color = '#1812E9';
              }
            }
          }}
          onMouseLeave={(e) => {
            if (activeSection !== item.id) {
              e.currentTarget.style.color = '#6B7280';
              e.currentTarget.style.backgroundColor = 'transparent';
              // Reset icon container styles
              const iconContainer = e.currentTarget.querySelector('.icon-container') as HTMLElement;
              if (iconContainer) {
                iconContainer.style.background = '';
                iconContainer.style.color = '';
              }
            }
          }}
        >
          <div 
            className={cn("icon-container flex justify-center items-center mr-2 transition-all duration-200")}
            style={
              activeSection === item.id 
                ? {
                    display: 'flex',
                    padding: '8px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    borderRadius: '8px',
                    background: '#FFF',
                    color: '#1812E9'
                  }
                : {
                    display: 'flex',
                    padding: '8px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    borderRadius: '8px'
                  }
            }
          >
            <item.icon 
              className="h-4 w-4"
              style={{ 
                color: 'inherit'
              }}
            />
          </div>
          <span className="font-medium text-sm flex-1 text-left">
            {item.label}
          </span>
        </Button>
      ))}
    </div>
  );
};
