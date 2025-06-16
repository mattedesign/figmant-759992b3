
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2, Copy } from 'lucide-react';
import { ClaudePromptExample } from '@/hooks/useClaudePromptExamples';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface PromptTemplateViewProps {
  template: ClaudePromptExample;
  onEdit: () => void;
}

export const PromptTemplateView: React.FC<PromptTemplateViewProps> = ({ template, onEdit }) => {
  const { toast } = useToast();
  const { isOwner, loading } = useAuth();
  
  console.log('👁️ PromptTemplateView rendering for template:', template.id);
  console.log('🔑 User permissions - isOwner:', isOwner, 'loading:', loading);
  
  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🖱️ Edit button clicked for template:', template.id);
    console.log('🔐 Checking permissions - isOwner:', isOwner, 'loading:', loading);
    
    if (loading) {
      console.log('⏳ Auth still loading, showing loading message');
      toast({
        title: "Loading",
        description: "Please wait while we verify your permissions",
      });
      return;
    }
    
    if (!isOwner) {
      console.log('❌ Permission denied: User is not owner');
      toast({
        title: "Permission Denied",
        description: "You don't have permission to edit prompt templates",
        variant: "destructive",
      });
      return;
    }
    
    console.log('✅ Permission granted, calling onEdit...');
    onEdit();
    
    // Additional feedback for debugging
    toast({
      title: "Edit Mode",
      description: "Switching to edit mode...",
    });
  };

  const handleCopyClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('📋 Copy button clicked for template:', template.id);
    
    try {
      await navigator.clipboard.writeText(template.original_prompt);
      console.log('✅ Prompt template copied to clipboard successfully');
      toast({
        title: "Copied to clipboard",
        description: "Prompt template copied successfully",
      });
    } catch (error) {
      console.error('❌ Failed to copy prompt template:', error);
      toast({
        title: "Copy failed",
        description: "Failed to copy prompt template to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-3 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-lg text-gray-900 truncate">{template.title}</h4>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge variant="outline" className="text-xs">
              {template.category}
            </Badge>
            {template.effectiveness_rating && (
              <Badge variant="secondary" className="text-xs">
                ⭐ {template.effectiveness_rating}/5
              </Badge>
            )}
            {template.is_template && (
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
            title="Copy prompt template"
            type="button"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleEditClick}
            className="h-8 w-8 p-0"
            title="Edit prompt template"
            type="button"
            disabled={loading}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          {/* Debug info for troubleshooting */}
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-gray-500 ml-2">
              {loading ? 'Loading...' : isOwner ? 'Owner' : 'No Access'}
            </div>
          )}
        </div>
      </div>
      
      {template.description && (
        <p className="text-sm text-gray-600 leading-relaxed">{template.description}</p>
      )}
      
      <div className="bg-gray-50 rounded-md p-3">
        <p className="text-sm font-mono text-gray-800 leading-relaxed">
          {template.original_prompt.length > 200 
            ? `${template.original_prompt.substring(0, 200)}...` 
            : template.original_prompt
          }
        </p>
      </div>
      
      {(template.use_case_context || template.business_domain) && (
        <div className="text-xs text-gray-500 border-t pt-2">
          {template.use_case_context && (
            <span>Use Case: {template.use_case_context}</span>
          )}
          {template.use_case_context && template.business_domain && <span> | </span>}
          {template.business_domain && (
            <span>Domain: {template.business_domain}</span>
          )}
        </div>
      )}
    </div>
  );
};
