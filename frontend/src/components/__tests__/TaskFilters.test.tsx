import { render, screen, fireEvent } from '@testing-library/react'
import TaskFilters from '../TaskFilters'

describe('TaskFilters', () => {
  it('calls onFilterChange when status is changed', () => {
    const handle = jest.fn()
    render(<TaskFilters filters={{}} onFilterChange={handle} />)

    fireEvent.change(screen.getByLabelText('Status'), {
      target: { value: 'DONE' }
    })

    expect(handle).toHaveBeenCalledWith({ status: 'DONE' })
  })
})