import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  Square, 
  RotateCcw,
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

interface FlowDebuggerProps {
  isActive: boolean;
}

interface FlowStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  duration?: number;
  details?: string;
  timestamp: Date;
}

export const FlowDebugger: React.FC<FlowDebuggerProps> = ({ isActive }) => {
  const [isTracing, setIsTracing] = useState(false);
  const [currentFlow, setCurrentFlow] = useState<string>('');
  const [flowSteps, setFlowSteps] = useState<FlowStep[]>([]);

  const authFlowSteps = [
    { id: '1', name: 'User Login Request', status: 'pending' as const, timestamp: new Date() },
    { id: '2', name: 'Validate Credentials', status: 'pending' as const, timestamp: new Date() },
    { id: '3', name: 'Generate Session Token', status: 'pending' as const, timestamp: new Date() },
    { id: '4', name: 'Update User Session', status: 'pending' as const, timestamp: new Date() },
    { id: '5', name: 'Redirect to Dashboard', status: 'pending' as const, timestamp: new Date() }
  ];

  const subscriptionFlowSteps = [
    { id: '1', name: 'Check Current Plan', status: 'pending' as const, timestamp: new Date() },
    { id: '2', name: 'Validate Payment Method', status: 'pending' as const, timestamp: new Date() },
    { id: '3', name: 'Process Subscription', status: 'pending' as const, timestamp: new Date() },
    { id: '4', name: 'Update User Credits', status: 'pending' as const, timestamp: new Date() },
    { id: '5', name: 'Send Confirmation', status: 'pending' as const, timestamp: new Date() }
  ];

  const startTracing = (flowType: string) => {
    if (!isActive) return;
    
    setIsTracing(true);
    setCurrentFlow(flowType);
    
    const steps = flowType === 'auth' ? authFlowSteps : subscriptionFlowSteps;
    setFlowSteps(steps.map(step => ({
      ...step,
      timestamp: new Date()
    })));

    // Simulate flow execution
    executeFlow(steps);
  };

  const executeFlow = async (steps: FlowStep[]) => {
    for (let i = 0; i < steps.length; i++) {
      // Mark current step as running
      setFlowSteps(prev => prev.map((step, index) => 
        index === i 
          ? { ...step, status: 'running', timestamp: new Date() }
          : step
      ));

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      // Mark step as completed (with occasional failures for demo)
      const success = Math.random() > 0.1; // 90% success rate
      setFlowSteps(prev => prev.map((step, index) => 
        index === i 
          ? { 
              ...step, 
              status: success ? 'success' : 'error',
              duration: Math.floor(1000 + Math.random() * 2000),
              details: success ? 'Completed successfully' : 'Step failed - connection timeout',
              timestamp: new Date()
            }
          : step
      ));

      // If step failed, stop execution
      if (!success) break;
    }

    setIsTracing(false);
  };

  const resetFlow = () => {
    setIsTracing(false);
    setCurrentFlow('');
    setFlowSteps([]);
  };

  const getStatusIcon = (status: FlowStep['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-gray-400" />;
      case 'running': return <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: FlowStep['status']) => {
    switch (status) {
      case 'pending': return 'text-gray-600';
      case 'running': return 'text-blue-600';
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Flow Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Flow Debugger
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => startTracing('auth')}
              disabled={!isActive || isTracing}
              variant={currentFlow === 'auth' ? 'default' : 'outline'}
            >
              Trace Auth Flow
            </Button>
            <Button 
              onClick={() => startTracing('subscription')}
              disabled={!isActive || isTracing}
              variant={currentFlow === 'subscription' ? 'default' : 'outline'}
            >
              Trace Subscription Flow
            </Button>
            <Button 
              onClick={resetFlow}
              disabled={isTracing}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
          
          {!isActive && (
            <p className="text-sm text-muted-foreground mt-2">
              Start a debug session to trace authentication flows
            </p>
          )}
        </CardContent>
      </Card>

      {/* Flow Visualization */}
      {flowSteps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{currentFlow === 'auth' ? 'Authentication Flow' : 'Subscription Flow'}</span>
              <Badge variant={isTracing ? 'default' : 'secondary'}>
                {isTracing ? 'Running' : 'Completed'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {flowSteps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-4">
                  {/* Step indicator */}
                  <div className="flex-shrink-0">
                    {getStatusIcon(step.status)}
                  </div>
                  
                  {/* Step content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-medium ${getStatusColor(step.status)}`}>
                        {step.name}
                      </h4>
                      {step.duration && (
                        <span className="text-sm text-muted-foreground">
                          {step.duration}ms
                        </span>
                      )}
                    </div>
                    {step.details && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {step.details}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {step.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  
                  {/* Arrow connector */}
                  {index < flowSteps.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-gray-300 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Flow Analytics */}
      {flowSteps.length > 0 && !isTracing && (
        <Card>
          <CardHeader>
            <CardTitle>Flow Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {flowSteps.filter(s => s.status === 'success').length}
                </p>
                <p className="text-sm text-muted-foreground">Successful Steps</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {flowSteps.filter(s => s.status === 'error').length}
                </p>
                <p className="text-sm text-muted-foreground">Failed Steps</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {flowSteps.reduce((sum, step) => sum + (step.duration || 0), 0)}ms
                </p>
                <p className="text-sm text-muted-foreground">Total Duration</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round((flowSteps.filter(s => s.status === 'success').length / flowSteps.length) * 100)}%
                </p>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
