import React, { useState, useEffect } from 'react';
import { AnalysisChatPanel } from './AnalysisChatPanel';
import { useChatState } from './ChatStateManager';
import { ChatMessage, ChatAttachment } from '@/components/design/DesignChatInterface';
import { UserDebugPanel } from '@/components/debug/UserDebugPanel';
import { Button } from '@/components/ui/button';
import { Bug } from 'lucide-react';
import { useFigmantPromptTemplates } from '@/hooks/prompts/useFigmantPromptTemplates';
import { useAnalyzeWithClaude } from '@/hooks/useAnalyzeWithClaude';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ScreenshotCaptureService } from '@/services/screenshot/screenshotCaptureService';

export const AnalysisPage: React.FC = () => {
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>();
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const chatState = useChatState();
  const { data: promptTemplates = [], isLoading } = useFigmantPromptTemplates();
  const analyzeWithClaude = useAnalyzeWithClaude();
  const location = useLocation();
  const { toast } = useToast();

  // Handle navigation from sidebar - detect hash or query params for template selection
  useEffect(() => {
    const handleNavigation = () => {
      const hash = location.hash.replace('#', '');
      const urlParams = new URLSearchParams(location.search);
      const sectionId = urlParams.get('section') || hash;

      console.log('🎯 ANALYSIS PAGE - Navigation detected:', { sectionId, hash, search: location.search });

      handleSectionChange(sectionId);
    };

    handleNavigation();
  }, [location]);

  // Handle section changes from sidebar navigation
  const handleSectionChange = (sectionId: string) => {
    console.log('🎯 ANALYSIS PAGE - Section change:', sectionId);
    
    switch (sectionId) {
      case 'design':
        setSelectedTemplate(undefined); // General analysis
        break;
      case 'competitor-analysis':
        setSelectedTemplate('uc024_competitor_analysis');
        break;
      case 'conversion-optimization':
        setSelectedTemplate('conversion_optimization');
        break;
      case 'visual-hierarchy':
        setSelectedTemplate('visual_hierarchy');
        break;
      default:
        // For other sections or unknown sections, keep current template
        break;
    }
  };

  const handleFileUpload = async (files: FileList) => {
    console.log('🎯 ANALYSIS PAGE - File upload:', files.length);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Properly categorize files based on their MIME type
      let attachmentType: 'file' | 'url' | 'image' = 'file';
      if (file.type.startsWith('image/')) {
        attachmentType = 'image';
      }
      
      const newAttachment: ChatAttachment = {
        id: crypto.randomUUID(),
        type: attachmentType,
        name: file.name,
        url: URL.createObjectURL(file),
        status: 'uploaded',
        file: file
      };

      chatState.setAttachments(prev => [...prev, newAttachment]);
    }

    toast({
      title: "Files Added",
      description: `${files.length} file(s) added for analysis.`,
    });
  };

  const handleAddUrl = async () => {
    if (!urlInput.trim()) {
      toast({
        variant: "destructive",
        title: "Empty URL",
        description: "Please enter a website URL.",
      });
      return;
    }

    console.log('🎯 ANALYSIS PAGE - Adding URL:', urlInput);

    // Validate URL format
    let formattedUrl = urlInput.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    try {
      const urlObj = new URL(formattedUrl);
      const hostname = urlObj.hostname;

      // Check if URL already exists
      const urlExists = chatState.attachments.some(att => att.url === formattedUrl);
      if (urlExists) {
        toast({
          variant: "destructive",
          title: "URL Already Added",
          description: `${hostname} is already in your attachments.`,
        });
        return;
      }

      // Create new URL attachment with processing status
      const newAttachment: ChatAttachment = {
        id: crypto.randomUUID(),
        type: 'url',
        name: hostname,
        url: formattedUrl,
        status: 'processing',
        metadata: {
          screenshots: {
            desktop: { success: false, url: formattedUrl },
            mobile: { success: false, url: formattedUrl }
          }
        }
      };

      console.log('Creating new URL attachment with screenshot capture:', newAttachment);
      chatState.setAttachments(prev => [...prev, newAttachment]);
      
      setUrlInput('');
      setShowUrlInput(false);
      
      toast({
        title: "Website Added",
        description: `${hostname} has been added. Capturing screenshots...`,
      });

      // Capture screenshots in the background
      try {
        console.log('📸 Starting screenshot capture for:', formattedUrl);
        
        const screenshotResults = await ScreenshotCaptureService.captureCompetitorSet(
          [formattedUrl],
          true, // include desktop
          true  // include mobile
        );

        console.log('📸 Screenshot capture results:', screenshotResults);

        // Update the attachment with screenshot data
        chatState.setAttachments(prev => prev.map(att => {
          if (att.id === newAttachment.id) {
            return {
              ...att,
              status: 'uploaded',
              metadata: {
                ...att.metadata,
                screenshots: {
                  desktop: screenshotResults.desktop?.[0] || { success: false, url: formattedUrl, error: 'Desktop screenshot failed' },
                  mobile: screenshotResults.mobile?.[0] || { success: false, url: formattedUrl, error: 'Mobile screenshot failed' }
                }
              }
            };
          }
          return att;
        }));

        const desktopSuccess = screenshotResults.desktop?.[0]?.success;
        const mobileSuccess = screenshotResults.mobile?.[0]?.success;

        if (desktopSuccess || mobileSuccess) {
          toast({
            title: "Screenshots Captured",
            description: `Successfully captured ${desktopSuccess && mobileSuccess ? 'desktop and mobile' : desktopSuccess ? 'desktop' : 'mobile'} screenshots for ${hostname}.`,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Screenshot Capture Failed",
            description: `Unable to capture screenshots for ${hostname}. The website will still be analyzed.`,
          });
        }

      } catch (screenshotError) {
        console.error('📸 Screenshot capture error:', screenshotError);
        
        // Update attachment status to show error but keep it functional
        chatState.setAttachments(prev => prev.map(att => {
          if (att.id === newAttachment.id) {
            return {
              ...att,
              status: 'uploaded', // Still functional for analysis
              metadata: {
                ...att.metadata,
                screenshots: {
                  desktop: { success: false, url: formattedUrl, error: 'Screenshot service unavailable' },
                  mobile: { success: false, url: formattedUrl, error: 'Screenshot service unavailable' }
                }
              }
            };
          }
          return att;
        }));

        toast({
          variant: "destructive",
          title: "Screenshot Capture Failed",
          description: `Unable to capture screenshots for ${hostname}. The website will still be analyzed.`,
        });
      }

    } catch (error) {
      console.error('URL validation error:', error);
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "Please enter a valid website URL (e.g., example.com)",
      });
    }
  };

  const handleSendMessage = async () => {
    if ((!chatState.message.trim() && chatState.attachments.length === 0) || analyzeWithClaude.isPending) return;

    try {
      // Add user message
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: chatState.message,
        attachments: [...chatState.attachments],
        timestamp: new Date()
      };

      chatState.setMessages(prev => [...prev, userMessage]);

      // Get active template
      const activeTemplate = promptTemplates.find(t => t.id === selectedTemplate);

      console.log('🎯 ANALYSIS PAGE - Sending message with template context:', {
        message: chatState.message,
        attachments: chatState.attachments,
        selectedTemplate,
        activeTemplate: activeTemplate?.displayName
      });

      // Call analysis with template support
      const result = await analyzeWithClaude.mutateAsync({
        message: chatState.message,
        attachments: chatState.attachments,
        template: activeTemplate
      });

      // Add assistant response
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: result.analysis,
        timestamp: new Date()
      };

      chatState.setMessages(prev => [...prev, assistantMessage]);

      // Clear input
      chatState.setMessage('');
      chatState.setAttachments([]);

    } catch (error) {
      console.error('❌ ANALYSIS PAGE - Analysis failed:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Sorry, the analysis failed. Please try again. Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      };

      chatState.setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleAddAttachment = () => {
    console.log('Adding attachment...');
    // TODO: Implement your existing attachment logic
  };

  const handleRemoveAttachment = (id: string) => {
    const updatedAttachments = chatState.attachments.filter(att => att.id !== id);
    chatState.setAttachments(updatedAttachments);
  };

  const handleTemplateSelect = (templateId: string) => {
    console.log('🎯 ANALYSIS PAGE - Template selected:', templateId);
    setSelectedTemplate(templateId);
  };

  const handleToggleUrlInput = () => {
    setShowUrlInput(!showUrlInput);
  };

  const handleCancelUrl = () => {
    setShowUrlInput(false);
    setUrlInput('');
  };

  const handleClearChat = () => {
    chatState.setMessages([]);
    chatState.setAttachments([]);
    chatState.setMessage('');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Debug Toggle Button */}
      <div className="p-2 border-b border-gray-200 bg-gray-50">
        <Button
          onClick={() => setShowDebugPanel(!showDebugPanel)}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Bug className="h-4 w-4" />
          {showDebugPanel ? 'Hide' : 'Show'} Debug Info
        </Button>
      </div>

      <div className="flex-1 flex">
        {/* Main Chat Panel */}
        <div className={`${showDebugPanel ? 'w-2/3' : 'w-full'} transition-all duration-300`}>
          <AnalysisChatPanel
            messages={chatState.messages}
            setMessages={chatState.setMessages}
            message={chatState.message}
            setMessage={chatState.setMessage}
            attachments={chatState.attachments}
            onSendMessage={handleSendMessage}
            onAddAttachment={() => console.log('Adding attachment...')}
            onRemoveAttachment={handleRemoveAttachment}
            promptTemplates={promptTemplates}
            selectedTemplate={selectedTemplate}
            onTemplateSelect={handleTemplateSelect}
            isAnalyzing={analyzeWithClaude.isPending}
            // Restored URL functionality props
            showUrlInput={showUrlInput}
            urlInput={urlInput}
            setUrlInput={setUrlInput}
            onToggleUrlInput={handleToggleUrlInput}
            onAddUrl={handleAddUrl}
            onCancelUrl={handleCancelUrl}
            onFileUpload={handleFileUpload}
            setAttachments={chatState.setAttachments}
          />
        </div>

        {/* Debug Panel */}
        {showDebugPanel && (
          <div className="w-1/3 border-l border-gray-200 bg-gray-50 p-4 overflow-y-auto">
            <UserDebugPanel />
          </div>
        )}
      </div>
    </div>
  );
};
