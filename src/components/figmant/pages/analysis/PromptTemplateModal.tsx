
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, X } from 'lucide-react';
import { useFigmantPromptTemplates } from '@/hooks/useFigmantChatAnalysis';

interface PromptTemplateModalProps {
  template?: any;
  isOpen: boolean;
  onClose: () => void;
  onTemplateSelect?: (templateId: string) => void;
}

export const PromptTemplateModal: React.FC<PromptTemplateModalProps> = ({
  template,
  isOpen,
  onClose,
  onTemplateSelect
}) => {
  const { data: figmantTemplates = [] } = useFigmantPromptTemplates();

  if (!template) return null;

  const handleTemplateChange = (newTemplateId: string) => {
    if (onTemplateSelect) {
      onTemplateSelect(newTemplateId);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            Template Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Current Template Info */}
          <div className="p-4 bg-blue-50 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{template.category}</Badge>
              <span className="font-medium">{template.display_name}</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{template.description}</p>
            
            <div className="bg-white p-3 rounded border">
              <h4 className="font-medium mb-2">Prompt Template:</h4>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto">
                {template.original_prompt}
              </pre>
            </div>
          </div>

          {/* Template Selection */}
          <div>
            <h3 className="font-medium mb-3">Choose a Different Template:</h3>
            <div className="grid gap-3">
              {figmantTemplates.map((tmpl) => (
                <div 
                  key={tmpl.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    tmpl.id === template.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleTemplateChange(tmpl.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {tmpl.category}
                        </Badge>
                        <span className="font-medium">{tmpl.display_name}</span>
                      </div>
                      <p className="text-sm text-gray-600">{tmpl.description}</p>
                    </div>
                    {tmpl.id === template.id && (
                      <Badge variant="default" className="ml-2">Current</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
