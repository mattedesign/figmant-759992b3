
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, RefreshCw, Wrench } from 'lucide-react';
import { AnalysisRecoveryService, AnalysisValidationResult } from '@/services/analysis/AnalysisRecoveryService';
import { useToast } from '@/hooks/use-toast';

interface SystemStatusMonitorProps {
  showDetails?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const SystemStatusMonitor: React.FC<SystemStatusMonitorProps> = ({
  showDetails = false,
  autoRefresh = false,
  refreshInterval = 30000
}) => {
  const [validationResult, setValidationResult] = useState<AnalysisValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const { toast } = useToast();

  const performValidation = async () => {
    setIsValidating(true);
    try {
      console.log('🔍 SYSTEM STATUS - Performing validation check');
      const result = await AnalysisRecoveryService.validateSystemIntegrity();
      setValidationResult(result);
      setLastCheck(new Date());
      
      if (!result.isValid) {
        toast({
          variant: "destructive",
          title: "System Issues Detected",
          description: `Found ${result.errors.length} errors. Check system status for details.`,
        });
      } else if (result.warnings.length > 0) {
        toast({
          title: "System Warnings",
          description: `${result.warnings.length} warnings detected. System is functional.`,
        });
      }
    } catch (error) {
      console.error('❌ System validation failed:', error);
      toast({
        variant: "destructive",
        title: "Validation Failed",
        description: "Unable to check system status. Please try again.",
      });
    } finally {
      setIsValidating(false);
    }
  };

  useEffect(() => {
    // Initial validation
    performValidation();
  }, []);

  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(performValidation, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const getStatusColor = () => {
    if (!validationResult) return 'secondary';
    if (!validationResult.isValid) return 'destructive';
    if (validationResult.warnings.length > 0) return 'default';
    return 'default';
  };

  const getStatusIcon = () => {
    if (isValidating) return <RefreshCw className="w-4 h-4 animate-spin" />;
    if (!validationResult) return <AlertCircle className="w-4 h-4" />;
    if (!validationResult.isValid) return <AlertCircle className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (isValidating) return 'Checking...';
    if (!validationResult) return 'Unknown';
    if (!validationResult.isValid) return 'Issues Detected';
    if (validationResult.warnings.length > 0) return 'Warnings';
    return 'Healthy';
  };

  if (!showDetails) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant={getStatusColor()} className="flex items-center gap-1">
          {getStatusIcon()}
          {getStatusText()}
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={performValidation}
          disabled={isValidating}
          className="h-6 w-6 p-0"
        >
          <RefreshCw className={`w-3 h-3 ${isValidating ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5" />
            System Status
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={performValidation}
            disabled={isValidating}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isValidating ? 'animate-spin' : ''}`} />
            {isValidating ? 'Checking...' : 'Check Now'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Overall Status:</span>
          <Badge variant={getStatusColor()} className="flex items-center gap-1">
            {getStatusIcon()}
            {getStatusText()}
          </Badge>
        </div>

        {lastCheck && (
          <div className="text-xs text-muted-foreground">
            Last checked: {lastCheck.toLocaleTimeString()}
          </div>
        )}

        {validationResult && (
          <div className="space-y-3">
            {validationResult.errors.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-destructive mb-2">Errors ({validationResult.errors.length})</h4>
                <ul className="text-xs space-y-1">
                  {validationResult.errors.map((error, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertCircle className="w-3 h-3 mt-0.5 text-destructive flex-shrink-0" />
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {validationResult.warnings.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-yellow-600 mb-2">Warnings ({validationResult.warnings.length})</h4>
                <ul className="text-xs space-y-1">
                  {validationResult.warnings.map((warning, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertCircle className="w-3 h-3 mt-0.5 text-yellow-600 flex-shrink-0" />
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {validationResult.dataIntegrityIssues.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-blue-600 mb-2">Data Integrity Issues</h4>
                <ul className="text-xs space-y-1">
                  {validationResult.dataIntegrityIssues.map((issue, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertCircle className="w-3 h-3 mt-0.5 text-blue-600 flex-shrink-0" />
                      {issue.table_name}: {issue.details} ({issue.count} records)
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {validationResult.isValid && validationResult.warnings.length === 0 && validationResult.errors.length === 0 && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">All analysis engines are functioning properly</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
