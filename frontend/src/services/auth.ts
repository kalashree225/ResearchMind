import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/login', credentials);
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    return data;
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/register', userData);
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    return data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('access_token');
  },
};
