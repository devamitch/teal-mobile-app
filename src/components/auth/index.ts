// Auth Components
export {AuthHeader} from './auth-header';
export {ForgotPasswordLink} from './forgot-password-link';
export {LoginForm} from './login-form';
export {LoginPrompt} from './login-prompt';
export {RegisterForm} from './register-form';
export {SignUpPrompt} from './sign-up-prompt';

// Social Auth Buttons
export {
  AppleSignInButton,
  AppleSignInButtonAlt,
  AuthDivider,
  GoogleSignInButton,
  GoogleSignInButtonAlt,
} from './social-buttons';

// Auth Hooks
export {useAuth} from '@/hooks/use-auth';
export {useLoginForm} from '@/hooks/use-login-form';
export {useRegisterForm} from '@/hooks/use-register-form';

// Types
export type {AuthState, LoginCredentials} from '@/hooks/use-auth';
export type {
  LoginFormData,
  LoginFormErrors,
  LoginFormState,
} from '@/hooks/use-login-form';
export type {
  RegisterFormData,
  RegisterFormErrors,
  RegisterFormState,
} from '@/hooks/use-register-form';
