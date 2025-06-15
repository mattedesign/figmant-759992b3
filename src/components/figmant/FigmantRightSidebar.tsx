
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Paperclip, 
  FileText, 
  Image as ImageIcon, 
  Link,
  Plus,
  X
} from 'lucide-react';

interface FigmantRightSidebarProps {
  activeSection: string;
}

export const FigmantRightSidebar: React.FC<FigmantRightSidebarProps> = ({
  activeSection
}) => {
  const [attachments] = useState([
    { id: '1', name: 'homepage-design.png', type: 'image', size: '2.4 MB' },
    { id: '2', name: 'user-flow.pdf', type: 'document', size: '1.2 MB' },
    { id: '3', name: 'brand-guidelines.pdf', type: 'document', size: '3.1 MB' },
  ]);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Project Assets</h3>
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <Tabs defaultValue="attachments" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 mx-4 mt-4">
            <TabsTrigger value="attachments">Files</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
          </TabsList>

          <TabsContent value="attachments" className="flex-1 mt-4">
            <ScrollArea className="h-full px-4">
              <div className="space-y-3">
                {attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      {getFileIcon(attachment.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {attachment.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {attachment.size}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}

                {/* Upload Area */}
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Paperclip className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <div className="text-sm text-muted-foreground mb-2">
                    Drop files here or click to upload
                  </div>
                  <Button variant="outline" size="sm">
                    Choose Files
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="links" className="flex-1 mt-4">
            <ScrollArea className="h-full px-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
                  <Link className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      figma.com/design-system
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Design System Reference
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <X className="h-3 w-3" />
                  </Button>
                </div>

                {/* Add Link Area */}
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Link className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <div className="text-sm text-muted-foreground mb-2">
                    Add website or reference link
                  </div>
                  <Button variant="outline" size="sm">
                    Add Link
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
