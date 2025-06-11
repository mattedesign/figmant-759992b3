
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings } from 'lucide-react';
import { AnalysisPreferences } from '@/types/design';

interface AnalysisPreferencesSectionProps {
  analysisPreferences: AnalysisPreferences;
  setAnalysisPreferences: (value: AnalysisPreferences) => void;
}

export const AnalysisPreferencesSection = ({
  analysisPreferences,
  setAnalysisPreferences
}: AnalysisPreferencesSectionProps) => {
  return (
    <div className="space-y-4">
      <Label className="flex items-center gap-2">
        <Settings className="h-4 w-4" />
        Analysis Preferences
      </Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="auto-comparative"
            checked={analysisPreferences.auto_comparative}
            onCheckedChange={(checked) =>
              setAnalysisPreferences(prev => ({
                ...prev,
                auto_comparative: checked as boolean
              }))
            }
          />
          <Label htmlFor="auto-comparative" className="text-sm">
            Enable automatic comparative analysis for multiple items
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="context-integration"
            checked={analysisPreferences.context_integration}
            onCheckedChange={(checked) =>
              setAnalysisPreferences(prev => ({
                ...prev,
                context_integration: checked as boolean
              }))
            }
          />
          <Label htmlFor="context-integration" className="text-sm">
            Use context files to enhance analysis
          </Label>
        </div>
        <div className="space-y-2">
          <Label className="text-sm">Analysis Depth</Label>
          <Select
            value={analysisPreferences.analysis_depth || 'detailed'}
            onValueChange={(value) =>
              setAnalysisPreferences(prev => ({
                ...prev,
                analysis_depth: value as 'basic' | 'detailed' | 'comprehensive'
              }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic Analysis</SelectItem>
              <SelectItem value="detailed">Detailed Analysis</SelectItem>
              <SelectItem value="comprehensive">Comprehensive Analysis</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
