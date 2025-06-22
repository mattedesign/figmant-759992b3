
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, CreditCard, Target, BarChart3, Users, ShoppingCart, FlaskConical, Sparkles } from 'lucide-react';

interface TemplatePreviewModalProps {
  template: any;
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (templateId: string) => void;
}

const getCategoryIcon = (category: string) => {
  switch (category?.toLowerCase()) {
    case 'competitor': return <Target className="h-5 w-5" />;
    case 'e-commerce': return <ShoppingCart className="h-5 w-5" />;
    case 'testing': return <FlaskConical className="h-5 w-5" />;
    case 'accessibility': return <Users className="h-5 w-5" />;
    case 'visual': return <BarChart3 className="h-5 w-5" />;
    default: return <Sparkles className="h-5 w-5" />;
  }
};

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({ 
  template, 
  isOpen, 
  onClose, 
  onSelectTemplate 
}) => {
  if (!template) return null;

  const handleSelectTemplate = () => {
    onSelectTemplate(template.id);
    onClose();
  };

  const contextualFields = template.metadata?.contextual_fields || [];
  const effectivenessRating = template.effectiveness_rating || 4;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              {getCategoryIcon(template.category)}
            </div>
            <div>
              <DialogTitle className="text-xl">{template.title}</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="capitalize">
                  {template.category?.replace('_', ' ')}
                </Badge>
                {effectivenessRating > 8 && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Best Rated
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <DialogDescription className="text-base">
            {template.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Template Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Credit Cost
              </h4>
              <span className="text-2xl font-bold text-blue-600">{template.credit_cost || 3} credits</span>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Effectiveness Rating</h4>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < effectivenessRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">({effectivenessRating}/5)</span>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Analysis Type</h4>
              <span className="text-sm capitalize">{template.category?.replace('_', ' ')}</span>
            </div>
          </div>
          
          {/* Contextual Fields Preview */}
          {contextualFields.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Fields You'll Complete</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {contextualFields.map((field: any, index: number) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{field.label}</span>
                      {field.required && <span className="text-red-500 text-xs">*Required</span>}
                    </div>
                    {field.placeholder && (
                      <p className="text-xs text-gray-600">{field.placeholder}</p>
                    )}
                    {field.description && (
                      <p className="text-xs text-gray-500 mt-1">{field.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Sample Output */}
          <div>
            <h4 className="font-semibold mb-3">Expected Analysis Output</h4>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-gray-700">
                {template.sample_output || 
                 "Comprehensive analysis with actionable insights, specific recommendations, and implementation guidance tailored to your design and business goals."}
              </p>
            </div>
          </div>

          {/* Additional Details */}
          {template.use_case_context && (
            <div>
              <h4 className="font-semibold mb-3">Best Use Cases</h4>
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <p className="text-sm text-gray-700">{template.use_case_context}</p>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex gap-3">
          <Button variant="outline" onClick={onClose}>
            Close Preview
          </Button>
          <Button onClick={handleSelectTemplate} className="bg-blue-600 hover:bg-blue-700">
            Select This Template ({template.credit_cost || 3} credits)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
