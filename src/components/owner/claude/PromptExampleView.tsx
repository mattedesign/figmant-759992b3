
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2, Copy } from 'lucide-react';
import { ClaudePromptExample } from '@/hooks/useClaudePromptExamples';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface PromptExampleViewProps {
  prompt: ClaudePromptExample;
  onEdit: () => void;
}

export const PromptExampleView: React.FC<PromptExampleViewProps> = ({ prompt, onEdit }) => {
  const { toast } = useToast();
  const { isOwner } = useAuth();
  
  console.log('👁️ PromptExampleView rendering for prompt:', prompt.id);
  console.log('🔑 User permissions - isOwner:', isOwner);
  
  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🖱️ Edit button clicked for prompt:', prompt.id);
    console.log('🔐 Checking permissions - isOwner:', isOwner);
    
    if (!isOwner) {
      console.log('❌ Permission denied: User is not owner');
      toast({
        title: "Permission Denied",
        description: "You don't have permission to edit prompts",
        variant: "destructive",
      });
      return;
    }
    
    console.log('✅ Permission granted, calling onEdit...');
    try {
      onEdit();
      console.log('✅ onEdit called successfully');
    } catch (error) {
      console.error('❌ Error calling onEdit:', error);
    }
  };

  const handleCopyClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('📋 Copy button clicked for prompt:', prompt.id);
    
    try {
      if (!navigator.clipboard) {
        console.error('❌ Clipboard API not available');
        toast({
          title: "Copy failed",
          description: "Clipboard not available in this browser",
          variant: "destructive",
        });
        return;
      }
      
      await navigator.clipboard.writeText(prompt.original_prompt);
      console.log('✅ Prompt copied to clipboard successfully');
      toast({
        title: "Copied to clipboard",
        description: "Prompt copied successfully",
      });
    } catch (error) {
      console.error('❌ Failed to copy prompt:', error);
      
      // Fallback method for copying
      try {
        const textArea = document.createElement('textarea');
        textArea.value = prompt.original_prompt;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        console.log('✅ Fallback copy method succeeded');
        toast({
          title: "Copied to clipboard",
          description: "Prompt copied successfully",
        });
      } catch (fallbackError) {
        console.error('❌ Fallback copy method failed:', fallbackError);
        toast({
          title: "Copy failed",
          description: "Failed to copy prompt to clipboard",
          variant: "destructive",
        });
      }
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
          {isOwner && (
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
          )}
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
