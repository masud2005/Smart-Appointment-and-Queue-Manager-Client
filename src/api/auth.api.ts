import { baseApi } from './axios';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface OtpVerifyRequest {
  email: string;
  otp: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      name: string | null;
      email: string;
      isVerified: boolean;
    };
    token: string;
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data?: {
    email: string;
  };
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        data: credentials,
      }),
    }),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        data: userData,
      }),
    }),
    verifyOtp: builder.mutation<AuthResponse, OtpVerifyRequest>({
      query: (data) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        data,
      }),
    }),
    resendOtp: builder.mutation<any, { email: string }>({
      query: (data) => ({
        url: '/auth/resend-otp',
        method: 'POST',
        data,
      }),
    }),
    getCurrentUser: builder.query<AuthResponse, void>({
      query: () => ({
        url: '/profile/me',
        method: 'GET',
      }),
    }),
    logout: builder.mutation<any, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const { 
  useLoginMutation, 
  useRegisterMutation, 
  useVerifyOtpMutation, 
  useResendOtpMutation,
  useGetCurrentUserQuery,
  useLogoutMutation,
} = authApi;
