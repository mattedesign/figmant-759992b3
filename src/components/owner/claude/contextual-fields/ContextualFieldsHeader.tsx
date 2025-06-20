
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { PREDEFINED_FIELDS } from './PredefinedFieldsData';
import { ContextualField } from '@/types/figmant';

interface ContextualFieldsHeaderProps {
  contextualFields: ContextualField[];
  onAddPredefinedField: (field: typeof PREDEFINED_FIELDS[0]) => void;
  onAddCustomField: () => void;
}

export const ContextualFieldsHeader: React.FC<ContextualFieldsHeaderProps> = ({
  contextualFields,
  onAddPredefinedField,
  onAddCustomField
}) => {
  const availablePredefinedFields = PREDEFINED_FIELDS.filter(
    predefined => !contextualFields.some(field => field.id === predefined.id)
  );

  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-lg">Contextual Fields</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Add fields to collect specific context for this prompt template
          </p>
        </div>
        <div className="flex gap-2">
          {availablePredefinedFields.length > 0 && (
            <Select onValueChange={(value) => {
              const predefined = PREDEFINED_FIELDS.find(f => f.id === value);
              if (predefined) onAddPredefinedField(predefined);
            }}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Add predefined field" />
              </SelectTrigger>
              <SelectContent>
                {availablePredefinedFields.map(field => (
                  <SelectItem key={field.id} value={field.id}>
                    {field.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button onClick={onAddCustomField} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Custom Field
          </Button>
        </div>
      </div>
    </CardHeader>
  );
};
