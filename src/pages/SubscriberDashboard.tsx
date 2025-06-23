
import React, { useState, useEffect } from 'react';
import { FigmantLayout } from '@/components/figmant/FigmantLayout';
import { useAuth } from '@/contexts/AuthContext';

export const SubscriberDashboard = () => {
  const { user } = useAuth();
  
  // Map URL tab parameter to internal section names  
  const tabToSectionMap: Record<string, string> = {
    'dashboard': 'dashboard',
    'insights': 'insights',
    'analysis': 'analysis',
    'chat': 'chat',
    'templates': 'templates',
    'analytics': 'analytics',
    'credits': 'credits',
    'preferences': 'preferences',
    'profile': 'profile',
    'search': 'search',
    'wizard': 'wizard',
    'premium-analysis': 'premium-analysis',
    'wizard-analysis': 'wizard-analysis'
  };

  const [activeSection, setActiveSection] = useState('dashboard');

  // Handle section changes - URL handling is done by FigmantLayout
  const handleSectionChange = (section: string) => {
    console.log('🔧 SubscriberDashboard - Section change:', section);
    setActiveSection(section);
  };

  return (
    <FigmantLayout />
  );
};
