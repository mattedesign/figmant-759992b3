
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, MessageSquare, Upload, Sparkles } from 'lucide-react';

interface AnalysisPageProps {
  selectedTemplate?: any;
}

export const AnalysisPage: React.FC<AnalysisPageProps> = ({ selectedTemplate }) => {
  const [activeTemplate, setActiveTemplate] = useState(selectedTemplate);

  useEffect(() => {
    if (selectedTemplate) {
      setActiveTemplate(selectedTemplate);
    }
  }, [selectedTemplate]);

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

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Design Analysis</h1>
          <p className="text-muted-foreground">
            Analyze your designs with AI-powered insights
          </p>
        </div>
      </div>

      {activeTemplate && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Selected Template: {activeTemplate.title}
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setActiveTemplate(null)}
              >
                Clear Selection
              </Button>
            </div>
            <CardDescription>
              {activeTemplate.description || 'Ready to use this template for analysis'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge className={getCategoryColor(activeTemplate.category)}>
                {activeTemplate.category.replace('_', ' ')}
              </Badge>
              {activeTemplate.effectiveness_rating && (
                <Badge variant="secondary">
                  Rating: {activeTemplate.effectiveness_rating}/10
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Design
            </CardTitle>
            <CardDescription>
              Upload your design files to start the analysis
              {activeTemplate && ' using the selected template'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Drop your design files here</p>
              <p className="text-muted-foreground mb-4">
                or click to browse (PNG, JPG, PDF, Figma links)
              </p>
              <Button>
                Choose Files
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Chat Analysis
            </CardTitle>
            <CardDescription>
              Have a conversation with AI about your design
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/30 rounded-lg p-4 text-center">
              <Brain className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Upload a design or start a conversation to begin analysis
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
