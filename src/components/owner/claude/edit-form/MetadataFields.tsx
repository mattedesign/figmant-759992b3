
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

interface MetadataFieldsProps {
  editedPrompt: any;
  setEditedPrompt: (updater: (prev: any) => any) => void;
}

export const MetadataFields: React.FC<MetadataFieldsProps> = ({
  editedPrompt,
  setEditedPrompt
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Template Metadata</CardTitle>
        <CardDescription>
          Configure template settings and performance metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column - Performance and Context */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="effectiveness_rating">Effectiveness Rating</Label>
              <div className="mt-2">
                <Slider
                  id="effectiveness_rating"
                  min={1}
                  max={10}
                  step={1}
                  value={[editedPrompt.effectiveness_rating]}
                  onValueChange={(value) => 
                    setEditedPrompt(prev => ({ ...prev, effectiveness_rating: value[0] }))
                  }
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>1 (Poor)</span>
                  <span className="font-medium">{editedPrompt.effectiveness_rating}/10</span>
                  <span>10 (Excellent)</span>
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="use_case_context">Use Case Context</Label>
              <Textarea
                id="use_case_context"
                value={editedPrompt.use_case_context}
                onChange={(e) => setEditedPrompt(prev => ({ 
                  ...prev, 
                  use_case_context: e.target.value 
                }))}
                placeholder="Describe when and how this template should be used"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="business_domain">Business Domain</Label>
              <Input
                id="business_domain"
                value={editedPrompt.business_domain}
                onChange={(e) => setEditedPrompt(prev => ({ 
                  ...prev, 
                  business_domain: e.target.value 
                }))}
                placeholder="e.g., SaaS, E-commerce, Healthcare, Finance"
              />
            </div>
          </div>
          
          {/* Right column - Template Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="is_template">Template Mode</Label>
                <p className="text-sm text-gray-500">
                  Enable to use as reusable template
                </p>
              </div>
              <Switch
                id="is_template"
                checked={editedPrompt.is_template}
                onCheckedChange={(checked) => 
                  setEditedPrompt(prev => ({ ...prev, is_template: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="is_active">Active Status</Label>
                <p className="text-sm text-gray-500">
                  Show in user-facing interfaces
                </p>
              </div>
              <Switch
                id="is_active"
                checked={editedPrompt.is_active}
                onCheckedChange={(checked) => 
                  setEditedPrompt(prev => ({ ...prev, is_active: checked }))
                }
              />
            </div>
            
            <div className="pt-4 border-t">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Template Features</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Dynamic form fields for user customization</li>
                  <li>• Context-aware analysis prompts</li>
                  <li>• Performance tracking and optimization</li>
                  <li>• Credit-based usage monitoring</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
