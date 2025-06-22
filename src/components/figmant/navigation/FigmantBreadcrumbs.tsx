
import React from 'react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { ChevronRight, Home } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface FigmantBreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const FigmantBreadcrumbs: React.FC<FigmantBreadcrumbsProps> = ({ items }) => {
  const location = useLocation();
  
  // Don't render breadcrumbs in analysis, wizard-analysis, or chat contexts
  // These views should have clean, focused interfaces
  const hideBreadcrumbs = location.pathname.includes('/analysis') || 
                         location.pathname.includes('/wizard-analysis') || 
                         location.pathname.includes('/chat') ||
                         location.search.includes('analysis');
  
  if (hideBreadcrumbs) {
    return null;
  }

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/figmant" className="flex items-center gap-1">
            <Home className="h-4 w-4" />
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              {item.isActive ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
