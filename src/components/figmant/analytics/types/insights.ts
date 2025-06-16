
export interface Insight {
  id: string;
  type: 'improvement' | 'trend' | 'alert';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  timestamp: Date;
}

export interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  category: string;
}

export interface Recommendation {
  id: string;
  type: 'improvement';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  timestamp: Date;
  actionItems: string[];
}

export interface InsightsPanelProps {
  insights: Insight[];
  metrics: PerformanceMetric[];
  isLoading: boolean;
}
