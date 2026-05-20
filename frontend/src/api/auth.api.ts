import { apiClient } from './axios';
import type { ApiResponse, AuthResponse, LoginDto, RegisterDto, User } from '@/types';

export const authApi = {
  register: async (dto: RegisterDto) => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', dto);
    return res.data.data!;
  },

  login: async (dto: LoginDto) => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', dto);
    return res.data.data!;
  },

  logout: async () => {
    await apiClient.post('/auth/logout');
  },

  getMe: async () => {
    const res = await apiClient.get<ApiResponse<{ user: User }>>('/auth/me');
    return res.data.data!.user;
  },

  refreshToken: async () => {
    const res = await apiClient.post<ApiResponse<{ accessToken: string }>>('/auth/refresh');
    return res.data.data!;
  },
};
