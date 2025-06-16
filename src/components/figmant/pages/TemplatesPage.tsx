
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Star, 
  Download, 
  Eye,
  Smartphone,
  Monitor,
  Globe,
  Palette,
  FileText,
  Image
} from 'lucide-react';

export const TemplatesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Templates', count: 24 },
    { id: 'web', name: 'Web Design', count: 8 },
    { id: 'mobile', name: 'Mobile Apps', count: 6 },
    { id: 'ui', name: 'UI Components', count: 5 },
    { id: 'branding', name: 'Branding', count: 3 },
    { id: 'ecommerce', name: 'E-commerce', count: 2 }
  ];

  const templates = [
    {
      id: '1',
      title: 'E-commerce Homepage Analysis',
      description: 'Comprehensive analysis template for e-commerce landing pages focusing on conversion optimization.',
      category: 'web',
      tags: ['conversion', 'ux', 'commerce'],
      rating: 4.8,
      downloads: 1234,
      preview: '/placeholder-template.jpg',
      icon: Globe,
      isPremium: false
    },
    {
      id: '2',
      title: 'Mobile App UI Evaluation',
      description: 'Complete mobile app interface analysis including usability, accessibility, and design consistency.',
      category: 'mobile',
      tags: ['mobile', 'ui', 'accessibility'],
      rating: 4.9,
      downloads: 987,
      preview: '/placeholder-template.jpg',
      icon: Smartphone,
      isPremium: true
    },
    {
      id: '3',
      title: 'Dashboard Design Review',
      description: 'Analytics dashboard analysis focusing on data visualization, user flow, and information hierarchy.',
      category: 'ui',
      tags: ['dashboard', 'data-viz', 'enterprise'],
      rating: 4.7,
      downloads: 756,
      preview: '/placeholder-template.jpg',
      icon: Monitor,
      isPremium: false
    },
    {
      id: '4',
      title: 'Brand Identity Assessment',
      description: 'Comprehensive brand analysis including logo, color palette, typography, and brand consistency.',
      category: 'branding',
      tags: ['branding', 'identity', 'logo'],
      rating: 4.6,
      downloads: 543,
      preview: '/placeholder-template.jpg',
      icon: Palette,
      isPremium: true
    },
    {
      id: '5',
      title: 'Landing Page Conversion',
      description: 'Specialized template for analyzing landing page effectiveness and conversion optimization.',
      category: 'web',
      tags: ['landing', 'conversion', 'marketing'],
      rating: 4.8,
      downloads: 892,
      preview: '/placeholder-template.jpg',
      icon: FileText,
      isPremium: false
    },
    {
      id: '6',
      title: 'Social Media Graphics',
      description: 'Template for analyzing social media graphics, posts, and campaign visuals.',
      category: 'branding',
      tags: ['social', 'graphics', 'marketing'],
      rating: 4.5,
      downloads: 321,
      preview: '/placeholder-template.jpg',
      icon: Image,
      isPremium: false
    }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Analysis Templates</h1>
          <p className="text-gray-600">
            Pre-configured templates to streamline your design analysis workflow
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              {category.name}
              <Badge variant="secondary" className="text-xs">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <template.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base leading-tight">{template.title}</CardTitle>
                      {template.isPremium && (
                        <Badge variant="secondary" className="mt-1 bg-yellow-100 text-yellow-800">
                          <Star className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-sm">
                  {template.description}
                </CardDescription>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {template.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{template.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    <span>{template.downloads.toLocaleString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    Use Template
                  </Button>
                  <Button size="sm" variant="outline" className="px-3">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or browse different categories
            </p>
            <Button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}>
              Clear Filters
            </Button>
          </div>
        )}

        {/* Create Custom Template CTA */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Need a Custom Template?
                </h3>
                <p className="text-blue-700">
                  Create your own analysis template tailored to your specific needs and workflow.
                </p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Create Template
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
