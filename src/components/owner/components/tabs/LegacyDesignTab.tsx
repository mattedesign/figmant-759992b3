
import { Suspense } from 'react';
import { lazy } from 'react';
import { LoadingSpinner } from '../LoadingSpinner';

const DesignList = lazy(() => import('@/components/design/DesignList').then(module => ({
  default: module.DesignList
})));

export const LegacyDesignTab = () => {
  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Legacy Design View</h1>
          <p className="text-muted-foreground">
            Classic view of uploaded designs and analysis
          </p>
        </div>
      </div>
      <Suspense fallback={<LoadingSpinner />}>
        <DesignList onViewAnalysis={(upload) => console.log('Viewing analysis:', upload.id, upload.file_name)} />
      </Suspense>
    </div>
  );
};
