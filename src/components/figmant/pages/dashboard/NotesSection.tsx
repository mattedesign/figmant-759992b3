import React from 'react';
import { Button } from '@/components/ui/button';
import { NoteData } from './types/dashboard';
import { NotesSectionLoading } from './components/LoadingStates';
import { NotesEmpty } from './components/EmptyStates';
import { NotesError } from './components/ErrorStates';

interface NotesSectionProps {
  notesData: NoteData[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

export const NotesSection: React.FC<NotesSectionProps> = ({ 
  notesData, 
  isLoading, 
  error, 
  onRetry 
}) => {
  const containerStyle = {
    borderRadius: 'var(--corner-radius-2xl, 16px)',
    border: '1px solid var(--border-neutral-xsubtle, rgba(10, 12, 17, 0.10))',
    background: 'var(--background-base-white, #FFF)',
    padding: '24px'
  };

  return (
    <div style={containerStyle}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Notes</h3>
        <Button variant="ghost" size="sm" className="text-blue-600 text-sm">
          Private
        </Button>
      </div>
      
      {/* Loading State */}
      {isLoading && <NotesSectionLoading />}
      
      {/* Error State */}
      {error && !isLoading && <NotesError onRetry={onRetry} />}
      
      {/* Empty State */}
      {!isLoading && !error && notesData.length === 0 && (
        <NotesEmpty onAction={() => {
          // Could open a notes creation modal
          console.log('Create note functionality not implemented yet');
        }} />
      )}
      
      {/* Data State */}
      {!isLoading && !error && notesData.length > 0 && (
        <div className="space-y-4">
          {notesData.map((note, index) => (
            <div key={index} className="space-y-2">
              <h4 className="font-medium text-sm">{note.title}</h4>
              <ul className="space-y-1">
                {note.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-gray-400 mt-1.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
