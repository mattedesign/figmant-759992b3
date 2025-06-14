
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Plus, Search, Edit, Copy, Star } from 'lucide-react';
import { useClaudePromptExamples } from '@/hooks/useClaudePromptExamples';

interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  prompt: string;
  variables: string[];
  isTemplate: boolean;
  rating?: number;
}

export const PromptsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { data: promptExamples = [] } = useClaudePromptExamples();

  // Transform prompt examples to template format
  const promptTemplates: PromptTemplate[] = promptExamples.map(example => ({
    id: example.id,
    title: example.title,
    description: example.description || 'Analysis prompt template',
    category: example.category,
    prompt: example.original_prompt,
    variables: Object.keys(example.prompt_variables || {}),
    isTemplate: example.is_template || false,
    rating: example.effectiveness_rating
  }));

  // Add some default templates
  const defaultTemplates: PromptTemplate[] = [
    {
      id: 'ux-analysis',
      title: 'UX Analysis Template',
      description: 'Comprehensive user experience analysis focusing on usability and accessibility',
      category: 'UX Analysis',
      prompt: 'Analyze this design for user experience, focusing on navigation clarity, visual hierarchy, and accessibility. Consider the target audience: {targetAudience} and business goals: {businessGoals}.',
      variables: ['targetAudience', 'businessGoals'],
      isTemplate: true,
      rating: 4.5
    },
    {
      id: 'conversion-optimization',
      title: 'Conversion Optimization',
      description: 'Analysis template focused on conversion rate optimization',
      category: 'Conversion',
      prompt: 'Evaluate this design for conversion optimization. Analyze call-to-action placement, form design, and user flow for the goal: {conversionGoal}. Identify friction points and suggest improvements.',
      variables: ['conversionGoal'],
      isTemplate: true,
      rating: 4.2
    },
    {
      id: 'mobile-responsive',
      title: 'Mobile Responsiveness',
      description: 'Template for analyzing mobile design and responsiveness',
      category: 'Mobile',
      prompt: 'Analyze this design for mobile responsiveness and touch interactions. Consider screen sizes, thumb zones, and mobile-specific usability patterns.',
      variables: [],
      isTemplate: true,
      rating: 4.7
    }
  ];

  const allTemplates = [...defaultTemplates, ...promptTemplates];

  const filteredTemplates = allTemplates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(allTemplates.map(t => t.category)));

  const CreatePromptForm = () => (
    <Card>
      <CardHeader>
        <CardTitle>Create New Prompt Template</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input placeholder="Template Title" />
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Input placeholder="Description" />
        <Textarea 
          placeholder="Enter your prompt template here. Use {variableName} for dynamic variables." 
          rows={6}
        />
        <div className="flex gap-2">
          <Button>Save Template</Button>
          <Button variant="outline" onClick={() => setShowCreateForm(false)}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analysis Prompts</h1>
          <p className="text-muted-foreground">
            Manage and customize AI analysis prompts for different design scenarios
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      {showCreateForm && <CreatePromptForm />}

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="custom">Custom Prompts</TabsTrigger>
          <TabsTrigger value="history">Usage History</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Templates Grid */}
          <div className="grid gap-4">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-5 w-5 text-blue-500" />
                      <div>
                        <CardTitle className="text-lg">{template.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{template.category}</Badge>
                          {template.isTemplate && <Badge>Template</Badge>}
                          {template.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm text-muted-foreground">{template.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-3">{template.description}</p>
                  <div className="bg-muted/30 p-3 rounded-md mb-3">
                    <p className="text-sm font-mono">{template.prompt}</p>
                  </div>
                  {template.variables.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Variables:</p>
                      <div className="flex gap-2 flex-wrap">
                        {template.variables.map(variable => (
                          <Badge key={variable} variant="secondary">{variable}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Templates Found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or create a new template.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="custom">
          <Card>
            <CardContent className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Custom Prompts</h3>
              <p className="text-muted-foreground">
                Your custom prompt templates will appear here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardContent className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Usage History</h3>
              <p className="text-muted-foreground">
                Track how your prompts perform over time.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
