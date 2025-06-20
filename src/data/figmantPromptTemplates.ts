
// All prompt templates now come from the database via the claude_prompt_examples table
// This file is kept for backward compatibility but exports empty arrays

export const figmantPromptTemplates: any[] = [];

export const getFigmantTemplate = (templateId: string): any | null => {
  console.warn('getFigmantTemplate is deprecated. All templates now come from the database.');
  return null;
};

// Re-export from templates for any remaining dependencies
export * from './templates/index';
