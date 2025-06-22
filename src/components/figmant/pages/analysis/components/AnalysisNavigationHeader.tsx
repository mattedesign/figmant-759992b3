
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Settings, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ScreenshotStatusIndicator } from './ScreenshotStatusIndicator';
import { ScreenshotServiceSetup } from './ScreenshotServiceSetup';

interface AnalysisNavigationHeaderProps {
  creditCost?: number;
  onToggleCollapse?: () => void;
}

export const AnalysisNavigationHeader: React.FC<AnalysisNavigationHeaderProps> = ({ 
  creditCost,
  onToggleCollapse
}) => {
  const navigate = useNavigate();
  const [showSetup, setShowSetup] = useState(false);

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/figmant')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Figmant
        </Button>
        
        <div className="h-4 w-px bg-gray-300" />
        
        <h1 className="text-lg font-semibold text-gray-900">Analysis</h1>
        
        {creditCost && (
          <span className="text-sm text-gray-600">
            ({creditCost} credits)
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Screenshot Status Indicator */}
        <ScreenshotStatusIndicator showDetails />
        
        {/* Screenshot Setup Dialog */}
        <Dialog open={showSetup} onOpenChange={setShowSetup}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Setup Screenshots
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Screenshot Service Configuration</DialogTitle>
            </DialogHeader>
            <ScreenshotServiceSetup />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
