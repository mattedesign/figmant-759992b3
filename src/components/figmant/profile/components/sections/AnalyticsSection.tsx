
import React, { useState } from 'react';
import { AnalysisTab } from '@/components/dashboard/settings/AnalysisTab';

export const AnalyticsSection: React.FC = () => {
  const [analysisFrequency, setAnalysisFrequency] = useState('daily');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Usage Analytics</h2>
        <p className="text-gray-600 mt-1">
          View your usage patterns and configure analytics preferences.
        </p>
      </div>
      
      <AnalysisTab 
        analysisFrequency={analysisFrequency}
        setAnalysisFrequency={setAnalysisFrequency}
      />
    </div>
  );
};
