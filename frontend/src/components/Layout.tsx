import { Outlet, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ClipboardList, LogOut, User } from 'lucide-react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Layout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <ClipboardList className="h-8 w-8 text-blue-600 mr-3" />
              <span className="text-xl font-bold text-gray-900">Task Manager</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-700 space-x-2">
                <User className="h-5 w-5" />
                <Link to="/profile" className="text-sm font-medium hover:underline">{user?.name}</Link>
              </div>
              <button
                onClick={logout}
                className="flex items-center text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-5 w-5 mr-1" />
                <span className="text-sm font-medium">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <ToastContainer position="top-right" newestOnTop closeOnClick />
    </div>
  )
}