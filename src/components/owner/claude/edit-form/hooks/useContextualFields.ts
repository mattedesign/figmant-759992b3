
import { useState, useEffect } from 'react';
import { ContextualField } from '@/types/figmant';
import { getContextualFieldsFromMetadata } from '../utils';

interface UseContextualFieldsProps {
  templateMetadata: any;
  templateCategory: string;
  onFieldsUpdate: (fields: ContextualField[]) => void;
}

export const useContextualFields = ({ 
  templateMetadata, 
  templateCategory, 
  onFieldsUpdate 
}: UseContextualFieldsProps) => {
  const [contextualFields, setContextualFields] = useState<ContextualField[]>(
    getContextualFieldsFromMetadata(templateMetadata, templateCategory)
  );

  // Update contextual fields when template changes
  useEffect(() => {
    const fields = getContextualFieldsFromMetadata(templateMetadata, templateCategory);
    setContextualFields(fields);
  }, [templateMetadata, templateCategory]);

  const handleContextualFieldsUpdate = (fields: ContextualField[]) => {
    setContextualFields(fields);
    onFieldsUpdate(fields);
  };

  return {
    contextualFields,
    handleContextualFieldsUpdate
  };
};
