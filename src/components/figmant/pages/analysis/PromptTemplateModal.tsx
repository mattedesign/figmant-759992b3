
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Star, Target, Users, Lightbulb } from 'lucide-react';

interface PromptTemplateModalProps {
  template: any;
  isOpen: boolean;
  onClose: () => void;
}

export const PromptTemplateModal: React.FC<PromptTemplateModalProps> = ({
  template,
  isOpen,
  onClose
}) => {
  if (!template) return null;

  const getCategoryColor = (category: string) => {
    const colors = {
      master: 'bg-purple-100 text-purple-800',
      competitor: 'bg-blue-100 text-blue-800',
      visual_hierarchy: 'bg-green-100 text-green-800',
      copy_messaging: 'bg-orange-100 text-orange-800',
      ecommerce_revenue: 'bg-red-100 text-red-800',
      ab_testing: 'bg-indigo-100 text-indigo-800',
      premium: 'bg-yellow-100 text-yellow-800',
      general: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>{template.display_name}</span>
            <Badge className={getCategoryColor(template.category)}>
              {template.category.replace('_', ' ').toUpperCase()}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6">
            {/* Description */}
            {template.description && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {template.description}
                </p>
              </div>
            )}

            {/* Effectiveness Rating */}
            {template.effectiveness_rating && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Effectiveness Rating
                </h4>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= template.effectiveness_rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {template.effectiveness_rating}/5
                  </span>
                </div>
              </div>
            )}

            {/* Use Case Context */}
            {template.use_case_context && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Use Case Context
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {template.use_case_context}
                </p>
              </div>
            )}

            {/* Business Domain */}
            {template.business_domain && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Business Domain
                </h4>
                <Badge variant="outline">{template.business_domain}</Badge>
              </div>
            )}

            <Separator />

            {/* Prompt Template */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Prompt Template
              </h4>
              <div className="bg-gray-50 rounded-lg p-4 border">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
                  {template.original_prompt}
                </pre>
              </div>
            </div>

            {/* Metadata */}
            {template.prompt_variables && Object.keys(template.prompt_variables).length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Variables</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(template.prompt_variables).map((key) => (
                    <Badge key={key} variant="outline" className="text-xs">
                      {key}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="text-xs text-gray-500 pt-4 border-t">
              <div>Created: {new Date(template.created_at).toLocaleDateString()}</div>
              <div>Updated: {new Date(template.updated_at).toLocaleDateString()}</div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
