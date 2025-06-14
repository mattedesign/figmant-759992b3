
import React from 'react';
import { EnhancedLogoAssetManager } from './logo/EnhancedLogoAssetManager';
import { LogoPreviewSection } from './logo/LogoPreviewSection';
import { LogoGallerySection } from './logo/LogoGallerySection';
import { LogoTestingPanel } from './LogoTestingPanel';
import { LogoRecoverySystem } from './logo/LogoRecoverySystem';

export const LogoManager: React.FC = () => {
  return (
    <div className="space-y-6">
      <LogoRecoverySystem />
      <EnhancedLogoAssetManager />
      <LogoPreviewSection />
      <LogoTestingPanel />
      <LogoGallerySection />
    </div>
  );
};
