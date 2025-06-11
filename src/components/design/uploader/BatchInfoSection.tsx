
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Target } from 'lucide-react';

interface BatchInfoSectionProps {
  batchName: string;
  setBatchName: (value: string) => void;
  analysisGoals: string;
  setAnalysisGoals: (value: string) => void;
}

export const BatchInfoSection = ({
  batchName,
  setBatchName,
  analysisGoals,
  setAnalysisGoals
}: BatchInfoSectionProps) => {
  return (
    <>
      {/* Batch Name */}
      <div className="space-y-2">
        <Label htmlFor="batch-name">Batch Name (Optional)</Label>
        <Input
          id="batch-name"
          placeholder="e.g., Landing Page Redesign, Mobile App Flow"
          value={batchName}
          onChange={(e) => setBatchName(e.target.value)}
        />
      </div>

      {/* Analysis Goals */}
      <div className="space-y-2">
        <Label htmlFor="analysis-goals" className="flex items-center gap-2">
          <Target className="h-4 w-4" />
          Analysis Goals & Context
        </Label>
        <Textarea
          id="analysis-goals"
          placeholder="Describe what you want to learn from this analysis. For example: 'Focus on conversion optimization for e-commerce checkout flow' or 'Compare mobile vs desktop user experience'"
          value={analysisGoals}
          onChange={(e) => setAnalysisGoals(e.target.value)}
          className="min-h-[80px]"
        />
        <p className="text-xs text-muted-foreground">
          Providing specific goals helps Claude deliver more targeted and actionable insights.
        </p>
      </div>
    </>
  );
};
