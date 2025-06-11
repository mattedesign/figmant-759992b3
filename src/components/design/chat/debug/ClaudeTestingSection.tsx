
import React from 'react';
import { TestTube, Activity } from 'lucide-react';
import { TestControls } from './TestControls';
import { TestResults } from './TestResults';

export const ClaudeTestingSection: React.FC = () => {
  const [testMessage, setTestMessage] = React.useState('Analyze this design for usability and conversion optimization opportunities.');
  const [testUrl, setTestUrl] = React.useState('');
  const [testFile, setTestFile] = React.useState<File | null>(null);
  const [testResults, setTestResults] = React.useState<any[]>([]);

  const handleTestResult = (result: any) => {
    setTestResults(prev => [result, ...prev]);
  };

  const handleClearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="border rounded-lg p-4 bg-white">
      <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
        <TestTube className="h-4 w-4" />
        Claude AI Integration Tests
        <Activity className="h-3 w-3 text-blue-500" />
      </h4>
      
      <TestControls
        testMessage={testMessage}
        setTestMessage={setTestMessage}
        testUrl={testUrl}
        setTestUrl={setTestUrl}
        testFile={testFile}
        setTestFile={setTestFile}
        onTestResult={handleTestResult}
      />

      <TestResults
        testResults={testResults}
        onClearResults={handleClearResults}
      />
    </div>
  );
};

export default ClaudeTestingSection;
