import { useState } from 'react';

interface UseAuthFormProps {
  initialValues: Record<string, string>;
  validation?: Record<string, (value: string) => string | null>;
}

export const useAuthForm = ({ initialValues, validation }: UseAuthFormProps) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const setValue = (field: string, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const setFieldTouched = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const validateField = (field: string, value: string) => {
    if (validation && validation[field]) {
      const error = validation[field](value);
      setErrors(prev => ({ ...prev, [field]: error || '' }));
      return !error;
    }
    return true;
  };

  const validateForm = () => {
    if (!validation) return true;
    
    let isValid = true;
    const newErrors: Record<string, string> = {};
    
    Object.keys(validation).forEach(field => {
      const error = validation[field](values[field] || '');
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    validateField,
    validateForm,
    reset,
  };
};
