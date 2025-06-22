
export const PROMPT_LIMITS = {
  TITLE_MAX: 100,
  DESCRIPTION_MAX: 500,
  PROMPT_CONTENT_MAX: 8000,  // Increased from 2000
  RESPONSE_MAX: 4000,
  USE_CASE_MAX: 1000,
  BUSINESS_DOMAIN_MAX: 200
};

export const VALIDATION_RULES = {
  title: { 
    required: true, 
    minLength: 3, 
    maxLength: PROMPT_LIMITS.TITLE_MAX 
  },
  original_prompt: { 
    required: true, 
    minLength: 50, 
    maxLength: PROMPT_LIMITS.PROMPT_CONTENT_MAX 
  },
  description: {
    maxLength: PROMPT_LIMITS.DESCRIPTION_MAX
  },
  claude_response: {
    maxLength: PROMPT_LIMITS.RESPONSE_MAX
  },
  use_case_context: {
    maxLength: PROMPT_LIMITS.USE_CASE_MAX
  },
  business_domain: {
    maxLength: PROMPT_LIMITS.BUSINESS_DOMAIN_MAX
  }
};

export const getPromptLimitStatus = (length: number, maxLength: number) => {
  const percentage = (length / maxLength) * 100;
  
  if (percentage >= 100) return 'error';
  if (percentage >= 90) return 'danger';
  if (percentage >= 80) return 'warning';
  return 'normal';
};

export const getPromptLimitMessage = (length: number, maxLength: number) => {
  const remaining = maxLength - length;
  const status = getPromptLimitStatus(length, maxLength);
  
  switch (status) {
    case 'error':
      return `Exceeds limit by ${length - maxLength} characters`;
    case 'danger':
      return `Only ${remaining} characters remaining`;
    case 'warning':
      return `${remaining} characters left`;
    default:
      return `${length} / ${maxLength} characters`;
  }
};
