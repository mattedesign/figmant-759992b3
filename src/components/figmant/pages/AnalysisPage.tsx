
import React from 'react';
import { AnalysisPageContainer } from './analysis/AnalysisPageContainer';

interface AnalysisPageProps {
  selectedTemplate?: any;
}

export const AnalysisPage: React.FC<AnalysisPageProps> = ({ selectedTemplate }) => {
  return <AnalysisPageContainer selectedTemplate={selectedTemplate} />;
};
