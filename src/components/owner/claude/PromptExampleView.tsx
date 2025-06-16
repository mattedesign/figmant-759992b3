
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2, Copy } from 'lucide-react';
import { ClaudePromptExample } from '@/hooks/useClaudePromptExamples';
import { useToast } from '@/hooks/use-toast';

interface PromptExampleViewProps {
  prompt: ClaudePromptExample;
  onEdit: () => void;
}

export const PromptExampleView: React.FC<PromptExampleViewProps> = ({ prompt, onEdit }) => {
  const { toast } = useToast();
  
  console.log('👁️ PromptExampleView rendering for prompt:', prompt.id);
  
  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🖱️ Edit button clicked for prompt:', prompt.id);
    console.log('🔄 Calling onEdit function...');
    onEdit();
    console.log('✅ onEdit function called');
  };

  const handleCopyClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('📋 Copy button clicked for prompt:', prompt.id);
    
    try {
      await navigator.clipboard.writeText(prompt.original_prompt);
      toast({
        title: "Copied to clipboard",
        description: "Prompt copied successfully",
      });
      console.log('✅ Prompt copied to clipboard');
    } catch (error) {
      console.error('❌ Failed to copy prompt:', error);
      toast({
        title: "Copy failed",
        description: "Failed to copy prompt to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="border rounded p-3 space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{prompt.title}</h4>
        <div className="flex items-center space-x-2">
          {prompt.effectiveness_rating && (
            <Badge variant="outline">
              ⭐ {prompt.effectiveness_rating}/5
            </Badge>
          )}
          {prompt.is_template && (
            <Badge variant="secondary">Template</Badge>
          )}
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleCopyClick}
            className="hover:bg-gray-100 border border-gray-200"
            type="button"
            title="Copy prompt"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleEditClick}
            className="hover:bg-gray-100 border border-gray-200"
            type="button"
            title="Edit prompt"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {prompt.description && (
        <p className="text-sm text-muted-foreground">{prompt.description}</p>
      )}
      <div className="text-xs text-muted-foreground">
        {prompt.use_case_context && `Use Case: ${prompt.use_case_context}`}
        {prompt.business_domain && ` | Domain: ${prompt.business_domain}`}
      </div>
      <div className="text-xs text-muted-foreground truncate">
        Prompt: {prompt.original_prompt.substring(0, 100)}...
      </div>
    </div>
  );
};
