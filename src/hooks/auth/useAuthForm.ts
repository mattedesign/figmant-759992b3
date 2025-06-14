
import { useState } from 'react';

export interface FormErrors {
  [key: string]: string | undefined;
}

export const useAuthForm = <T extends Record<string, any>>(
  initialData: T,
  validationRules: Partial<Record<keyof T, (value: any) => string | undefined>>
) => {
  const [formData, setFormData] = useState<T>(initialData);
  const [errors, setErrors] = useState<FormErrors>({});

  const updateField = (field: keyof T, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const clearError = (field: keyof T) => {
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field as string]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    Object.entries(validationRules).forEach(([field, validator]) => {
      if (validator) {
        const error = validator(formData[field as keyof T]);
        if (error) {
          newErrors[field] = error;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData(initialData);
    setErrors({});
  };

  return {
    formData,
    errors,
    updateField,
    clearError,
    validateForm,
    resetForm,
    setFormData
  };
};
