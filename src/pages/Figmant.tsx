
import React from 'react';
import { FigmantLayout } from '@/components/figmant/FigmantLayout';
import { ChatErrorBoundary } from '@/components/figmant/pages/analysis/components/ChatErrorBoundary';

const Figmant = () => {
  console.log('Figmant page rendering with error boundary...');
  
  return (
    <div className="min-h-screen overflow-hidden">
      <ChatErrorBoundary>
        <FigmantLayout />
      </ChatErrorBoundary>
    </div>
  );
};

export default Figmant;
