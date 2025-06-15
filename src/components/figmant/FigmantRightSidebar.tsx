
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Check, X, Upload } from 'lucide-react';

interface FigmantRightSidebarProps {
  mode: string;
  activeSection: string;
}

export const FigmantRightSidebar: React.FC<FigmantRightSidebarProps> = ({
  mode,
  activeSection
}) => {
  const [attachments] = useState([
    { id: '1', name: 'Design file 1', status: 'completed' },
    { id: '2', name: 'Design file 2', status: 'completed' },
    { id: '3', name: 'Design file 3', status: 'completed' },
  ]);

  const renderAttachmentsMode = () => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Attachments</h3>
        <p className="text-sm text-gray-500 mt-1">Add an address so you can get paid</p>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* File List */}
          <div className="space-y-3">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="w-8 h-8 bg-white border border-gray-200 rounded flex items-center justify-center flex-shrink-0">
                  <div className="w-4 h-4 bg-gray-300 rounded-sm"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {attachment.name}
                  </div>
                  <div className="text-xs text-gray-500">Completed</div>
                </div>
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="h-3 w-3 text-white" />
                </div>
              </div>
            ))}
          </div>

          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <div className="text-sm text-gray-600 mb-2">
              Add an address so you can get paid
            </div>
            <Button variant="outline" size="sm" className="text-gray-600 border-gray-300">
              Browse files
            </Button>
          </div>

          {/* Additional Files */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Recently used
            </div>
            <div className="text-sm text-gray-600 p-2 hover:bg-gray-50 rounded cursor-pointer">
              Previous design file
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="border-t border-gray-200 p-4 space-y-2">
        <Button variant="ghost" size="sm" className="w-full text-gray-600">
          <X className="h-4 w-4 mr-2" />
          Clear all
        </Button>
      </div>
    </div>
  );

  const renderPreviewMode = () => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Preview</h3>
        <p className="text-sm text-gray-500 mt-1">Start by defining your GPT</p>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded mx-auto mb-4"></div>
            <h4 className="font-medium text-gray-900 mb-2">Design Analysis Preview</h4>
            <p className="text-sm text-gray-500">
              Your analysis will appear here once you start the conversation.
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <div className="h-full bg-white">
      {mode === 'attachments' ? renderAttachmentsMode() : renderPreviewMode()}
    </div>
  );
};
