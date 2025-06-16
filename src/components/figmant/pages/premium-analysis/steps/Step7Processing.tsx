
import React from 'react';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { StepProps } from '../types';

export const Step7Processing: React.FC<StepProps> = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-6 text-gray-900">Your analysis is processing</h2>
        
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full px-6 py-3 shadow-lg flex items-center gap-3">
            <Check className="h-5 w-5 text-green-500" />
            <span className="text-gray-700 font-medium">Generating</span>
          </div>
        </div>

        <div className="max-w-md mx-auto space-y-4">
          <Card className="p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-900">My analysis</div>
                <div className="text-sm text-gray-600">Dashboard Design</div>
                <div className="text-xs text-gray-500">Comprehensive UX Analysis</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-900">Premium</div>
                <div className="text-sm text-gray-600">Web app</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
