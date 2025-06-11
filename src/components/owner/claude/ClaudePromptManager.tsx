
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Brain, Plus, TrendingUp, Target, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  useClaudePromptExamples, 
  useCreatePromptExample,
  ClaudePromptExample 
} from '@/hooks/useClaudePromptExamples';

const CATEGORIES = [
  { value: 'master', label: 'Master Analysis', icon: Brain },
  { value: 'competitor', label: 'Competitor Analysis', icon: Target },
  { value: 'visual_hierarchy', label: 'Visual Hierarchy', icon: TrendingUp },
  { value: 'copy_messaging', label: 'Copy & Messaging', icon: Zap },
  { value: 'ecommerce_revenue', label: 'E-commerce Revenue', icon: TrendingUp },
  { value: 'ab_testing', label: 'A/B Testing', icon: Target },
  { value: 'general', label: 'General Analysis', icon: Brain }
] as const;

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
              {CATEGORIES.map(category => {
                const prompts = groupedPrompts[category.value] || [];
                const Icon = category.icon;
                
                return (
                  <Card key={category.value}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-lg">
                        <Icon className="h-4 w-4" />
                        <span>{category.label}</span>
                        <Badge variant="secondary">{prompts.length}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {prompts.length === 0 ? (
                        <p className="text-muted-foreground text-sm">No prompts in this category yet.</p>
                      ) : (
                        <div className="space-y-3">
                          {prompts.map(prompt => (
                            <div key={prompt.id} className="border rounded p-3 space-y-2">
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
                                </div>
                              </div>
                              {prompt.description && (
                                <p className="text-sm text-muted-foreground">{prompt.description}</p>
                              )}
                              <div className="text-xs text-muted-foreground">
                                {prompt.use_case_context && `Use Case: ${prompt.use_case_context}`}
                                {prompt.business_domain && ` | Domain: ${prompt.business_domain}`}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>

            {isCreating && (
              <TabsContent value="create" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Create New Prompt Example</CardTitle>
                    <CardDescription>
                      Add a new prompt template for improved Claude responses
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          value={newPrompt.title}
                          onChange={(e) => setNewPrompt(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="e.g., Master UX Analysis Template"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select
                          value={newPrompt.category}
                          onValueChange={(value) => setNewPrompt(prev => ({ ...prev, category: value as any }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map(cat => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="use_case_context">Use Case Context</Label>
                        <Input
                          id="use_case_context"
                          value={newPrompt.use_case_context}
                          onChange={(e) => setNewPrompt(prev => ({ ...prev, use_case_context: e.target.value }))}
                          placeholder="e.g., E-commerce landing page analysis"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="business_domain">Business Domain</Label>
                        <Input
                          id="business_domain"
                          value={newPrompt.business_domain}
                          onChange={(e) => setNewPrompt(prev => ({ ...prev, business_domain: e.target.value }))}
                          placeholder="e.g., E-commerce, SaaS, Healthcare"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newPrompt.description}
                        onChange={(e) => setNewPrompt(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief description of what this prompt is used for..."
                        rows={2}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="original_prompt">Prompt Template *</Label>
                      <Textarea
                        id="original_prompt"
                        value={newPrompt.original_prompt}
                        onChange={(e) => setNewPrompt(prev => ({ ...prev, original_prompt: e.target.value }))}
                        placeholder="Enter the optimized prompt template here..."
                        rows={6}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="claude_response">Expected Response Pattern *</Label>
                      <Textarea
                        id="claude_response"
                        value={newPrompt.claude_response}
                        onChange={(e) => setNewPrompt(prev => ({ ...prev, claude_response: e.target.value }))}
                        placeholder="Example of the type of response this prompt should generate..."
                        rows={4}
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsCreating(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleCreatePrompt}
                        disabled={createPromptMutation.isPending}
                      >
                        {createPromptMutation.isPending ? 'Creating...' : 'Create Prompt'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
