
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { PromptSeeder } from './PromptSeeder';

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

  const isEmpty = !promptExamples || promptExamples.length === 0;

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
          <Tabs defaultValue={isEmpty ? "seed" : "examples"} className="space-y-4">
            <TabsList>
              <TabsTrigger value="examples">Prompt Examples ({promptExamples?.length || 0})</TabsTrigger>
              {isEmpty && <TabsTrigger value="seed">Seed Database</TabsTrigger>}
              {isCreating && <TabsTrigger value="create">Create New</TabsTrigger>}
            </TabsList>

            <TabsContent value="examples" className="space-y-4">
              {isEmpty ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    No prompts found. Seed the database with initial templates to get started.
                  </p>
                  <Button onClick={() => setIsCreating(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Prompt
                  </Button>
                </div>
              ) : (
                <PromptCategoryList groupedPrompts={groupedPrompts} />
              )}
            </TabsContent>

            {isEmpty && (
              <TabsContent value="seed" className="space-y-4">
                <PromptSeeder />
              </TabsContent>
            )}

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
