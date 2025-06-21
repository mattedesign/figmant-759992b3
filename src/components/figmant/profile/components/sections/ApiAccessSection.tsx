
import React, { useState } from 'react';
import { ApiKeysTab } from '@/components/dashboard/settings/ApiKeysTab';

export const ApiAccessSection: React.FC = () => {
  const [apiKeys, setApiKeys] = useState({
    claude: '',
    analytics: '',
    heatmap: '',
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">API & Integrations</h2>
        <p className="text-gray-600 mt-1">
          Manage your API keys and third-party service integrations.
        </p>
      </div>
      
      <ApiKeysTab 
        apiKeys={apiKeys}
        setApiKeys={setApiKeys}
      />
    </div>
  );
};
