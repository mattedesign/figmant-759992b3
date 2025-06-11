
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ApiKeys {
  claude: string;
  analytics: string;
  heatmap: string;
}

interface Notifications {
  realTimeAlerts: boolean;
  weeklyReports: boolean;
  anomalyDetection: boolean;
  emailNotifications: boolean;
}

export const useSettingsState = () => {
  const { toast } = useToast();
  
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    claude: '',
    analytics: '',
    heatmap: ''
  });

  const [notifications, setNotifications] = useState<Notifications>({
    realTimeAlerts: true,
    weeklyReports: true,
    anomalyDetection: true,
    emailNotifications: false
  });

  const [dataRetention, setDataRetention] = useState('90');
  const [analysisFrequency, setAnalysisFrequency] = useState('daily');

  const saveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your configuration has been updated successfully.",
    });
  };

  return {
    apiKeys,
    setApiKeys,
    notifications,
    setNotifications,
    dataRetention,
    setDataRetention,
    analysisFrequency,
    setAnalysisFrequency,
    saveSettings
  };
};
