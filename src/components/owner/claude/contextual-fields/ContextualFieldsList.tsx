
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { ContextualField } from '@/types/figmant';
import { ContextualFieldCard } from './ContextualFieldCard';

interface ContextualFieldsListProps {
  contextualFields: ContextualField[];
  onUpdateField: (index: number, updatedField: Partial<ContextualField>) => void;
  onRemoveField: (index: number) => void;
}

export const ContextualFieldsList: React.FC<ContextualFieldsListProps> = ({
  contextualFields,
  onUpdateField,
  onRemoveField
}) => {
  if (contextualFields.length === 0) {
    return (
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <p>No contextual fields defined.</p>
          <p className="text-sm">Use the buttons above to add predefined or custom fields.</p>
        </div>
      </CardContent>
    );
  }

  return (
    <CardContent className="space-y-4">
      {contextualFields.map((field, index) => (
        <ContextualFieldCard
          key={field.id}
          field={field}
          index={index}
          onUpdate={onUpdateField}
          onRemove={onRemoveField}
        />
      ))}
    </CardContent>
  );
};
