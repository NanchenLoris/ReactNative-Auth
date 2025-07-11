import { AuthState, AuthAction } from '../utils/auth.types';

export const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  requires2FA: false,
  pendingVerification: false,
};

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        requires2FA: false,
        pendingVerification: false,
      };

    case 'LOGIN_REQUIRES_2FA':
      return {
        ...state,
        isLoading: false,
        requires2FA: true,
        pendingVerification: true,
      };

    case 'VERIFY_2FA_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        requires2FA: false,
        pendingVerification: false,
        error: null,
      };

    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
    case 'VERIFY_2FA_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        requires2FA: false,
        pendingVerification: false,
      };

    case 'LOGOUT':
      return {
        ...initialAuthState,
      };

    case 'REFRESH_TOKEN_SUCCESS':
      return {
        ...state,
        error: null,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
};