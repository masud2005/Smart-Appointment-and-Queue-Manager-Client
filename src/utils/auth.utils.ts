/**
 * Authentication utilities and validators
 * Common functions used across authentication components
 */

/**
 * Validate email format
 * @param email Email address to validate
 * @returns boolean True if valid email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validate password strength
 * Requirements: minimum 6 characters, at least one uppercase, one lowercase, and one number
 * @param password Password to validate
 * @returns object with isValid boolean and error message
 */
export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }

  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters' };
  }

  if (!/(?=.*[a-z])/.test(password)) {
    return { isValid: false, message: 'Password must contain lowercase letters' };
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    return { isValid: false, message: 'Password must contain uppercase letters' };
  }

  if (!/(?=.*\d)/.test(password)) {
    return { isValid: false, message: 'Password must contain numbers' };
  }

  return { isValid: true };
};

/**
 * Validate full name
 * @param name Full name to validate
 * @returns boolean True if valid name
 */
export const validateName = (name: string): boolean => {
  const trimmedName = name.trim();
  return trimmedName.length >= 3;
};

/**
 * Validate OTP format
 * OTP should be 6 digits
 * @param otp OTP to validate
 * @returns boolean True if valid OTP format
 */
export const validateOtp = (otp: string): boolean => {
  return /^\d{6}$/.test(otp);
};

/**
 * Check if user is authenticated based on Redux state
 * @param user User object from Redux
 * @returns boolean True if user exists
 */
export const isAuthenticated = (user: any): boolean => {
  return !!user && !!user.id && !!user.email;
};

/**
 * Format time for countdown display
 * @param seconds Total seconds
 * @returns formatted string MM:SS
 */
export const formatCountdownTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Get user-friendly error message from API error
 * @param error Error object from API
 * @returns formatted error message
 */
export const getErrorMessage = (error: any): string => {
  if (typeof error?.data?.message === 'string') {
    return error.data.message;
  }

  if (typeof error?.message === 'string') {
    return error.message;
  }

  if (error?.data?.error) {
    return error.data.error;
  }

  return 'An error occurred. Please try again.';
};

/**
 * Check if API error is due to network issues
 * @param error Error object
 * @returns boolean True if network error
 */
export const isNetworkError = (error: any): boolean => {
  return !error?.response || error?.message === 'Network Error';
};

/**
 * Check if API error is 401 Unauthorized
 * @param error Error object
 * @returns boolean True if 401 error
 */
export const isUnauthorizedError = (error: any): boolean => {
  return error?.response?.status === 401;
};

/**
 * Sanitize user input to prevent XSS
 * @param input User input string
 * @returns sanitized string
 */
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

/**
 * Check if email already exists in a list
 * @param email Email to check
 * @param emailList List of existing emails
 * @returns boolean True if email exists
 */
export const emailExists = (email: string, emailList: string[]): boolean => {
  return emailList.some((e) => e.toLowerCase() === email.toLowerCase());
};
