
import { useMemo } from 'react';
import { PROMPT_LIMITS, VALIDATION_RULES } from '@/constants/promptLimits';

export const usePromptValidation = (formData: any) => {
  const validationErrors = useMemo(() => {
    const errors: Record<string, string> = {};

    // Title validation
    if (!formData.title?.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length < VALIDATION_RULES.title.minLength) {
      errors.title = `Title must be at least ${VALIDATION_RULES.title.minLength} characters`;
    } else if (formData.title.length > VALIDATION_RULES.title.maxLength) {
      errors.title = `Title must be less than ${VALIDATION_RULES.title.maxLength} characters`;
    }

    // Display name validation
    if (formData.display_name && formData.display_name.length > PROMPT_LIMITS.TITLE_MAX) {
      errors.display_name = `Display name must be less than ${PROMPT_LIMITS.TITLE_MAX} characters`;
    }

    // Description validation
    if (formData.description && formData.description.length > VALIDATION_RULES.description.maxLength) {
      errors.description = `Description must be less than ${VALIDATION_RULES.description.maxLength} characters`;
    }

    // Category validation
    if (!formData.category) {
      errors.category = 'Category is required';
    }

    // Prompt content validation - Updated to use new limit
    if (!formData.original_prompt?.trim()) {
      errors.original_prompt = 'Prompt content is required';
    } else if (formData.original_prompt.length < VALIDATION_RULES.original_prompt.minLength) {
      errors.original_prompt = `Prompt content must be at least ${VALIDATION_RULES.original_prompt.minLength} characters`;
    } else if (formData.original_prompt.length > VALIDATION_RULES.original_prompt.maxLength) {
      errors.original_prompt = `Prompt content must be less than ${VALIDATION_RULES.original_prompt.maxLength} characters`;
    }

    // Claude response validation
    if (formData.claude_response && formData.claude_response.length > VALIDATION_RULES.claude_response.maxLength) {
      errors.claude_response = `Example response must be less than ${VALIDATION_RULES.claude_response.maxLength} characters`;
    }

    // Use case context validation
    if (formData.use_case_context && formData.use_case_context.length > VALIDATION_RULES.use_case_context.maxLength) {
      errors.use_case_context = `Use case context must be less than ${VALIDATION_RULES.use_case_context.maxLength} characters`;
    }

    // Business domain validation
    if (formData.business_domain && formData.business_domain.length > VALIDATION_RULES.business_domain.maxLength) {
      errors.business_domain = `Business domain must be less than ${VALIDATION_RULES.business_domain.maxLength} characters`;
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
