
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FigmantLayout } from '@/components/figmant/FigmantLayout';
import { useAuth } from '@/contexts/AuthContext';

export const SubscriberDashboard = () => {
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
    'search': 'search',
    'wizard': 'wizard',
    'premium-analysis': 'premium-analysis',
    'wizard-analysis': 'wizard-analysis'
  };

  // Get initial section from URL or default to dashboard
  const getInitialSection = () => {
    const sectionParam = searchParams.get('section');
    return sectionParam && tabToSectionMap[sectionParam] ? tabToSectionMap[sectionParam] : 'dashboard';
  };

  const [activeSection, setActiveSection] = useState(getInitialSection);

  // Update URL when section changes
  const handleSectionChange = (section: string) => {
    console.log('🔧 SubscriberDashboard - Section change:', section);
    
    // Update URL to reflect the new section
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('section', section);
      return newParams;
    });
    
    setActiveSection(section);
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
