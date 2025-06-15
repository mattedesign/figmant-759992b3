
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Activity, Trash2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { RealtimeEvent } from './types/RealTimeEventsTypes';
import { getEventTypeIcon } from './utils/realTimeUtils';

interface RecentEventsCardProps {
  recentEvents: RealtimeEvent[];
  onClearEvents: () => void;
}

export const RecentEventsCard: React.FC<RecentEventsCardProps> = ({
  recentEvents,
  onClearEvents
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Recent Events
            <Badge variant="outline" className="text-xs">
              {recentEvents.length}
            </Badge>
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearEvents}
            className="h-6 w-6 p-0"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
        <CardDescription className="text-xs">
          Live updates from the database
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-48">
          {recentEvents.length > 0 ? (
            <div className="space-y-2">
              {recentEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-2 p-2 bg-muted/30 rounded text-xs">
                  {getEventTypeIcon(event.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{event.type}</span>
                      <span className="text-muted-foreground">{event.table}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground mt-1">
                      <Clock className="h-3 w-3" />
                      {format(event.timestamp, 'HH:mm:ss')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground text-xs py-8">
              No recent events
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
