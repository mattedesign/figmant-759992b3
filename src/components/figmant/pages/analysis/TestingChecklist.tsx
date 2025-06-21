
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, FileText, Globe, Settings, Link } from 'lucide-react';

interface TestItem {
  id: string;
  description: string;
  category: 'url' | 'file' | 'wizard' | 'integration';
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

const testItems: TestItem[] = [
  // URL Addition Testing
  { id: 'url-1', description: 'Can add valid URLs (with and without http/https)', category: 'url', completed: false, priority: 'high' },
  { id: 'url-2', description: 'Invalid URLs show proper error messages', category: 'url', completed: false, priority: 'high' },
  { id: 'url-3', description: 'Duplicate URLs are prevented with warning toast', category: 'url', completed: false, priority: 'medium' },
  { id: 'url-4', description: 'URL input clears after successful addition', category: 'url', completed: false, priority: 'medium' },
  { id: 'url-5', description: 'Cancel button works correctly and clears input', category: 'url', completed: false, priority: 'medium' },
  { id: 'url-6', description: 'Screenshot capture works for added URLs', category: 'url', completed: false, priority: 'low' },

  // File Upload Testing
  { id: 'file-1', description: 'Valid file types (images, PDFs) upload successfully', category: 'file', completed: false, priority: 'high' },
  { id: 'file-2', description: 'Invalid file types show error messages', category: 'file', completed: false, priority: 'high' },
  { id: 'file-3', description: 'Large files (>50MB) are rejected with error', category: 'file', completed: false, priority: 'medium' },
  { id: 'file-4', description: 'Upload progress shows correctly during processing', category: 'file', completed: false, priority: 'medium' },
  { id: 'file-5', description: 'Failed uploads show error state with retry option', category: 'file', completed: false, priority: 'medium' },
  { id: 'file-6', description: 'Multiple files can be uploaded simultaneously', category: 'file', completed: false, priority: 'low' },
  { id: 'file-7', description: 'File drag and drop functionality works', category: 'file', completed: false, priority: 'low' },

  // Wizard Analysis Testing
  { id: 'wizard-1', description: 'Template selection validates correctly', category: 'wizard', completed: false, priority: 'high' },
  { id: 'wizard-2', description: 'Cannot proceed without required attachments/message', category: 'wizard', completed: false, priority: 'high' },
  { id: 'wizard-3', description: 'Message input validates minimum length', category: 'wizard', completed: false, priority: 'medium' },
  { id: 'wizard-4', description: 'Template context shows correctly when selected', category: 'wizard', completed: false, priority: 'medium' },
  { id: 'wizard-5', description: 'Analysis submission works with template context', category: 'wizard', completed: false, priority: 'high' },
  { id: 'wizard-6', description: 'Loading states show correctly during analysis', category: 'wizard', completed: false, priority: 'medium' },

  // Integration Testing
  { id: 'integration-1', description: 'All components communicate properly via ChatStateManager', category: 'integration', completed: false, priority: 'high' },
  { id: 'integration-2', description: 'State updates propagate correctly between components', category: 'integration', completed: false, priority: 'high' },
  { id: 'integration-3', description: 'Error handling works across all components', category: 'integration', completed: false, priority: 'high' },
  { id: 'integration-4', description: 'Toast notifications appear appropriately for all actions', category: 'integration', completed: false, priority: 'medium' },
  { id: 'integration-5', description: 'No console errors during normal operation', category: 'integration', completed: false, priority: 'high' },
  { id: 'integration-6', description: 'Navigation between analysis modes works smoothly', category: 'integration', completed: false, priority: 'medium' },
  { id: 'integration-7', description: 'Sidebar navigation updates analysis template selection', category: 'integration', completed: false, priority: 'medium' },
];

export const TestingChecklist: React.FC = () => {
  const [tests, setTests] = useState<TestItem[]>(testItems);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const toggleTest = (testId: string) => {
    setTests(prev => prev.map(test => 
      test.id === testId ? { ...test, completed: !test.completed } : test
    ));
  };

  const resetAllTests = () => {
    setTests(prev => prev.map(test => ({ ...test, completed: false })));
  };

  const markCategoryComplete = (category: string) => {
    setTests(prev => prev.map(test => 
      test.category === category ? { ...test, completed: true } : test
    ));
  };

  const filteredTests = selectedCategory === 'all' 
    ? tests 
    : tests.filter(test => test.category === selectedCategory);

  const completedTests = tests.filter(test => test.completed).length;
  const totalTests = tests.length;
  const completionPercentage = Math.round((completedTests / totalTests) * 100);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'url': return <Globe className="h-4 w-4" />;
      case 'file': return <FileText className="h-4 w-4" />;
      case 'wizard': return <Settings className="h-4 w-4" />;
      case 'integration': return <Link className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const categories = [
    { id: 'all', name: 'All Tests', count: tests.length },
    { id: 'url', name: 'URL Addition', count: tests.filter(t => t.category === 'url').length },
    { id: 'file', name: 'File Upload', count: tests.filter(t => t.category === 'file').length },
    { id: 'wizard', name: 'Wizard Analysis', count: tests.filter(t => t.category === 'wizard').length },
    { id: 'integration', name: 'Integration', count: tests.filter(t => t.category === 'integration').length },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Testing Checklist</h2>
            <p className="text-gray-600">Validate all analysis page fixes and functionality</p>
          </div>
          <Button onClick={resetAllTests} variant="outline">
            Reset All Tests
          </Button>
        </div>

        {/* Progress Overview */}
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">
                {completedTests} of {totalTests} tests completed
              </span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
            <div className="flex items-center gap-2">
              <Badge variant={completionPercentage === 100 ? "default" : "secondary"}>
                {completionPercentage}% Complete
              </Badge>
              {completionPercentage === 100 && (
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  All Tests Passed
                </Badge>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => {
          const categoryTests = tests.filter(t => category.id === 'all' || t.category === category.id);
          const completedCount = categoryTests.filter(t => t.completed).length;
          
          return (
            <div key={category.id} className="flex items-center gap-2">
              <Button
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                {getCategoryIcon(category.id)}
                {category.name}
                <Badge variant="secondary" className="ml-1">
                  {completedCount}/{category.count}
                </Badge>
              </Button>
              {category.id !== 'all' && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => markCategoryComplete(category.id)}
                  className="text-xs"
                >
                  Mark All Complete
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {/* Test Items */}
      <div className="space-y-3">
        {filteredTests.map(test => (
          <Card key={test.id} className={`p-4 transition-all ${test.completed ? 'bg-green-50 border-green-200' : 'hover:shadow-md'}`}>
            <div className="flex items-start gap-3">
              <Checkbox
                checked={test.completed}
                onCheckedChange={() => toggleTest(test.id)}
                className="mt-1"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  {getCategoryIcon(test.category)}
                  <span className={`text-sm font-medium ${test.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {test.description}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getPriorityColor(test.priority)}>
                    {test.priority} priority
                  </Badge>
                  <Badge variant="outline">
                    {test.category}
                  </Badge>
                  {test.completed && (
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Testing Instructions */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="space-y-2">
            <h3 className="font-medium text-blue-900">Testing Instructions</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>URL Testing:</strong> Try adding various URL formats (with/without protocols, invalid domains, duplicates)</p>
              <p><strong>File Testing:</strong> Upload different file types, sizes, and test error scenarios</p>
              <p><strong>Wizard Testing:</strong> Test template selection, validation, and analysis flow</p>
              <p><strong>Integration Testing:</strong> Check component communication, state management, and error handling</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
