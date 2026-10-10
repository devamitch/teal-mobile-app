import {useCallback, useState} from 'react';

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export interface LoginFormState {
  data: LoginFormData;
  errors: LoginFormErrors;
  isValid: boolean;
  touched: {
    email: boolean;
    password: boolean;
  };
}

const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) {
    return 'Email is required';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }

  return undefined;
};

const validatePassword = (password: string): string | undefined => {
  if (!password) {
    return 'Password is required';
  }

  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }

  return undefined;
};

export const useLoginForm = () => {
  const [formState, setFormState] = useState<LoginFormState>({
    data: {
      email: '',
      password: '',
    },
    errors: {},
    isValid: false,
    touched: {
      email: false,
      password: false,
    },
  });

  const validateForm = useCallback((data: LoginFormData): LoginFormErrors => {
    const errors: LoginFormErrors = {};

    const emailError = validateEmail(data.email);
    if (emailError) errors.email = emailError;

    const passwordError = validatePassword(data.password);
    if (passwordError) errors.password = passwordError;

    return errors;
  }, []);

  const updateField = useCallback(
    (field: keyof LoginFormData, value: string) => {
      setFormState(prev => {
        const newData = {...prev.data, [field]: value};
        const errors = validateForm(newData);
        const isValid = Object.keys(errors).length === 0;

        return {
          ...prev,
          data: newData,
          errors,
          isValid,
        };
      });
    },
    [validateForm],
  );

  const setFieldTouched = useCallback(
    (field: keyof LoginFormData, touched: boolean = true) => {
      setFormState(prev => ({
        ...prev,
        touched: {
          ...prev.touched,
          [field]: touched,
        },
      }));
    },
    [],
  );

  const setError = useCallback(
    (field: keyof LoginFormErrors, error: string) => {
      setFormState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          [field]: error,
        },
        isValid: false,
      }));
    },
    [],
  );

  const clearErrors = useCallback(() => {
    setFormState(prev => ({
      ...prev,
      errors: {},
      isValid: Object.keys(validateForm(prev.data)).length === 0,
    }));
  }, [validateForm]);

  const reset = useCallback(() => {
    setFormState({
      data: {
        email: '',
        password: '',
      },
      errors: {},
      isValid: false,
      touched: {
        email: false,
        password: false,
      },
    });
  }, []);

  const getFieldError = useCallback(
    (field: keyof LoginFormData): string | undefined => {
      return formState.touched[field] ? formState.errors[field] : undefined;
    },
    [formState.touched, formState.errors],
  );

  return {
    ...formState,
    updateField,
    setFieldTouched,
    setError,
    clearErrors,
    reset,
    getFieldError,
  };
};
