
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

interface Preferences {
  theme: string;
  compactMode: boolean;
  language: string;
  timezone: string;
  emailNotifications: boolean;
  analysisNotifications: boolean;
  weeklyDigest: boolean;
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

  const [preferences, setPreferences] = useState<Preferences>({
    theme: 'system',
    compactMode: false,
    language: 'en',
    timezone: 'UTC',
    emailNotifications: true,
    analysisNotifications: true,
    weeklyDigest: true,
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
    preferences,
    setPreferences,
    dataRetention,
    setDataRetention,
    analysisFrequency,
    setAnalysisFrequency,
    saveSettings
  };
};
