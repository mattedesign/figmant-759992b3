
import React from 'react';
import { Card } from '@/components/ui/card';
import { ContextualField } from '@/types/figmant';
import { ContextualFieldsHeader } from './contextual-fields/ContextualFieldsHeader';
import { ContextualFieldsList } from './contextual-fields/ContextualFieldsList';
import { PREDEFINED_FIELDS } from './contextual-fields/PredefinedFieldsData';

interface ContextualFieldsSectionProps {
  contextualFields: ContextualField[];
  onUpdateFields: (fields: ContextualField[]) => void;
}

export const ContextualFieldsSection: React.FC<ContextualFieldsSectionProps> = ({
  contextualFields,
  onUpdateFields
}) => {
  const addPredefinedField = (predefinedField: typeof PREDEFINED_FIELDS[0]) => {
    // Check if field already exists
    if (contextualFields.some(field => field.id === predefinedField.id)) {
      return;
    }

    const newField: ContextualField = {
      ...predefinedField
    };
    onUpdateFields([...contextualFields, newField]);
  };

  const addCustomField = () => {
    const newField: ContextualField = {
      id: `custom_field_${Date.now()}`,
      label: '',
      type: 'text',
      required: false
    };
    onUpdateFields([...contextualFields, newField]);
  };

  const updateField = (index: number, updatedField: Partial<ContextualField>) => {
    const updatedFields = contextualFields.map((field, i) => 
      i === index ? { ...field, ...updatedField } : field
    );
    onUpdateFields(updatedFields);
  };

  const removeField = (index: number) => {
    const updatedFields = contextualFields.filter((_, i) => i !== index);
    onUpdateFields(updatedFields);
  };

  return (
    <Card>
      <ContextualFieldsHeader
        contextualFields={contextualFields}
        onAddPredefinedField={addPredefinedField}
        onAddCustomField={addCustomField}
      />
      <ContextualFieldsList
        contextualFields={contextualFields}
        onUpdateField={updateField}
        onRemoveField={removeField}
      />
    </Card>
  );
};
