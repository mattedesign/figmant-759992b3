
import React from 'react';
import { BarChart3, Users, TrendingUp, Activity } from 'lucide-react';

export const DashboardPreview = () => {
  return (
    <div className="relative h-full overflow-hidden rounded-2xl border-2 border-border bg-gradient-to-br from-background to-muted/30">
      {/* Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg"></div>
            <div>
              <div className="text-sm font-semibold">UX Analytics AI</div>
              <div className="text-xs text-muted-foreground">Dashboard Preview</div>
            </div>
          </div>
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-background/60 backdrop-blur-sm rounded-xl p-4 border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">248</div>
                <div className="text-xs text-muted-foreground">Analyses</div>
              </div>
              <BarChart3 className="h-8 w-8 text-primary/60" />
            </div>
          </div>
          
          <div className="bg-background/60 backdrop-blur-sm rounded-xl p-4 border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">92%</div>
                <div className="text-xs text-muted-foreground">UX Score</div>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500/60" />
            </div>
          </div>
        </div>

        {/* Chart Area */}
        <div className="bg-background/60 backdrop-blur-sm rounded-xl p-4 border border-border/50 h-32">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium">Performance Trends</div>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="h-16 bg-gradient-to-r from-primary/20 to-primary/5 rounded-lg flex items-end justify-center space-x-1">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="bg-primary/30 rounded-sm"
                style={{
                  height: `${Math.random() * 100 + 20}%`,
                  width: '6px'
                }}
              />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-background/60 backdrop-blur-sm rounded-xl p-4 border border-border/50">
          <div className="flex items-center space-x-2 mb-3">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div className="text-sm font-medium">Recent Activity</div>
          </div>
          <div className="space-y-2">
            {['Design analysis completed', 'New insights available', 'Report generated'].map((activity, i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary/40 rounded-full"></div>
                <div className="text-xs text-muted-foreground">{activity}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none"></div>
    </div>
  );
};
