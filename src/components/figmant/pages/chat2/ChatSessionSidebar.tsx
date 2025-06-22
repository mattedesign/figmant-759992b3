
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, 
  MessageSquare, 
  Search, 
  MoreVertical, 
  Calendar,
  Clock
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

interface ChatSession {
  id: string;
  session_name: string;
  created_at: string;
  last_activity: string;
  is_active: boolean;
}

interface ChatSessionSidebarProps {
  sessions: ChatSession[];
  currentSessionId?: string;
  onSessionSelect: (sessionId: string) => void;
  onNewSession: () => void;
}

export const ChatSessionSidebar: React.FC<ChatSessionSidebarProps> = ({
  sessions,
  currentSessionId,
  onSessionSelect,
  onNewSession
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSessions = sessions.filter(session =>
    session.session_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupSessionsByDate = (sessions: ChatSession[]) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const groups: { [key: string]: ChatSession[] } = {
      today: [],
      yesterday: [],
      thisWeek: [],
      older: []
    };

    sessions.forEach(session => {
      const sessionDate = new Date(session.last_activity);
      const daysDiff = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === 0) {
        groups.today.push(session);
      } else if (daysDiff === 1) {
        groups.yesterday.push(session);
      } else if (daysDiff <= 7) {
        groups.thisWeek.push(session);
      } else {
        groups.older.push(session);
      }
    });

    return groups;
  };

  const sessionGroups = groupSessionsByDate(filteredSessions);

  const formatSessionTime = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const SessionGroup: React.FC<{ title: string; sessions: ChatSession[] }> = ({ title, sessions }) => {
    if (sessions.length === 0) return null;

    return (
      <div className="mb-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-2">
          {title}
        </h3>
        <div className="space-y-1">
          {sessions.map((session) => (
            <Card
              key={session.id}
              className={`p-3 cursor-pointer transition-all hover:shadow-sm ${
                currentSessionId === session.id 
                  ? 'bg-blue-50 border-blue-200 shadow-sm' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => onSessionSelect(session.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {session.session_name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{formatSessionTime(session.last_activity)}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">Chat Sessions</h2>
          <Button onClick={onNewSession} size="sm" className="h-8">
            <Plus className="h-4 w-4 mr-1" />
            New
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sessions..."
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* Sessions List */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {filteredSessions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">
                {searchQuery ? 'No sessions found' : 'No chat sessions yet'}
              </p>
              {!searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onNewSession}
                  className="mt-2"
                >
                  Create your first session
                </Button>
              )}
            </div>
          ) : (
            <>
              <SessionGroup title="Today" sessions={sessionGroups.today} />
              <SessionGroup title="Yesterday" sessions={sessionGroups.yesterday} />
              <SessionGroup title="This Week" sessions={sessionGroups.thisWeek} />
              <SessionGroup title="Older" sessions={sessionGroups.older} />
            </>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t bg-white">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar className="h-3 w-3" />
          <span>{sessions.length} total sessions</span>
        </div>
      </div>
    </div>
  );
};
