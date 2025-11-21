import { useState } from 'react';
import type { UseFormValidationProps } from '@/types';

export function useFormValidation<T extends Record<string, any>>({
  initialData,
  validationRules = [],
  onDataChange,
}: UseFormValidationProps<T>) {
  const [formData, setFormData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const updateField = (field: keyof T, value: any) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    setTouched({ ...touched, [field]: true });
    
    // Clear error for this field
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
    
    onDataChange?.(newFormData);
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};

    validationRules.forEach((rule) => {
      const error = rule.validate(formData[rule.field], formData);
      if (error) {
        newErrors[rule.field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateField = (field: keyof T): boolean => {
    const rule = validationRules.find((r) => r.field === field);
    if (!rule) return true;

    const error = rule.validate(formData[field], formData);
    setErrors({ ...errors, [field]: error });
    return !error;
  };

  const reset = () => {
    setFormData(initialData);
    setErrors({});
    setTouched({});
  };

  const setFieldError = (field: keyof T, error: string) => {
    setErrors({ ...errors, [field]: error });
  };

  return {
    formData,
    errors,
    touched,
    updateField,
    validate,
    validateField,
    reset,
    setFormData,
    setFieldError,
  };
}
