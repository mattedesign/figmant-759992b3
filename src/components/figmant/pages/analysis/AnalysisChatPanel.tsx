
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, Send, Upload, Link, Loader2, Sparkles, Brain } from 'lucide-react';
import { useFigmantChatAnalysis, useFigmantPromptTemplates, useBestFigmantPrompt } from '@/hooks/useFigmantChatAnalysis';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AnalysisChatPanelProps {
  analysis: any;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: ChatAttachment[];
  promptUsed?: string;
}

export const AnalysisChatPanel: React.FC<AnalysisChatPanelProps> = ({
  analysis
}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [selectedPromptCategory, setSelectedPromptCategory] = useState<string>('');
  const [selectedPromptTemplate, setSelectedPromptTemplate] = useState<string>('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  
  const { toast } = useToast();
  const { analyzeWithFigmantChat } = useFigmantChatAnalysis();
  const { data: promptTemplates, isLoading: promptsLoading } = useFigmantPromptTemplates();
  const { data: bestPrompt } = useBestFigmantPrompt(selectedPromptCategory);

  // Get unique categories from prompt templates
  const promptCategories = React.useMemo(() => {
    if (!promptTemplates) return [];
    const categories = [...new Set(promptTemplates.map(p => p.category))];
    return categories;
  }, [promptTemplates]);

  // Get templates for selected category
  const categoryTemplates = React.useMemo(() => {
    if (!promptTemplates || !selectedPromptCategory) return [];
    return promptTemplates.filter(p => p.category === selectedPromptCategory);
  }, [promptTemplates, selectedPromptCategory]);

  // File upload with dropzone
  const onDrop = React.useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      const attachmentId = crypto.randomUUID();
      
      // Add file to attachments with uploading status
      const newAttachment: ChatAttachment = {
        id: attachmentId,
        type: 'file',
        name: file.name,
        file: file,
        status: 'uploading',
        url: URL.createObjectURL(file)
      };
      
      setAttachments(prev => [...prev, newAttachment]);

      try {
        // Upload to Supabase storage
        const fileName = `${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from('design-uploads')
          .upload(`figmant-chat/${fileName}`, file);

        if (error) throw error;

        // Update attachment with success status
        setAttachments(prev => prev.map(att => 
          att.id === attachmentId 
            ? { ...att, status: 'uploaded' as const, uploadPath: data.path }
            : att
        ));

        toast({
          title: "File Uploaded",
          description: `${file.name} uploaded successfully`,
        });

      } catch (error) {
        console.error('Upload error:', error);
        
        // Update attachment with error status
        setAttachments(prev => prev.map(att => 
          att.id === attachmentId 
            ? { ...att, status: 'error' as const }
            : att
        ));

        toast({
          variant: "destructive",
          title: "Upload Failed",
          description: `Failed to upload ${file.name}`,
        });
      }
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'],
      'application/pdf': ['.pdf']
    },
    multiple: true
  });

  const handleAddUrl = () => {
    if (urlInput.trim()) {
      const newAttachment: ChatAttachment = {
        id: crypto.randomUUID(),
        type: 'url',
        name: urlInput,
        url: urlInput,
        status: 'uploaded'
      };
      
      setAttachments(prev => [...prev, newAttachment]);
      setUrlInput('');
      setShowUrlInput(false);
      
      toast({
        title: "URL Added",
        description: "Website URL added for analysis",
      });
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const handleSendMessage = async () => {
    if (!message.trim() && attachments.length === 0) return;

    // Check for any failed attachments
    const failedAttachments = attachments.filter(att => att.status === 'error');
    if (failedAttachments.length > 0) {
      toast({
        variant: "destructive",
        title: "Upload Errors",
        description: "Please remove failed uploads before sending.",
      });
      return;
    }

    // Check for any processing attachments
    const processingAttachments = attachments.filter(att => 
      att.status === 'uploading' || att.status === 'processing'
    );
    if (processingAttachments.length > 0) {
      toast({
        variant: "destructive",
        title: "Processing Files",
        description: "Please wait for all files to finish uploading.",
      });
      return;
    }

    // Create user message
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date(),
      attachments: [...attachments]
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Store current values before clearing
    const currentMessage = message;
    const currentAttachments = [...attachments];
    const promptTemplate = selectedPromptTemplate ? 
      promptTemplates?.find(p => p.id === selectedPromptTemplate)?.original_prompt : 
      undefined;

    // Clear input
    setMessage('');
    setAttachments([]);

    try {
      // Call the analysis
      const result = await analyzeWithFigmantChat.mutateAsync({
        message: currentMessage,
        attachments: currentAttachments,
        promptTemplate,
        analysisType: selectedPromptCategory || 'general_analysis'
      });

      // Create assistant message
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: result.analysis,
        timestamp: new Date(),
        promptUsed: result.promptUsed
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Analysis failed:', error);
      
      // Create error message
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error while analyzing your request. Please check your files and try again.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-48 grid-cols-2">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="prompts">Prompts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="prompts" className="mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Analysis Type</label>
                  <Select value={selectedPromptCategory} onValueChange={setSelectedPromptCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select analysis type" />
                    </SelectTrigger>
                    <SelectContent>
                      {promptCategories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category.replace('_', ' ').toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Prompt Template</label>
                  <Select 
                    value={selectedPromptTemplate} 
                    onValueChange={setSelectedPromptTemplate}
                    disabled={!selectedPromptCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select prompt template" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryTemplates.map(template => (
                        <SelectItem key={template.id} value={template.id}>
                          <div className="flex items-center gap-2">
                            {template.title}
                            {bestPrompt?.example_id === template.id && (
                              <Badge variant="secondary" className="text-xs">
                                <Sparkles className="h-3 w-3 mr-1" />
                                Best
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {selectedPromptTemplate && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Selected Template</CardTitle>
                    <CardDescription className="text-xs">
                      {promptTemplates?.find(p => p.id === selectedPromptTemplate)?.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-xs text-gray-600 max-h-20 overflow-y-auto">
                      {promptTemplates?.find(p => p.id === selectedPromptTemplate)?.original_prompt.slice(0, 200)}...
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Chat Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">AI Design Analysis</p>
              <p className="text-sm">Upload designs, share URLs, or ask questions to get comprehensive UX analysis powered by Claude AI.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Brain className="h-4 w-4 text-gray-600" />
                  </div>
                )}
                
                <div className={`flex-1 max-w-2xl ${msg.role === 'user' ? 'max-w-md' : ''}`}>
                  <div className={`rounded-lg p-3 ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white ml-auto' 
                      : 'bg-gray-50'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {msg.attachments.map(att => (
                          <div key={att.id} className="text-xs opacity-75">
                            📎 {att.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-1">
                    {msg.timestamp.toLocaleTimeString()}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-medium">U</span>
                  </div>
                )}
              </div>
            ))
          )}
          
          {analyzeWithFigmantChat.isPending && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Loader2 className="h-4 w-4 text-gray-600 animate-spin" />
              </div>
              <div className="flex-1">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    <span className="text-sm text-gray-600 ml-2">Analyzing with Claude AI...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex flex-wrap gap-2">
            {attachments.map(attachment => (
              <div key={attachment.id} className="flex items-center gap-2 bg-white rounded-lg p-2 border">
                <span className="text-sm truncate max-w-32">{attachment.name}</span>
                <Badge variant={
                  attachment.status === 'uploaded' ? 'default' :
                  attachment.status === 'uploading' ? 'secondary' : 'destructive'
                }>
                  {attachment.status}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAttachment(attachment.id)}
                  className="h-5 w-5 p-0"
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* URL Input */}
      {showUrlInput && (
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex gap-2">
            <Input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter website URL for analysis..."
              onKeyPress={(e) => e.key === 'Enter' && handleAddUrl()}
            />
            <Button onClick={handleAddUrl} size="sm">Add</Button>
            <Button variant="ghost" onClick={() => setShowUrlInput(false)} size="sm">Cancel</Button>
          </div>
        </div>
      )}

      {/* File Drop Zone */}
      <div {...getRootProps()} className={`p-4 border-t border-gray-200 ${isDragActive ? 'bg-blue-50 border-blue-300' : ''}`}>
        <input {...getInputProps()} />
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe what you'd like me to analyze..."
              className="pr-32"
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={() => setShowUrlInput(!showUrlInput)}
                title="Add website URL"
              >
                <Link className="h-3 w-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                title="Upload files"
              >
                <Upload className="h-3 w-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0"
                onClick={handleSendMessage}
                disabled={analyzeWithFigmantChat.isPending || (!message.trim() && attachments.length === 0)}
              >
                {analyzeWithFigmantChat.isPending ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Send className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <Mic className="h-4 w-4" />
          </Button>
        </div>
        
        {isDragActive && (
          <div className="mt-2 text-center text-sm text-blue-600">
            Drop files here to analyze...
          </div>
        )}
      </div>
    </div>
  );
};
