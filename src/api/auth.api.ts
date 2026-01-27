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

export interface ApiUser {
  id: string;
  name: string | null;
  email: string;
  isVerified: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AuthResponse extends ApiResponse<{ user: ApiUser; token: string }> {}

export interface RegisterResponse extends ApiResponse<{ email?: string }> {}

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
    resendOtp: builder.mutation<ApiResponse<null>, { email: string }>({
      query: (data) => ({
        url: '/auth/resend-otp',
        method: 'POST',
        data,
      }),
    }),
    getCurrentUser: builder.query<ApiResponse<ApiUser>, void>({
      query: () => ({
        url: '/profile/me',
        method: 'GET',
      }),
    }),
    updateProfile: builder.mutation<ApiResponse<ApiUser>, { name: string }>({
      query: (payload) => ({
        url: '/profile/update-me',
        method: 'PATCH',
        data: payload,
      }),
    }),
    changePassword: builder.mutation<ApiResponse<null>, { currentPassword: string; newPassword: string }>({
      query: (payload) => ({
        url: '/auth/change-password',
        method: 'POST',
        data: payload,
      }),
    }),
    deleteProfile: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: '/profile/delete-me',
        method: 'DELETE',
      }),
    }),
    logout: builder.mutation<ApiResponse<null>, void>({
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
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useDeleteProfileMutation,
  useLogoutMutation,
} = authApi;
