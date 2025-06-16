
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
  
  const handleEditClick = () => {
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
    onEdit();
  };

  const handleCopyClick = async () => {
    console.log('📋 Copy button clicked for prompt:', prompt.id);
    
    try {
      await navigator.clipboard.writeText(prompt.original_prompt);
      console.log('✅ Prompt copied to clipboard successfully');
      toast({
        title: "Copied to clipboard",
        description: "Prompt copied successfully",
      });
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
    <div className="border rounded-lg p-4 space-y-3 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-lg text-gray-900 truncate">{prompt.title}</h4>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge variant="outline" className="text-xs">
              {prompt.category}
            </Badge>
            {prompt.effectiveness_rating && (
              <Badge variant="secondary" className="text-xs">
                ⭐ {prompt.effectiveness_rating}/5
              </Badge>
            )}
            {prompt.is_template && (
              <Badge variant="default" className="text-xs">
                Template
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleCopyClick}
            className="h-8 w-8 p-0"
            title="Copy prompt"
          >
            <Copy className="h-4 w-4" />
          </Button>
          {isOwner && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleEditClick}
              className="h-8 w-8 p-0"
              title="Edit prompt"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {prompt.description && (
        <p className="text-sm text-gray-600 leading-relaxed">{prompt.description}</p>
      )}
      
      <div className="bg-gray-50 rounded-md p-3">
        <p className="text-sm font-mono text-gray-800 leading-relaxed">
          {prompt.original_prompt.length > 200 
            ? `${prompt.original_prompt.substring(0, 200)}...` 
            : prompt.original_prompt
          }
        </p>
      </div>
      
      {(prompt.use_case_context || prompt.business_domain) && (
        <div className="text-xs text-gray-500 border-t pt-2">
          {prompt.use_case_context && (
            <span>Use Case: {prompt.use_case_context}</span>
          )}
          {prompt.use_case_context && prompt.business_domain && <span> | </span>}
          {prompt.business_domain && (
            <span>Domain: {prompt.business_domain}</span>
          )}
        </div>
      )}
    </div>
  );
};
