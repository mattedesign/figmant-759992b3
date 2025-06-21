
import React from 'react';
import { TestingChecklist } from './TestingChecklist';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Bug, CheckCircle } from 'lucide-react';

interface TestingPageProps {
  onBack?: () => void;
}

export const TestingPage: React.FC<TestingPageProps> = ({ onBack }) => {
  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button
                onClick={onBack}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Analysis
              </Button>
            )}
            <div>
              <h1 className="text-xl font-semibold">Analysis Page Testing</h1>
              <p className="text-sm text-muted-foreground">
                Comprehensive testing checklist for all implemented fixes
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Bug className="h-3 w-3" />
              Testing Mode
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <TestingChecklist />
      </div>

      {/* Quick Test Summary */}
      <div className="bg-white border-t border-gray-200 p-4">
        <Card className="p-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="font-medium">Testing Status</span>
            </div>
            <div className="text-muted-foreground">
              Mark tests as complete while testing the analysis interface
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
