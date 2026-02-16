export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export interface Task {
  id: string
  title: string
  description?: string
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  dueDate?: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface TaskFilters {
  status?: Task['status']
  priority?: Task['priority']
  search?: string
  sort?:
    | 'createdAt_desc'
    | 'createdAt_asc'
    | 'dueDate_desc'
    | 'dueDate_asc'
}

export interface CreateTaskData {
  title: string
  description?: string
  priority?: Task['priority']
  dueDate?: string
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  updateProfile: (payload: { name?: string; password?: string }) => Promise<User>
  logout: () => void
  loading: boolean
}