import { TaskFilters as TaskFiltersType } from '../types'
import { Search } from 'lucide-react'

interface TaskFiltersProps {
  filters: TaskFiltersType
  onFilterChange: (filters: TaskFiltersType) => void
}

export default function TaskFilters({ filters, onFilterChange }: TaskFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar tarefas..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex gap-3 items-center">
          <label className="sr-only" htmlFor="statusFilter">Status</label>
          <select
            id="statusFilter"
            value={filters.status || ''}
            onChange={(e) => onFilterChange({ 
              ...filters, 
              status: e.target.value as TaskFiltersType['status'] || undefined 
            })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Todos status</option>
            <option value="TODO">A fazer</option>
            <option value="IN_PROGRESS">Em andamento</option>
            <option value="DONE">Concluídas</option>
          </select>

          <label className="sr-only" htmlFor="priorityFilter">Prioridade</label>
          <select
            id="priorityFilter"
            value={filters.priority || ''}
            onChange={(e) => onFilterChange({ 
              ...filters, 
              priority: e.target.value as TaskFiltersType['priority'] || undefined 
            })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Todas prioridades</option>
            <option value="LOW">Baixa</option>
            <option value="MEDIUM">Média</option>
            <option value="HIGH">Alta</option>
          </select>

          <label className="sr-only" htmlFor="sortFilter">Ordenar</label>
          <select
            id="sortFilter"
            value={filters.sort || ''}
            onChange={(e) => onFilterChange({
              ...filters,
              sort: e.target.value || undefined
            })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Ordenar</option>
            <option value="createdAt_desc">Mais recentes</option>
            <option value="createdAt_asc">Mais antigos</option>
            <option value="dueDate_asc">Vencimento mais próximo</option>
            <option value="dueDate_desc">Vencimento mais distante</option>
          </select>

          <button
            onClick={() => onFilterChange({})}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Limpar
          </button>
        </div>
      </div>
    </div>
  )
}