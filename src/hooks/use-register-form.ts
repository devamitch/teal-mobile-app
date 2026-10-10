import {useCallback, useState} from 'react';

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterFormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export interface RegisterFormState {
  data: RegisterFormData;
  errors: RegisterFormErrors;
  isValid: boolean;
  touched: {
    username: boolean;
    email: boolean;
    password: boolean;
    confirmPassword: boolean;
  };
}

const validateUsername = (username: string): string | undefined => {
  if (!username.trim()) {
    return 'Username is required';
  }
  return undefined;
};

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

const validateConfirmPassword = (
  password: string,
  confirmPassword: string,
): string | undefined => {
  if (!confirmPassword) {
    return 'Confirm password is required';
  }

  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }

  return undefined;
};

export const useRegisterForm = () => {
  const [formState, setFormState] = useState<RegisterFormState>({
    data: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    errors: {},
    isValid: false,
    touched: {
      username: false,
      email: false,
      password: false,
      confirmPassword: false,
    },
  });

  const validateForm = useCallback(
    (data: RegisterFormData): RegisterFormErrors => {
      const errors: RegisterFormErrors = {};

      const usernameError = validateUsername(data.username);
      if (usernameError) errors.username = usernameError;

      const emailError = validateEmail(data.email);
      if (emailError) errors.email = emailError;

      const passwordError = validatePassword(data.password);
      if (passwordError) errors.password = passwordError;

      const confirmPasswordError = validateConfirmPassword(
        data.password,
        data.confirmPassword,
      );
      if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

      return errors;
    },
    [],
  );

  const updateField = useCallback(
    (field: keyof RegisterFormData, value: string) => {
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
    (field: keyof RegisterFormData, touched: boolean = true) => {
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
    (field: keyof RegisterFormErrors, error: string) => {
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
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      errors: {},
      isValid: false,
      touched: {
        username: false,
        email: false,
        password: false,
        confirmPassword: false,
      },
    });
  }, []);

  const getFieldError = useCallback(
    (field: keyof RegisterFormData): string | undefined => {
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
