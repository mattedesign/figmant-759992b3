
import React from 'react';
import { FigmantLayout } from '@/components/figmant/FigmantLayout';

const Figmant = () => {
  console.log('Figmant page rendering...');
  
  return (
    <div className="min-h-screen overflow-hidden">
      <FigmantLayout />
    </div>
  );
};

export default Figmant;
