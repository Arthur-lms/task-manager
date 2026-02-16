import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Profile from '../Profile'

// mock useAuth to control user and updateProfile behavior
jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn()
}))
const mockedUseAuth = require('../../hooks/useAuth').useAuth as jest.Mock

// mock toast to avoid real notifications
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}))

describe('Profile page', () => {
  const user = {
    id: '1',
    name: 'Alice',
    email: 'alice@example.com',
    createdAt: new Date().toISOString()
  }
  const updateProfile = jest.fn()

  beforeEach(() => {
    mockedUseAuth.mockReturnValue({ user, updateProfile })
  })

  it('renders user information and form', () => {
    render(<Profile />)

    expect(screen.getByText('Meu Perfil')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    expect(screen.getByLabelText('Nova senha')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirmar senha')).toBeInTheDocument()
  })

  it('shows validation error when passwords do not match', async () => {
    render(<Profile />)

    fireEvent.change(screen.getByLabelText('Nova senha'), { target: { value: '123456' } })
    fireEvent.change(screen.getByLabelText('Confirmar senha'), { target: { value: 'abcdef' } })
    fireEvent.click(screen.getByText('Salvar'))

    expect(await screen.findByText('Senhas não coincidem')).toBeInTheDocument()
    expect(updateProfile).not.toHaveBeenCalled()
  })

  it('submits valid data', async () => {
    render(<Profile />)

    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Alice Updated' } })
    fireEvent.change(screen.getByLabelText('Nova senha'), { target: { value: 'newpass' } })
    fireEvent.change(screen.getByLabelText('Confirmar senha'), { target: { value: 'newpass' } })
    fireEvent.click(screen.getByText('Salvar'))

    expect(updateProfile).toHaveBeenCalledWith({ name: 'Alice Updated', password: 'newpass' })
  })
})