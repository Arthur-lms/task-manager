import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import TaskForm from '../TaskForm'

describe('TaskForm', () => {
  it('should show validation error when title is empty', async () => {
    const handleSubmit = jest.fn()
    const handleCancel = jest.fn()

    render(<TaskForm onSubmit={handleSubmit} onCancel={handleCancel} />)

    fireEvent.click(screen.getByText('Criar'))

    expect(await screen.findByText('Título é obrigatório')).toBeInTheDocument()
    expect(handleSubmit).not.toHaveBeenCalled()
  })
})