
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { ConnectionStatus } from '@/types/claude';
import { validateApiKey } from '@/constants/claude';

export const getConnectionStatus = (enabled: boolean, apiKey: string): ConnectionStatus => {
  if (!enabled) {
    return { status: 'disabled', icon: XCircle, color: 'text-gray-500', text: 'Disabled' };
  }
  if (!validateApiKey(apiKey)) {
    return { status: 'error', icon: AlertTriangle, color: 'text-red-500', text: 'API Key Invalid' };
  }
  return { status: 'ready', icon: CheckCircle, color: 'text-green-500', text: 'Ready' };
};
