
import React from 'react';
import { Button } from '@/components/ui/button';
import { Star, Settings } from 'lucide-react';

export const RecentSection: React.FC = () => {
  return (
    <div className="mt-8 mb-6">
      <div className="flex items-center gap-4 mb-4">
        <h3 className="font-semibold">Recent</h3>
        <Button variant="ghost" size="sm" className="text-blue-600">
          <Settings className="h-4 w-4 mr-1" />
        </Button>
      </div>
      <div className="space-y-2">
        {["Analysis of something", "Analysis of something", "Analysis of something"].map((item, index) => (
          <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
            <Star className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-700">{item}</span>
          </div>
        ))}
        <Button variant="ghost" size="sm" className="text-blue-600 text-sm">
          See all
        </Button>
      </div>
    </div>
  );
};
