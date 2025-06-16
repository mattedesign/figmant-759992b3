
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Share, ExternalLink } from 'lucide-react';

interface AnalysisRightPanelProps {
  analysis: any;
}

export const AnalysisRightPanel: React.FC<AnalysisRightPanelProps> = ({
  analysis
}) => {
  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <h3 className="font-semibold">Attachments</h3>
      </div>

      {/* Attachments */}
      <div className="flex-1 overflow-y-auto p-4 bg-white">
        <div className="space-y-4">
          {/* Sample Attachment */}
          <div className="p-3 border border-gray-200 rounded-lg bg-white">
            <div className="aspect-video bg-gray-100 rounded mb-2 flex items-center justify-center">
              <div className="text-gray-400 text-sm">Add an address as you can join post</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-gray-500">● Bookshop</div>
              <div className="text-xs text-gray-500">● Wine store and kitchen</div>
              <div className="text-xs text-gray-500">● Beach area/Beach Restaurant</div>
              <div className="text-xs text-gray-500">● Etc</div>
            </div>
            <div className="mt-2 flex items-center gap-1">
              <Button variant="outline" size="sm" className="h-6 text-xs">
                🗑️
              </Button>
            </div>
          </div>

          {/* Another Sample Attachment */}
          <div className="p-3 border border-gray-200 rounded-lg bg-white">
            <div className="aspect-video bg-gray-100 rounded mb-2 flex items-center justify-center">
              <div className="text-gray-400 text-sm">Add an address as you can join post</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-gray-500">● Bookshop</div>
              <div className="text-xs text-gray-500">● Wine store and kitchen</div>
              <div className="text-xs text-gray-500">● Beach area/Beach Restaurant</div>
              <div className="text-xs text-gray-500">● Etc</div>
            </div>
            <div className="mt-2 flex items-center gap-1">
              <Button variant="outline" size="sm" className="h-6 text-xs">
                🗑️
              </Button>
            </div>
          </div>

          {/* Upload Area */}
          <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center bg-white">
            <div className="text-gray-400 text-sm">Add an address as you can join post</div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Share className="h-4 w-4 mr-1" />
              Share
            </Button>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
