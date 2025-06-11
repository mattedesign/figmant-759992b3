
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { TestRunner } from './TestRunner';

interface TestControlsProps {
  testMessage: string;
  setTestMessage: (message: string) => void;
  testUrl: string;
  setTestUrl: (url: string) => void;
  testFile: File | null;
  setTestFile: (file: File | null) => void;
  onTestResult: (result: any) => void;
}

export const TestControls: React.FC<TestControlsProps> = ({
  testMessage,
  setTestMessage,
  testUrl,
  setTestUrl,
  testFile,
  setTestFile,
  onTestResult
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setTestFile(file);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-medium text-gray-600">Test Message:</label>
        <Textarea
          value={testMessage}
          onChange={(e) => setTestMessage(e.target.value)}
          placeholder="Enter a message to test Claude AI..."
          className="mt-1 text-sm"
          rows={2}
        />
      </div>

      <TestRunner
        testMessage={testMessage}
        testUrl={testUrl}
        testFile={testFile}
        onTestResult={onTestResult}
      />

      <div className="border-t pt-3 mt-3">
        <label className="text-xs font-medium text-gray-600">URL Test:</label>
        <div className="flex gap-2 mt-1">
          <Input
            value={testUrl}
            onChange={(e) => setTestUrl(e.target.value)}
            placeholder="https://example.com"
            className="text-sm"
          />
        </div>
      </div>

      <div className="border-t pt-3 mt-3">
        <label className="text-xs font-medium text-gray-600">File Test:</label>
        <div className="flex gap-2 mt-1">
          <Input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            className="text-sm"
          />
        </div>
        {testFile && (
          <div className="mt-2 text-xs text-gray-600">
            Selected: {testFile.name} ({(testFile.size / 1024 / 1024).toFixed(2)} MB)
          </div>
        )}
      </div>
    </div>
  );
};
