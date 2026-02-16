import { useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { useTasks } from '../hooks/useTasks'
import { Task, CreateTaskData } from '../types'
import TaskCard from '../components/TaskCard'
import TaskForm from '../components/TaskForm'
import TaskFilters from '../components/TaskFilters'

export default function Dashboard() {
  const { tasks, loading, filters, setFilters, createTask, updateTask, deleteTask, stats: apiStats, refreshStats } = useTasks()
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const handleCreate = async (data: CreateTaskData) => {
    try {
      await createTask(data)
      toast.success('Tarefa criada com sucesso')
      setShowForm(false)
    } catch {
      toast.error('Erro ao criar tarefa')
    }
  }

  const handleUpdate = async (data: CreateTaskData) => {
    if (editingTask) {
      try {
        await updateTask(editingTask.id, data)
        toast.success('Tarefa atualizada')
        setEditingTask(null)
      } catch {
        toast.error('Erro ao atualizar tarefa')
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      try {
        await deleteTask(id)
        toast.success('Tarefa excluída')
      } catch {
        toast.error('Erro ao excluir tarefa')
      }
    }
  }

  const handleStatusChange = async (id: string, status: Task['status']) => {
    try {
      await updateTask(id, { status })
      toast.success('Status atualizado')
    } catch {
      toast.error('Erro ao atualizar status')
    }
  }

  const stats = {
    total: apiStats.total || tasks.length,
    todo: apiStats.TODO || 0,
    inProgress: apiStats.IN_PROGRESS || 0,
    done: apiStats.DONE || 0,
  }

  useEffect(() => {
    refreshStats()
  }, [refreshStats])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Minhas Tarefas</h1>
        <p className="text-gray-600">Gerencie suas tarefas de forma eficiente</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div
          onClick={() => setFilters({})}
          className="bg-white p-4 rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
        >
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div
          onClick={() => setFilters({ status: 'TODO' })}
          className="bg-white p-4 rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
        >
          <p className="text-sm text-gray-600">A fazer</p>
          <p className="text-2xl font-bold text-blue-600">{stats.todo}</p>
        </div>
        <div
          onClick={() => setFilters({ status: 'IN_PROGRESS' })}
          className="bg-white p-4 rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
        >
          <p className="text-sm text-gray-600">Em andamento</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
        </div>
        <div
          onClick={() => setFilters({ status: 'DONE' })}
          className="bg-white p-4 rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
        >
          <p className="text-sm text-gray-600">Concluídas</p>
          <p className="text-2xl font-bold text-green-600">{stats.done}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nova Tarefa
        </button>
      </div>

      <TaskFilters filters={filters} onFilterChange={setFilters} />

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nenhuma tarefa encontrada</p>
          <p className="text-gray-400 mt-2">Crie uma nova tarefa para começar</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={setEditingTask}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {showForm && (
        <TaskForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingTask && (
        <TaskForm
          task={editingTask}
          onSubmit={handleUpdate}
          onCancel={() => setEditingTask(null)}
        />
      )}
    </div>
  )
}