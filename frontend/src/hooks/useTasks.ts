import { useState, useEffect, useCallback } from 'react'
import { Task, TaskFilters, CreateTaskData } from '../types'
import { taskService } from '../services/tasks'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<TaskFilters>({})
  const [stats, setStats] = useState<{ [key: string]: number }>({})

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    try {
      const resp = await taskService.getAll(filters)
      let currentTasks: Task[]
      // resp might now contain data and meta
      if ('data' in resp) {
        currentTasks = resp.data
        setTasks(resp.data)
      } else {
        currentTasks = resp
        setTasks(resp)
      }
      setError(null)
      // update stats whenever tasks are fetched
      const s = await taskService.getStats()
      setStats({ ...s, total: 'data' in resp ? resp.meta.total : currentTasks.length })
    } catch (err) {
      setError('Erro ao carregar tarefas')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const createTask = async (data: CreateTaskData) => {
    const newTask = await taskService.create(data)
    setTasks(prev => [newTask, ...prev])
    // increment stats count for TODO by default
    setStats(prev => ({
      ...prev,
      TODO: (prev.TODO || 0) + 1,
      total: (prev.total || 0) + 1
    }))
    return newTask
  }

  const updateTask = async (id: string, data: Partial<Task>) => {
    const updated = await taskService.update(id, data)
    setTasks(prev => prev.map(t => t.id === id ? updated : t))
    // if status changed, refresh stats fully
    if (data.status) {
      refreshStats()
    }
    return updated
  }

  const deleteTask = async (id: string) => {
    await taskService.delete(id)
    setTasks(prev => prev.filter(t => t.id !== id))
    refreshStats()
  }

  const fetchStats = async () => {
    try {
      const s = await taskService.getStats()
      setStats(s)
    } catch {
      // ignore
    }
  }

  return {
    tasks,
    loading,
    error,
    filters,
    setFilters,
    stats,
    createTask,
    updateTask,
    deleteTask,
    refresh: fetchTasks,
    refreshStats: fetchStats
  }
}