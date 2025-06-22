
import { FileText, Edit3, Settings, Target, Wrench } from 'lucide-react';

export interface EditorSection {
  id: string;
  label: string;
  icon: any;
  fields: string[];
  description: string;
}

export const editorSections: EditorSection[] = [
  {
    id: 'basic',
    label: 'Basic Info',
    icon: FileText,
    fields: ['title', 'display_name', 'description'],
    description: 'Essential template information and metadata'
  },
  {
    id: 'content',
    label: 'Prompt Content',
    icon: Edit3,
    fields: ['original_prompt', 'claude_response'],
    description: 'Main prompt content and AI response examples'
  },
  {
    id: 'configuration',
    label: 'Settings',
    icon: Settings,
    fields: ['category', 'effectiveness_rating', 'credit_cost'],
    description: 'Template configuration and performance settings'
  },
  {
    id: 'context',
    label: 'Context & Usage',
    icon: Target,
    fields: ['use_case_context', 'business_domain', 'prompt_variables'],
    description: 'Usage context and variable definitions'
  },
  {
    id: 'advanced',
    label: 'Advanced',
    icon: Wrench,
    fields: ['contextual_fields', 'is_template', 'is_active', 'metadata'],
    description: 'Advanced options and template settings'
  }
];
