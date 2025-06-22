
import React from 'react';
import { ChevronRight, Copy, PlayCircle, Download, History, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { EditorSection } from '../config/editorSections';

interface SectionNavigationProps {
  sections: EditorSection[];
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  validationErrors: Record<string, string>;
  formData: any;
}

const quickActions = [
  { label: 'Duplicate Template', icon: Copy },
  { label: 'Test Prompt', icon: PlayCircle },
  { label: 'Export Template', icon: Download },
  { label: 'View History', icon: History },
  { label: 'Delete Template', icon: Trash2, variant: 'destructive' as const }
];

export const SectionNavigation: React.FC<SectionNavigationProps> = ({
  sections,
  activeSection,
  onSectionChange,
  validationErrors,
  formData
}) => {
  const getSectionStatus = (section: EditorSection) => {
    const hasErrors = section.fields.some(field => validationErrors[field]);
    const isComplete = section.fields.every(field => {
      const value = formData[field];
      return value !== undefined && value !== '' && value !== null;
    });
    
    return { hasErrors, isComplete };
  };

  return (
    <nav className="w-64 border-r bg-muted/30 p-4 flex flex-col h-full">
      <div className="flex-1">
        <h3 className="font-medium text-sm text-muted-foreground mb-4 uppercase tracking-wide">
          Sections
        </h3>
        
        <div className="space-y-2">
          {sections.map((section) => {
            const { hasErrors, isComplete } = getSectionStatus(section);
            const isActive = activeSection === section.id;
            
            return (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors group",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-muted",
                  hasErrors && "border-l-4 border-destructive"
                )}
              >
                <section.icon className="h-5 w-5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{section.label}</div>
                  <div className="text-xs opacity-70 truncate">
                    {section.description}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {hasErrors && (
                      <Badge variant="destructive" className="text-xs">
                        Errors
                      </Badge>
                    )}
                    {isComplete && !hasErrors && (
                      <Badge variant="secondary" className="text-xs">
                        Complete
                      </Badge>
                    )}
                  </div>
                </div>
                {isActive && (
                  <ChevronRight className="h-4 w-4 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="mt-6 p-3 bg-muted rounded-lg">
        <h4 className="font-medium mb-3 text-sm">Quick Actions</h4>
        <div className="space-y-1">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant="ghost"
              size="sm"
              className={cn(
                "w-full justify-start text-xs",
                action.variant === 'destructive' && "text-destructive hover:text-destructive"
              )}
            >
              <action.icon className="h-3 w-3 mr-2" />
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
};
