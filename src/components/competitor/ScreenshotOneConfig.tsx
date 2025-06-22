
import React from 'react';
import { ScreenshotServiceStatus } from '@/components/figmant/pages/analysis/components/ScreenshotServiceStatus';

interface ScreenshotOneConfigProps {
  className?: string;
}

export const ScreenshotOneConfig: React.FC<ScreenshotOneConfigProps> = ({ className }) => {
  return <ScreenshotServiceStatus className={className} />;
};
