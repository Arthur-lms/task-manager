import { Task } from '../types'
import { Calendar, Clock, Edit2, Trash2, CheckCircle2, Circle, AlertCircle } from 'lucide-react'
import { format, parseISO, isPast, isToday } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: Task['status']) => void
}

const statusConfig = {
  TODO: { label: 'A fazer', icon: Circle, color: 'text-gray-500', bg: 'bg-gray-100' },
  IN_PROGRESS: { label: 'Em andamento', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-100' },
  DONE: { label: 'Concluída', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-100' }
}

const priorityConfig = {
  LOW: { label: 'Baixa', color: 'text-gray-600', bg: 'bg-gray-100' },
  MEDIUM: { label: 'Média', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  HIGH: { label: 'Alta', color: 'text-red-600', bg: 'bg-red-100' }
}

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const StatusIcon = statusConfig[task.status].icon
  const isOverdue = task.dueDate && isPast(parseISO(task.dueDate)) && task.status !== 'DONE'
  const isDueToday = task.dueDate && isToday(parseISO(task.dueDate))

  return (
    <div className={`card hover:shadow-lg transition-shadow ${isOverdue ? 'border-l-4 border-red-500' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
            {isOverdue && (
              <span className="flex items-center text-red-600 text-xs font-medium">
                <AlertCircle className="h-4 w-4 mr-1" />
                Atrasada
              </span>
            )}
            {isDueToday && !isOverdue && (
              <span className="text-blue-600 text-xs font-medium">Hoje</span>
            )}
          </div>
          
          {task.description && (
            <p className="text-gray-600 text-sm mb-3">{task.description}</p>
          )}
          
          <div className="flex items-center gap-3 text-sm">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityConfig[task.priority].bg} ${priorityConfig[task.priority].color}`}>
              {priorityConfig[task.priority].label}
            </span>
            
            <button
              onClick={() => onStatusChange(task.id, task.status === 'DONE' ? 'TODO' : 'DONE')}
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[task.status].bg} ${statusConfig[task.status].color} hover:opacity-80 transition-opacity`}
            >
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusConfig[task.status].label}
            </button>
            
            {task.dueDate && (
              <span className={`flex items-center text-xs ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
                <Calendar className="h-3 w-3 mr-1" />
                {format(parseISO(task.dueDate), 'dd/MM/yyyy', { locale: ptBR })}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}