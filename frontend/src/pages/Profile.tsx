import { useAuth } from '../hooks/useAuth'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'

const schema = z.object({
  name: z.string().min(2).optional(),
  password: z.string().min(6).optional(),
  confirmPassword: z.string().optional()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword']
})

type FormValues = z.infer<typeof schema>

export default function Profile() {
  const { user, updateProfile } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: user?.name || '' }
  })

  if (!user) return null

  const onSubmit = async (data: FormValues) => {
    try {
      await updateProfile({ name: data.name, password: data.password })
      toast.success('Perfil atualizado')
    } catch (e) {
      toast.error('Erro ao atualizar perfil')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Meu Perfil</h1>
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <p><strong>Nome:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Criado em:</strong> {new Date(user.createdAt).toLocaleString()}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Editar Perfil</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              {...register('name')}
              className="input-field"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nova senha</label>
            <input
              type="password"
              {...register('password')}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirmar senha</label>
            <input
              type="password"
              {...register('confirmPassword')}
              className="input-field"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </button>
        </form>
      </div>
    </div>
  )
}
