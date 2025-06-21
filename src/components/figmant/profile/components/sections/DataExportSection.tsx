
import React, { useState } from 'react';
import { DataSettingsTab } from '@/components/dashboard/settings/DataSettingsTab';

export const DataExportSection: React.FC = () => {
  const [dataRetention, setDataRetention] = useState('365');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Data & Privacy</h2>
        <p className="text-gray-600 mt-1">
          Export your data, manage privacy settings, and control data retention.
        </p>
      </div>
      
      <DataSettingsTab 
        dataRetention={dataRetention}
        setDataRetention={setDataRetention}
      />
    </div>
  );
};
