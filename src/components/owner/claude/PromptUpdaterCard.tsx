
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  useClaudePromptExamplesByCategory, 
  useUpdatePromptExample
} from '@/hooks/useClaudePromptExamples';
import { PROMPT_TEMPLATES } from '@/constants/promptTemplates';
import { PromptUpdaterProps, PromptUpdateStatus } from '@/types/promptTypes';

export const PromptUpdaterCard: React.FC<PromptUpdaterProps> = ({ 
  templateId, 
  icon: Icon, 
  accentColor 
}) => {
  const { toast } = useToast();
  const template = PROMPT_TEMPLATES.find(t => t.id === templateId);
  
  if (!template) {
    throw new Error(`Template with id ${templateId} not found`);
  }

  const { data: prompts, isLoading } = useClaudePromptExamplesByCategory(template.category);
  const updatePromptMutation = useUpdatePromptExample();
  const [updateStatus, setUpdateStatus] = useState<PromptUpdateStatus>({ status: 'idle' });

  const targetPrompt = template.findPromptCriteria(prompts);

  const handleUpdatePrompt = async () => {
    if (!targetPrompt) {
      toast({
        title: "Error",
        description: `${template.title.replace(' Update', '')} not found`,
        variant: "destructive",
      });
      return;
    }

    setUpdateStatus({ status: 'updating' });
    try {
      await updatePromptMutation.mutateAsync({
        id: targetPrompt.id,
        updates: {
          original_prompt: template.content,
          description: template.description,
          effectiveness_rating: 5,
          updated_at: new Date().toISOString()
        }
      });
      
      setUpdateStatus({ status: 'success' });
      toast({
        title: "Success",
        description: template.successMessage,
      });
    } catch (error) {
      setUpdateStatus({ status: 'error' });
      toast({
        title: "Error",
        description: `Failed to update the ${template.category} prompt`,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Icon className="h-5 w-5" />
            <span>{template.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading prompt...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Icon className="h-5 w-5" />
          <span>{template.title}</span>
          {updateStatus.status === 'success' && (
            <Badge variant="default" className="bg-green-500">
              <CheckCircle className="h-3 w-3 mr-1" />
              Updated
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!targetPrompt && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {template.title.replace(' Update', '')} not found. Please ensure the prompt exists in the system.
            </AlertDescription>
          </Alert>
        )}

        {targetPrompt && (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Current Prompt: {targetPrompt.title}</h4>
              <p className="text-sm text-muted-foreground mb-2">{targetPrompt.description}</p>
              <div className="text-xs text-muted-foreground">
                Rating: {targetPrompt.effectiveness_rating}/5 | 
                Last updated: {new Date(targetPrompt.updated_at).toLocaleDateString()}
              </div>
            </div>

            <div className={`p-4 bg-${accentColor}-50 border border-${accentColor}-200 rounded-lg`}>
              <h4 className={`font-medium mb-2 text-${accentColor}-900`}>Enhancement Details</h4>
              <ul className={`text-sm text-${accentColor}-800 space-y-1`}>
                {template.enhancementDetails.map((detail, index) => (
                  <li key={index}>• {detail}</li>
                ))}
              </ul>
            </div>

            {updateStatus.status === 'success' && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  {template.successMessage}
                </AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={handleUpdatePrompt} 
              disabled={updateStatus.status === 'updating' || updateStatus.status === 'success'}
              className="w-full"
            >
              {updateStatus.status === 'updating' ? 'Updating Prompt...' : 
               updateStatus.status === 'success' ? 'Prompt Updated Successfully' : 
               `Update ${template.category} Prompt with Enhanced Framework`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
