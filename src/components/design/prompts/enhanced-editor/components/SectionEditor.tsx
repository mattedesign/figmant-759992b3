
import React from 'react';
import { BasicInfoSection } from '../sections/BasicInfoSection';
import { ContentSection } from '../sections/ContentSection';
import { ConfigurationSection } from '../sections/ConfigurationSection';
import { ContextSection } from '../sections/ContextSection';
import { AdvancedSection } from '../sections/AdvancedSection';

interface SectionEditorProps {
  section: string;
  formData: any;
  onChange: (field: string, value: any) => void;
  validationErrors: Record<string, string>;
}

export const SectionEditor: React.FC<SectionEditorProps> = ({
  section,
  formData,
  onChange,
  validationErrors
}) => {
  const sectionProps = {
    formData,
    onChange,
    validationErrors
  };

  switch (section) {
    case 'basic':
      return <BasicInfoSection {...sectionProps} />;
    case 'content':
      return <ContentSection {...sectionProps} />;
    case 'configuration':
      return <ConfigurationSection {...sectionProps} />;
    case 'context':
      return <ContextSection {...sectionProps} />;
    case 'advanced':
      return <AdvancedSection {...sectionProps} />;
    default:
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Section not found</p>
        </div>
      );
  }
};
