
import React from 'react';

export const InsightsTableHeader: React.FC = () => {
  return (
    <div className="grid grid-cols-12 gap-4 text-sm text-gray-500 px-4">
      <div className="col-span-3">Name & role</div>
      <div className="col-span-2 text-center">Total task</div>
      <div className="col-span-2 text-center">Running</div>
      <div className="col-span-2 text-center">Complete</div>
      <div className="col-span-3"></div>
    </div>
  );
};
