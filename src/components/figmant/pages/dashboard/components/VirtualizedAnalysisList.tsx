
import React, { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Star, MoreHorizontal } from 'lucide-react';
import { AnalysisData } from '../types/dashboard';

interface VirtualizedAnalysisListProps {
  analysisData: AnalysisData[];
  height?: number;
  width?: number;
  itemHeight?: number;
  onItemClick?: (analysis: AnalysisData) => void;
}

interface AnalysisRowProps {
  index: number;
  style: React.CSSProperties;
  data: {
    items: AnalysisData[];
    onItemClick?: (analysis: AnalysisData) => void;
  };
}

const AnalysisRow: React.FC<AnalysisRowProps> = ({ index, style, data }) => {
  const analysis = data.items[index];
  
  return (
    <div style={style} className="px-2 py-1">
      <Card 
        className="border-0 cursor-pointer hover:shadow-md transition-shadow"
        style={{
          borderRadius: 'var(--corner-radius-xl, 12px)',
          border: '1px solid var(--border-neutral-xsubtle, rgba(10, 12, 17, 0.10))',
          background: 'var(--background-base-white, #FFF)'
        }}
        onClick={() => data.onItemClick?.(analysis)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-gray-400" />
              <span className="font-medium text-sm">{analysis.title}</span>
            </div>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-gray-500">Status: {analysis.status}</div>
            <div className="text-xs text-gray-500">Type: {analysis.type}</div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">{analysis.progress}%</span>
              </div>
              <Progress value={analysis.progress} className="h-1.5" />
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>Suggestions: {analysis.suggestions}</span>
              <span>Documents: {analysis.documents}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const VirtualizedAnalysisList: React.FC<VirtualizedAnalysisListProps> = ({
  analysisData,
  height = 400,
  width = '100%',
  itemHeight = 180,
  onItemClick
}) => {
  const listData = useMemo(() => ({
    items: analysisData,
    onItemClick
  }), [analysisData, onItemClick]);

  if (analysisData.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No analysis data available
      </div>
    );
  }

  return (
    <div className="border rounded-lg" style={{ height, width }}>
      <List
        height={height}
        width={width}
        itemCount={analysisData.length}
        itemSize={itemHeight}
        itemData={listData}
        overscanCount={2}
      >
        {AnalysisRow}
      </List>
    </div>
  );
};
