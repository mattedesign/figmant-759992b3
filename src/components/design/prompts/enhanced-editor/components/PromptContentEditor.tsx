
import React, { useState, useMemo } from 'react';
import { Plus, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PROMPT_LIMITS, getPromptLimitStatus, getPromptLimitMessage } from '@/constants/promptLimits';

interface PromptContentEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  validationError?: string;
}

const commonVariables = [
  { label: 'Industry', value: '{INDUSTRY}' },
  { label: 'Target Audience', value: '{TARGET_AUDIENCE}' },
  { label: 'Business Goal', value: '{PRIMARY_GOAL}' },
  { label: 'Company Name', value: '{COMPANY_NAME}' },
  { label: 'Product/Service', value: '{PRODUCT_SERVICE}' },
  { label: 'Competitor URLs', value: '{COMPETITOR_URLS}' },
  { label: 'Current Metrics', value: '{CURRENT_METRICS}' }
];

export const PromptContentEditor: React.FC<PromptContentEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter your prompt template...",
  maxLength = PROMPT_LIMITS.PROMPT_CONTENT_MAX,
  validationError
}) => {
  const [showVariablePicker, setShowVariablePicker] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);

  const insertVariable = (variable: string) => {
    const newValue = value.slice(0, cursorPosition) + variable + value.slice(cursorPosition);
    onChange(newValue);
    setShowVariablePicker(false);
  };

  const detectedVariables = useMemo(() => {
    const variableRegex = /\{([^}]+)\}/g;
    const matches = [];
    let match;
    while ((match = variableRegex.exec(value)) !== null) {
      if (!matches.includes(match[1])) {
        matches.push(match[1]);
      }
    }
    return matches;
  }, [value]);

  const detectedSections = useMemo(() => {
    const sections = [];
    if (value.includes('**ANALYSIS CONTEXT:**') || value.includes('## Analysis Context')) {
      sections.push({ type: 'context', label: 'Analysis Context' });
    }
    if (value.includes('**DELIVERABLE FORMAT:**') || value.includes('## Deliverable Format')) {
      sections.push({ type: 'format', label: 'Deliverable Format' });
    }
    if (value.includes('**FOCUS AREAS:**') || value.includes('## Focus Areas')) {
      sections.push({ type: 'focus', label: 'Focus Areas' });
    }
    return sections;
  }, [value]);

  const limitStatus = getPromptLimitStatus(value.length, maxLength);
  const limitMessage = getPromptLimitMessage(value.length, maxLength);

  const getCharacterCountStyle = () => {
    switch (limitStatus) {
      case 'error':
        return "text-red-700 bg-red-100 border border-red-300";
      case 'danger':
        return "text-orange-700 bg-orange-100 border border-orange-300";
      case 'warning':
        return "text-yellow-700 bg-yellow-100 border border-yellow-300";
      default:
        return "text-muted-foreground bg-gray-50";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Prompt Template Content *</Label>
        <div className="flex items-center gap-4">
          <span className={cn(
            "text-sm font-medium px-3 py-1 rounded-full",
            getCharacterCountStyle()
          )}>
            {limitMessage}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowVariablePicker(!showVariablePicker)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Variable
          </Button>
        </div>
      </div>
      
      <div className="relative">
        <Textarea
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setCursorPosition(e.target.selectionStart || 0);
          }}
          onSelect={(e: any) => setCursorPosition(e.target.selectionStart || 0)}
          className={cn(
            "min-h-[500px] font-mono text-sm leading-relaxed resize-none",
            validationError && "border-destructive"
          )}
          placeholder={placeholder}
          maxLength={maxLength}
        />
        
        {/* Variable Picker Popover */}
        {showVariablePicker && (
          <div className="absolute top-4 right-4 z-10 bg-background border rounded-lg shadow-lg p-4 w-64">
            <h4 className="font-medium mb-3">Insert Template Variable</h4>
            <div className="space-y-1 max-h-48 overflow-auto">
              {commonVariables.map((variable) => (
                <button
                  key={variable.value}
                  onClick={() => insertVariable(variable.value)}
                  className="w-full text-left p-2 hover:bg-muted rounded text-sm"
                >
                  <div className="font-medium">{variable.label}</div>
                  <div className="text-muted-foreground font-mono text-xs">
                    {variable.value}
                  </div>
                </button>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowVariablePicker(false)}
              className="w-full mt-3"
            >
              Close
            </Button>
          </div>
        )}
      </div>

      {/* Detected Variables */}
      {detectedVariables.length > 0 && (
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Detected Variables</h4>
          <div className="flex gap-2 flex-wrap">
            {detectedVariables.map((variable) => (
              <Badge key={variable} variant="outline" className="font-mono">
                {`{${variable}}`}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {/* Content Structure Guide */}
      {detectedSections.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-medium mb-2 text-blue-900">Detected Prompt Structure</h4>
          <div className="space-y-1">
            {detectedSections.map((section, index) => (
              <div key={index} className="text-sm text-blue-700 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                {section.label} section found
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Validation Error */}
      {validationError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{validationError}</AlertDescription>
        </Alert>
      )}
      
      {/* Progressive warnings */}
      {limitStatus === 'warning' && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Approaching character limit. Consider breaking down complex prompts into smaller templates.
          </AlertDescription>
        </Alert>
      )}
      
      {limitStatus === 'danger' && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Very close to character limit. You may want to optimize your prompt for better performance.
          </AlertDescription>
        </Alert>
      )}
      
      {limitStatus === 'error' && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Content exceeds maximum length. Please reduce the prompt size or consider splitting into multiple templates.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
