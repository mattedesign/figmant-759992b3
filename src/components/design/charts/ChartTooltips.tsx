
import React from 'react';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="font-medium">{label}</p>
        <p className="text-sm" style={{ color: data.color }}>
          Score: {data.value}/10
        </p>
        <p className="text-xs text-muted-foreground">
          Category: {data.payload.category}
        </p>
      </div>
    );
  }
  return null;
};

interface RadarTooltipProps {
  active?: boolean;
  payload?: any[];
}

export const RadarTooltip: React.FC<RadarTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="font-medium">{data.payload.metric}</p>
        <p className="text-sm text-blue-600">
          Score: {data.value}/10
        </p>
      </div>
    );
  }
  return null;
};
