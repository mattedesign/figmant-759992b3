
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FigmantLayout } from '@/components/figmant/FigmantLayout';
import { useAuth } from '@/contexts/AuthContext';

export const OwnerDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
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
    'admin': 'admin',
    'search': 'search',
    'wizard': 'wizard',
    'premium-analysis': 'premium-analysis',
    'wizard-analysis': 'wizard-analysis'
  };

  // Get initial section from URL or default to dashboard
  const getInitialSection = () => {
    const tabParam = searchParams.get('tab');
    return tabParam && tabToSectionMap[tabParam] ? tabToSectionMap[tabParam] : 'dashboard';
  };

  const [activeSection, setActiveSection] = useState(getInitialSection);

  // Update URL when section changes
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    
    // Find the corresponding tab name for the URL
    const tabName = Object.entries(tabToSectionMap).find(([, sectionName]) => sectionName === section)?.[0] || section;
    
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('tab', tabName);
    setSearchParams(newSearchParams);
  };

  // Listen for URL changes (back/forward navigation)
  useEffect(() => {
    const currentSection = getInitialSection();
    if (currentSection !== activeSection) {
      setActiveSection(currentSection);
    }
  }, [searchParams]);

  return (
    <FigmantLayout />
  );
};
