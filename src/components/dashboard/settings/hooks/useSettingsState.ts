
import { useState } from 'react';

export const useSettingsState = () => {
  const [preferences, setPreferences] = useState({
    theme: 'system',
    compactMode: false,
    language: 'en',
    timezone: 'UTC',
    emailNotifications: true,
    analysisNotifications: true,
    weeklyDigest: true,
  });

  // State for API keys
  const [apiKeys, setApiKeys] = useState({
    claude: '',
    analytics: '',
    heatmap: ''
  });

  // State for notifications
  const [notifications, setNotifications] = useState({
    realTimeAlerts: true,
    weeklyReports: true,
    anomalyDetection: true,
    emailNotifications: false
  });

  // State for data settings
  const [dataRetention, setDataRetention] = useState('90');
  
  // State for analysis settings
  const [analysisFrequency, setAnalysisFrequency] = useState('daily');

  return {
    preferences,
    setPreferences,
    apiKeys,
    setApiKeys,
    notifications,
    setNotifications,
    dataRetention,
    setDataRetention,
    analysisFrequency,
    setAnalysisFrequency,
  };
};
