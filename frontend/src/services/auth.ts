import api from './api'
import { User } from '../types'

interface AuthResponse {
  user: User
  token: string
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password })
    return data
  },

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', { name, email, password })
    return data
  },

  async getProfile(): Promise<User> {
    const { data } = await api.get<User>('/auth/profile')
    return data
  },

  async updateProfile(payload: { name?: string; password?: string }): Promise<User> {
    const { data } = await api.put<User>('/auth/profile', payload)
    return data
  }
}