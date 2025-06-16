
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Star, Download } from 'lucide-react';

export const TemplatesPage: React.FC = () => {
  const templates = [
    {
      id: 1,
      name: 'E-commerce Landing Page',
      description: 'Optimized template for product sales and conversions',
      category: 'E-commerce',
      rating: 4.8,
      downloads: 1205
    },
    {
      id: 2,
      name: 'SaaS Dashboard',
      description: 'Clean and modern dashboard design for web applications',
      category: 'SaaS',
      rating: 4.9,
      downloads: 890
    },
    {
      id: 3,
      name: 'Portfolio Website',
      description: 'Creative portfolio template for designers and developers',
      category: 'Portfolio',
      rating: 4.7,
      downloads: 654
    }
  ];

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Templates</h1>
          <p className="text-muted-foreground">
            Pre-designed templates to accelerate your design analysis workflow
          </p>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-4"></div>
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{template.description}</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {template.category}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span className="text-xs text-muted-foreground">{template.rating}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  <Download className="h-3 w-3 inline mr-1" />
                  {template.downloads} downloads
                </span>
                <Button size="sm" variant="outline">
                  Use Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
