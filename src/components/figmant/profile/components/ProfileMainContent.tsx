
import React from 'react';
import { PersonalInfoSection } from './sections/PersonalInfoSection';
import { ContactDetailsSection } from './sections/ContactDetailsSection';
import { AddressSection } from './sections/AddressSection';
import { SecuritySection } from './sections/SecuritySection';
import { BillingSection } from './sections/BillingSection';
import { ConnectedAccountsSection } from './sections/ConnectedAccountsSection';
import { PreferencesSection } from './sections/PreferencesSection';
import { NotificationsSection } from './sections/NotificationsSection';
import { ApiAccessSection } from './sections/ApiAccessSection';
import { AnalyticsSection } from './sections/AnalyticsSection';
import { DataExportSection } from './sections/DataExportSection';

interface ProfileMainContentProps {
  activeSection: string;
}

export const ProfileMainContent: React.FC<ProfileMainContentProps> = ({ activeSection }) => {
  const renderSection = () => {
    switch (activeSection) {
      case 'personal':
        return <PersonalInfoSection />;
      case 'contact':
        return <ContactDetailsSection />;
      case 'address':
        return <AddressSection />;
      case 'security':
        return <SecuritySection />;
      case 'billing':
        return <BillingSection />;
      case 'connected-accounts':
        return <ConnectedAccountsSection />;
      case 'preferences':
        return <PreferencesSection />;
      case 'notifications':
        return <NotificationsSection />;
      case 'api-access':
        return <ApiAccessSection />;
      case 'analytics':
        return <AnalyticsSection />;
      case 'data-export':
        return <DataExportSection />;
      default:
        return <PersonalInfoSection />;
    }
  };

  return (
    <div className="max-w-4xl">
      {renderSection()}
    </div>
  );
};
