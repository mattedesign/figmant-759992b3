
import { useMemo } from 'react';

export const usePromptValidation = (formData: any) => {
  const validationErrors = useMemo(() => {
    const errors: Record<string, string> = {};

    // Title validation
    if (!formData.title?.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      errors.title = 'Title must be at least 3 characters';
    } else if (formData.title.length > 100) {
      errors.title = 'Title must be less than 100 characters';
    }

    // Display name validation
    if (formData.display_name && formData.display_name.length > 100) {
      errors.display_name = 'Display name must be less than 100 characters';
    }

    // Description validation
    if (formData.description && formData.description.length > 500) {
      errors.description = 'Description must be less than 500 characters';
    }

    // Category validation
    if (!formData.category) {
      errors.category = 'Category is required';
    }

    // Prompt content validation
    if (!formData.original_prompt?.trim()) {
      errors.original_prompt = 'Prompt content is required';
    } else if (formData.original_prompt.length < 50) {
      errors.original_prompt = 'Prompt content must be at least 50 characters';
    } else if (formData.original_prompt.length > 2000) {
      errors.original_prompt = 'Prompt content must be less than 2000 characters';
    }

    // Effectiveness rating validation
    if (formData.effectiveness_rating < 0 || formData.effectiveness_rating > 5) {
      errors.effectiveness_rating = 'Effectiveness rating must be between 0 and 5';
    }

    // Credit cost validation
    if (!formData.credit_cost || formData.credit_cost < 1 || formData.credit_cost > 10) {
      errors.credit_cost = 'Credit cost must be between 1 and 10';
    }

    return errors;
  }, [formData]);

  const isValid = Object.keys(validationErrors).length === 0;

  const validate = () => {
    return { isValid, errors: validationErrors };
  };

  return {
    validationErrors,
    isValid,
    validate
  };
};
