
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile, useIsSmallMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  const isSmallMobile = useIsSmallMobile();

  return (
    <div className="space-y-1">
      {title && (
        <h3 
          className={cn(
            "text-xs font-medium uppercase tracking-wide mb-2",
            isMobile ? "px-4" : "px-3"
          )}
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
            "hover:bg-transparent active:bg-transparent focus:bg-transparent",
            // Mobile-specific touch target sizing
            isMobile && "min-h-[48px]",
            isSmallMobile && "min-h-[52px]"
          )}
          style={
            activeSection === item.id 
              ? {
                  display: 'flex',
                  height: isMobile ? (isSmallMobile ? '52px' : '48px') : '40px',
                  padding: isMobile ? '0px 16px 0px 8px' : '0px 12px 0px 4px',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  alignSelf: 'stretch',
                  overflow: 'hidden',
                  color: '#1812E9',
                  textOverflow: 'ellipsis',
                  fontFamily: '"Instrument Sans"',
                  fontSize: isMobile ? '14px' : '12px',
                  fontStyle: 'normal',
                  fontWeight: '500',
                  lineHeight: isMobile ? '20px' : '16px',
                  letterSpacing: isMobile ? '-0.14px' : '-0.12px',
                  backgroundColor: '#D8F1FF'
                }
              : {
                  display: 'flex',
                  height: isMobile ? (isSmallMobile ? '52px' : '48px') : '40px',
                  padding: isMobile ? '0px 16px 0px 8px' : '0px 12px 0px 4px',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  alignSelf: 'stretch',
                  overflow: 'hidden',
                  color: '#6B7280',
                  textOverflow: 'ellipsis',
                  fontFamily: '"Instrument Sans"',
                  fontSize: isMobile ? '14px' : '12px',
                  fontStyle: 'normal',
                  fontWeight: '500',
                  lineHeight: isMobile ? '20px' : '16px',
                  letterSpacing: isMobile ? '-0.14px' : '-0.12px',
                  backgroundColor: 'transparent'
                }
          }
          onMouseEnter={(e) => {
            // Only apply hover effects on non-touch devices
            if (!isMobile && activeSection !== item.id) {
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
            // Only apply hover effects on non-touch devices
            if (!isMobile && activeSection !== item.id) {
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
          // Add touch-specific feedback for mobile
          onTouchStart={(e) => {
            if (isMobile && activeSection !== item.id) {
              e.currentTarget.style.backgroundColor = '#F0F8FF';
            }
          }}
          onTouchEnd={(e) => {
            if (isMobile && activeSection !== item.id) {
              setTimeout(() => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }, 150);
            }
          }}
        >
          <div 
            className={cn(
              "icon-container flex justify-center items-center transition-all duration-200",
              isMobile ? "mr-3" : "mr-1"
            )}
            style={
              activeSection === item.id 
                ? {
                    display: 'flex',
                    padding: isMobile ? '10px' : '8px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    borderRadius: isMobile ? '10px' : '8px',
                    background: '#FFF',
                    color: '#1812E9'
                  }
                : {
                    display: 'flex',
                    padding: isMobile ? '10px' : '8px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    borderRadius: isMobile ? '10px' : '8px'
                  }
            }
          >
            <item.icon 
              className={cn(
                "flex-shrink-0",
                isMobile ? "h-5 w-5" : "h-4 w-4"
              )}
              style={{ 
                color: 'inherit'
              }}
            />
          </div>
          <span className={cn(
            "font-medium flex-1 text-left truncate",
            isMobile ? "text-sm" : "text-sm"
          )}>
            {item.label}
          </span>
        </Button>
      ))}
    </div>
  );
};
