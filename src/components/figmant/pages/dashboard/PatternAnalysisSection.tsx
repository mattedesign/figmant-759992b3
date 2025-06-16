
import React from 'react';
import { Button } from '@/components/ui/button';

export const PatternAnalysisSection: React.FC = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Pattern Analysis</h3>
        <Button variant="ghost" size="sm" className="text-gray-500">
          This week
        </Button>
      </div>
      <div className="relative">
        <div className="w-32 h-32 mx-auto relative">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="12" fill="none" />
            <circle 
              cx="64" 
              cy="64" 
              r="56" 
              stroke="#10b981" 
              strokeWidth="12" 
              fill="none"
              strokeDasharray={`${2 * Math.PI * 56 * 0.76} ${2 * Math.PI * 56}`}
              strokeLinecap="round"
            />
            <circle 
              cx="64" 
              cy="64" 
              r="56" 
              stroke="#3b82f6" 
              strokeWidth="12" 
              fill="none"
              strokeDasharray={`${2 * Math.PI * 56 * 0.16} ${2 * Math.PI * 56}`}
              strokeDashoffset={`-${2 * Math.PI * 56 * 0.76}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold">76%</div>
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Total task</span>
            </div>
            <span className="text-sm font-medium">23</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Running</span>
            </div>
            <span className="text-sm font-medium">16</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm">Completed</span>
            </div>
            <span className="text-sm font-medium">7</span>
          </div>
        </div>
      </div>
    </div>
  );
};
