
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Plus } from 'lucide-react';

interface AttachmentButtonProps {
  isLoading: boolean;
  onUploadFile: () => void;
  onAddUrl: () => void;
}

export const AttachmentButton: React.FC<AttachmentButtonProps> = ({
  isLoading,
  onUploadFile,
  onAddUrl
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleUploadFile = () => {
    setIsPopoverOpen(false);
    onUploadFile();
  };

  const handleAddUrl = () => {
    setIsPopoverOpen(false);
    onAddUrl();
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-10 w-10 rounded-xl border-gray-200 bg-white flex-shrink-0" 
          disabled={isLoading}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2 bg-white border border-gray-200 shadow-lg z-50" align="start">
        <div className="space-y-1">
          <Button 
            variant="ghost" 
            className="w-full justify-start" 
            onClick={handleUploadFile} 
            disabled={isLoading}
          >
            Upload File
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start" 
            onClick={handleAddUrl}
          >
            Add URL
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
