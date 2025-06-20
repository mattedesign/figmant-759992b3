
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuGroup, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { Target, TrendingUp, Eye, MoreHorizontal, Check, Palette, Users, Shield } from 'lucide-react';
import { FigmantPromptTemplate } from '@/hooks/prompts/useFigmantPromptTemplates';

interface TemplateQuickSelectorProps {
  templates: FigmantPromptTemplate[];
  selectedTemplate?: string;
  onTemplateSelect: (templateId: string) => void;
}

export const TemplateQuickSelector: React.FC<TemplateQuickSelectorProps> = ({
  templates,
  selectedTemplate,
  onTemplateSelect
}) => {
  // Quick access templates with icons
  const quickTemplates = [
    { id: 'uc024_competitor_analysis', label: 'Competitor Analysis', icon: Target },
    { id: 'conversion_optimization', label: 'Conversion', icon: TrendingUp },
    { id: 'visual_hierarchy', label: 'Visual Hierarchy', icon: Eye },
    { id: 'design_system_validation', label: 'Design System', icon: Palette },
    { id: 'accessibility_review', label: 'Accessibility', icon: Shield },
  ];

  // Group remaining templates by category
  const templatesByCategory = templates.reduce((acc, template) => {
    const category = template.category || 'general';
    if (!acc[category]) acc[category] = [];
    acc[category].push(template);
    return acc;
  }, {} as Record<string, FigmantPromptTemplate[]>);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Quick Access Buttons */}
      {quickTemplates.map(({ id, label, icon: Icon }) => {
        const template = templates.find(t => t.id === id);
        if (!template) return null;
        
        return (
          <Button
            key={id}
            variant={selectedTemplate === id ? 'default' : 'outline'}
            size="sm"
            onClick={() => onTemplateSelect(id)}
            className="h-8 text-xs"
          >
            <Icon className="h-3 w-3 mr-1" />
            {label}
          </Button>
        );
      })}

      {/* All Templates Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            <MoreHorizontal className="h-3 w-3 mr-1" />
            All Templates
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-80 max-h-96 overflow-y-auto bg-white border shadow-lg z-50">
          {Object.entries(templatesByCategory).map(([category, categoryTemplates]) => (
            <DropdownMenuGroup key={category}>
              <DropdownMenuLabel className="text-xs uppercase tracking-wide text-muted-foreground px-2 py-1">
                {category.replace('_', ' ')}
              </DropdownMenuLabel>
              {categoryTemplates.map((template) => (
                <DropdownMenuItem
                  key={template.id}
                  onClick={() => onTemplateSelect(template.id)}
                  className="cursor-pointer p-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{template.displayName}</span>
                      {selectedTemplate === template.id && (
                        <Check className="h-3 w-3 text-primary flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {template.description}
                    </p>
                    {template.metadata?.best_for && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {template.metadata.best_for.slice(0, 2).map((use: string, idx: number) => (
                          <Badge key={idx} variant="secondary" className="text-xs px-1 py-0">
                            {use}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
