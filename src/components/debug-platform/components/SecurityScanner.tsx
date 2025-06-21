
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Search,
  Eye,
  Lock,
  Key
} from 'lucide-react';

interface SecurityScannerProps {
  isActive: boolean;
  onAlert: (alert: any) => void;
}

interface SecurityIssue {
  id: string;
  type: 'critical' | 'warning' | 'info';
  category: 'authentication' | 'data_leakage' | 'hardcoded_values' | 'session_security';
  title: string;
  description: string;
  recommendation: string;
  affected_component: string;
}

export const SecurityScanner: React.FC<SecurityScannerProps> = ({ 
  isActive, 
  onAlert 
}) => {
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [issues, setIssues] = useState<SecurityIssue[]>([]);
  const [scanComplete, setScanComplete] = useState(false);

  const mockSecurityIssues: SecurityIssue[] = [
    {
      id: '1',
      type: 'critical',
      category: 'hardcoded_values',
      title: 'Hardcoded API Key Detected',
      description: 'Found hardcoded API key in component source code',
      recommendation: 'Move API keys to environment variables or secure storage',
      affected_component: 'AuthService.ts'
    },
    {
      id: '2',
      type: 'warning',
      category: 'session_security',
      title: 'Session Token Not Encrypted',
      description: 'Session tokens are stored in localStorage without encryption',
      recommendation: 'Implement token encryption before storage',
      affected_component: 'SessionManager.ts'
    },
    {
      id: '3',
      type: 'warning',
      category: 'data_leakage',
      title: 'User Data in Console Logs',
      description: 'Sensitive user data detected in console.log statements',
      recommendation: 'Remove or sanitize console logs in production',
      affected_component: 'UserProfile.tsx'
    },
    {
      id: '4',
      type: 'info',
      category: 'authentication',
      title: 'Missing Rate Limiting',
      description: 'Authentication endpoints lack rate limiting protection',
      recommendation: 'Implement rate limiting for auth endpoints',
      affected_component: 'API Routes'
    }
  ];

  const runSecurityScan = async () => {
    if (!isActive) return;
    
    setScanning(true);
    setScanProgress(0);
    setIssues([]);
    setScanComplete(false);

    // Simulate scanning process
    const scanSteps = [
      'Analyzing authentication flows...',
      'Scanning for hardcoded values...',
      'Checking data exposure...',
      'Validating session security...',
      'Reviewing access controls...'
    ];

    for (let i = 0; i < scanSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setScanProgress((i + 1) / scanSteps.length * 100);
    }

    // Add random issues
    const randomIssues = mockSecurityIssues
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 3) + 1);
    
    setIssues(randomIssues);
    setScanComplete(true);
    setScanning(false);

    // Send alerts for critical issues
    randomIssues.forEach(issue => {
      if (issue.type === 'critical') {
        onAlert({
          id: crypto.randomUUID(),
          type: 'security',
          message: `Critical security issue: ${issue.title}`,
          timestamp: new Date()
        });
      }
    });
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'critical': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'info': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getIssueColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-200 bg-red-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'info': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'authentication': return <Key className="h-4 w-4" />;
      case 'data_leakage': return <Eye className="h-4 w-4" />;
      case 'hardcoded_values': return <Lock className="h-4 w-4" />;
      case 'session_security': return <Shield className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Scan Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Scanner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button 
              onClick={runSecurityScan}
              disabled={!isActive || scanning}
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              {scanning ? 'Scanning...' : 'Run Security Scan'}
            </Button>
            
            {!isActive && (
              <p className="text-sm text-muted-foreground">
                Start a debug session to run security scans
              </p>
            )}
          </div>

          {scanning && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Scanning for security vulnerabilities...</span>
                <span>{Math.round(scanProgress)}%</span>
              </div>
              <Progress value={scanProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scan Results Summary */}
      {scanComplete && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Issues</p>
                  <p className="text-2xl font-bold">{issues.length}</p>
                </div>
                <Shield className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critical</p>
                  <p className="text-2xl font-bold text-red-600">
                    {issues.filter(i => i.type === 'critical').length}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Warnings</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {issues.filter(i => i.type === 'warning').length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Info</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {issues.filter(i => i.type === 'info').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Issues */}
      {issues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Security Issues Found</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {issues.map((issue) => (
                <div 
                  key={issue.id} 
                  className={`p-4 rounded-lg border-2 ${getIssueColor(issue.type)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getIssueIcon(issue.type)}
                      <h4 className="font-medium">{issue.title}</h4>
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getCategoryIcon(issue.category)}
                        {issue.category.replace('_', ' ')}
                      </Badge>
                    </div>
                    <Badge variant={issue.type === 'critical' ? 'destructive' : 'secondary'}>
                      {issue.type}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-2">{issue.description}</p>
                  
                  <div className="text-sm">
                    <p className="font-medium text-gray-600 mb-1">Recommendation:</p>
                    <p className="text-gray-600">{issue.recommendation}</p>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500">
                    Affected: {issue.affected_component}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
