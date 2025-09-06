import axios from 'axios';
import type { LoginRequest, RegisterRequest, AuthResponse, User } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const authApi = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
class TokenManager {
  private static readonly TOKEN_KEY = 'ticket_dashboard_token';
  private static readonly REFRESH_TOKEN_KEY = 'ticket_dashboard_refresh_token';

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static setRefreshToken(refreshToken: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  static clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  static setTokens(token: string, refreshToken: string): void {
    this.setToken(token);
    this.setRefreshToken(refreshToken);
  }
}

// Request interceptor to add auth token
authApi.interceptors.request.use(
  (config) => {
    const token = TokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      TokenManager.clearTokens();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await authApi.post<AuthResponse>('/login', credentials);
      const data = response.data;

      if (data.success && data.token && data.refreshToken) {
        TokenManager.setTokens(data.token, data.refreshToken);
      }

      return data;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await authApi.post<AuthResponse>('/register', userData);
      const data = response.data;

      if (data.success && data.token && data.refreshToken) {
        TokenManager.setTokens(data.token, data.refreshToken);
      }

      return data;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await authApi.get<User>('/me');
      return response.data;
    } catch (error: any) {
      console.error('Get current user error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get user data');
    }
  },

  logout: async (): Promise<void> => {
    try {
      await authApi.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      TokenManager.clearTokens();
    }
  },

  validateToken: async (): Promise<boolean> => {
    try {
      await authApi.post('/validate');
      return true;
    } catch (error) {
      return false;
    }
  },

  isAuthenticated: (): boolean => {
    return !!TokenManager.getToken();
  },

  getToken: (): string | null => {
    return TokenManager.getToken();
  },

  clearTokens: (): void => {
    TokenManager.clearTokens();
  }
};

export { TokenManager };
export default authService;