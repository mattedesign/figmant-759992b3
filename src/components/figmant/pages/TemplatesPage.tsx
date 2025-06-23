import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Star, Brain, Target, TrendingUp, Zap, Crown, Sparkles } from 'lucide-react';
import { useClaudePromptExamples } from '@/hooks/useClaudePromptExamples';
import { useNavigate, useLocation } from 'react-router-dom';

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'master': return Brain;
    case 'competitor': return Target;
    case 'visual_hierarchy': return TrendingUp;
    case 'copy_messaging': return Zap;
    case 'ecommerce_revenue': return TrendingUp;
    case 'ab_testing': return Target;
    case 'premium': return Crown;
    default: return Brain;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'master': return 'bg-purple-100 text-purple-800';
    case 'competitor': return 'bg-blue-100 text-blue-800';
    case 'visual_hierarchy': return 'bg-green-100 text-green-800';
    case 'copy_messaging': return 'bg-orange-100 text-orange-800';
    case 'ecommerce_revenue': return 'bg-emerald-100 text-emerald-800';
    case 'ab_testing': return 'bg-pink-100 text-pink-800';
    case 'premium': return 'bg-amber-100 text-amber-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const TemplatesPage: React.FC = () => {
  const { data: promptTemplates = [], isLoading } = useClaudePromptExamples();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleUseTemplate = (template) => {
    // CRITICAL: Don't navigate if we're currently in wizard mode
    // This prevents Templates page from interfering with wizard flow
    if (window.location.pathname.includes('wizard-analysis') || 
        location.pathname.includes('wizard') ||
        location.state?.activeSection === 'wizard-analysis') {
      console.log('🚫 Wizard mode detected - Templates page ignoring navigation to prevent interference');
      return;
    }
    
    // Only navigate if we're explicitly on the templates page
    // and not in any wizard context
    console.log('✅ Templates page - navigating to analysis with template:', template.title);
    navigate('/figmant', { 
      state: { 
        activeSection: 'analysis',
        selectedTemplate: template
      }
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 h-full overflow-y-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Prompt Templates</h1>
          <p className="text-muted-foreground">
            Choose from optimized analysis templates to enhance your design insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {promptTemplates.length} templates available
          </Badge>
        </div>
      </div>

      {promptTemplates.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Templates Available</h3>
            <p className="text-muted-foreground">
              Prompt templates will appear here once they are created by administrators.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promptTemplates.map((template) => {
            const IconComponent = getCategoryIcon(template.category);
            
            return (
              <Card key={template.id} className="transition-all hover:shadow-md cursor-pointer group">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-5 w-5 text-primary" />
                      <Badge className={getCategoryColor(template.category)}>
                        {template.category.replace('_', ' ')}
                      </Badge>
                    </div>
                    {template.effectiveness_rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs text-muted-foreground">
                          {template.effectiveness_rating}/10
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {template.title}
                  </CardTitle>
                  
                  {template.description && (
                    <CardDescription className="text-sm">
                      {template.description}
                    </CardDescription>
                  )}
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    {template.use_case_context && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Best for:</p>
                        <p className="text-xs">{template.use_case_context}</p>
                      </div>
                    )}
                    
                    {template.business_domain && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Industry:</p>
                        <Badge variant="outline" className="text-xs">
                          {template.business_domain}
                        </Badge>
                      </div>
                    )}
                    
                    <div className="flex gap-2 pt-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1">
                            Preview
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <IconComponent className="h-5 w-5" />
                              {template.title}
                            </DialogTitle>
                            <DialogDescription>
                              {template.description || 'Analysis prompt template'}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Prompt Template:</h4>
                              <div className="bg-muted p-3 rounded-md text-sm max-h-40 overflow-y-auto">
                                {template.original_prompt}
                              </div>
                            </div>
                            {template.claude_response && (
                              <div>
                                <h4 className="font-medium mb-2">Expected Response Style:</h4>
                                <div className="bg-muted/50 p-3 rounded-md text-sm max-h-32 overflow-y-auto">
                                  {template.claude_response.slice(0, 300)}...
                                </div>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleUseTemplate(template)}
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        Use Template
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
