
import React from 'react';
import { Button } from '@/components/ui/button';
import { NoteData } from './types/dashboard';

interface NotesSectionProps {
  notesData: NoteData[];
}

export const NotesSection: React.FC<NotesSectionProps> = ({ notesData }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Notes</h3>
        <Button variant="ghost" size="sm" className="text-blue-600 text-sm">
          Private
        </Button>
      </div>
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
    </div>
  );
};
