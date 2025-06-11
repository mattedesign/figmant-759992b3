
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  useClaudePromptExamples, 
  useCreatePromptExample,
  ClaudePromptExample 
} from '@/hooks/useClaudePromptExamples';
import { CreatePromptForm } from './CreatePromptForm';
import { PromptCategoryList } from './PromptCategoryList';

export const ClaudePromptManager = () => {
  const { toast } = useToast();
  const { data: promptExamples, isLoading } = useClaudePromptExamples();
  const createPromptMutation = useCreatePromptExample();
  
  const [isCreating, setIsCreating] = useState(false);
  const [newPrompt, setNewPrompt] = useState<Partial<ClaudePromptExample>>({
    title: '',
    description: '',
    category: 'general',
    original_prompt: '',
    claude_response: '',
    effectiveness_rating: 5,
    use_case_context: '',
    business_domain: '',
    is_template: true,
    is_active: true
  });

  const handleCreatePrompt = async () => {
    if (!newPrompt.title || !newPrompt.original_prompt || !newPrompt.claude_response) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in title, prompt, and expected response.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createPromptMutation.mutateAsync(newPrompt as Omit<ClaudePromptExample, 'id' | 'created_at' | 'updated_at'>);
      setNewPrompt({
        title: '',
        description: '',
        category: 'general',
        original_prompt: '',
        claude_response: '',
        effectiveness_rating: 5,
        use_case_context: '',
        business_domain: '',
        is_template: true,
        is_active: true
      });
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating prompt:', error);
    }
  };

  const groupedPrompts = promptExamples?.reduce((acc, prompt) => {
    if (!acc[prompt.category]) {
      acc[prompt.category] = [];
    }
    acc[prompt.category].push(prompt);
    return acc;
  }, {} as Record<string, ClaudePromptExample[]>) || {};

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Claude Prompt Manager</CardTitle>
          <CardDescription>Loading prompt examples...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>Claude Prompt Manager</span>
              </CardTitle>
              <CardDescription>
                Manage and optimize Claude AI prompts for better analysis results
              </CardDescription>
            </div>
            <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
              <Plus className="h-4 w-4 mr-2" />
              Add Prompt
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="examples" className="space-y-4">
            <TabsList>
              <TabsTrigger value="examples">Prompt Examples</TabsTrigger>
              {isCreating && <TabsTrigger value="create">Create New</TabsTrigger>}
            </TabsList>

            <TabsContent value="examples" className="space-y-4">
              <PromptCategoryList groupedPrompts={groupedPrompts} />
            </TabsContent>

            {isCreating && (
              <TabsContent value="create" className="space-y-4">
                <CreatePromptForm
                  newPrompt={newPrompt}
                  setNewPrompt={setNewPrompt}
                  onSave={handleCreatePrompt}
                  onCancel={() => setIsCreating(false)}
                  isSaving={createPromptMutation.isPending}
                />
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
