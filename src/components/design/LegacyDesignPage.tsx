
import React from 'react';
import { DesignList } from './DesignList';

export const LegacyDesignPage = () => {
  const handleViewAnalysis = (upload: any) => {
    console.log('Viewing analysis:', upload.id, upload.file_name);
  };

  return <DesignList onViewAnalysis={handleViewAnalysis} />;
};
