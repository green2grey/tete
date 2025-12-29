import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { MyStats } from './my-stats'
import { createMockUser } from '@/test/test-utils'

// Mock the server action
vi.mock('@/app/actions', () => ({
  updateStepsAction: vi.fn(),
}))

describe('MyStats Component', () => {
  it('should render user step count', () => {
    const user = createMockUser({ steps: { daily: 7500, weekly: 35000, total: 140000, previousDaily: 7000, previousWeekly: 34000 } })
    render(<MyStats user={user} />)

    expect(screen.getByText('7,500')).toBeInTheDocument()
    expect(screen.getByText('steps today')).toBeInTheDocument()
  })

  it('should render daily goal', () => {
    const user = createMockUser({ dailyGoal: 10000 })
    render(<MyStats user={user} />)

    expect(screen.getByText('10,000 steps')).toBeInTheDocument()
    expect(screen.getByText('Daily Goal')).toBeInTheDocument()
  })

  it('should show "Log Today\'s Steps" button when goal not met', () => {
    const user = createMockUser({
      steps: { daily: 5000, weekly: 25000, total: 100000, previousDaily: 4500, previousWeekly: 24000 },
      dailyGoal: 10000
    })
    render(<MyStats user={user} />)

    expect(screen.getByRole('button', { name: /log today's steps/i })).toBeInTheDocument()
  })

  it('should show "Goal Achieved!" badge when goal is met', () => {
    const user = createMockUser({
      steps: { daily: 12000, weekly: 60000, total: 240000, previousDaily: 11000, previousWeekly: 55000 },
      dailyGoal: 10000
    })
    render(<MyStats user={user} />)

    expect(screen.getByText('Goal Achieved!')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /log today's steps/i })).not.toBeInTheDocument()
  })

  it('should show "Goal Achieved!" when daily equals goal exactly', () => {
    const user = createMockUser({
      steps: { daily: 10000, weekly: 50000, total: 200000, previousDaily: 9000, previousWeekly: 45000 },
      dailyGoal: 10000
    })
    render(<MyStats user={user} />)

    expect(screen.getByText('Goal Achieved!')).toBeInTheDocument()
  })

  it('should render the progress card with correct title', () => {
    const user = createMockUser()
    render(<MyStats user={user} />)

    expect(screen.getByText('Your Progress')).toBeInTheDocument()
    expect(screen.getByText('Your daily step challenge summary.')).toBeInTheDocument()
  })

  it('should handle zero steps', () => {
    const user = createMockUser({
      steps: { daily: 0, weekly: 0, total: 0, previousDaily: 0, previousWeekly: 0 },
      dailyGoal: 10000
    })
    render(<MyStats user={user} />)

    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /log today's steps/i })).toBeInTheDocument()
  })

  it('should format large numbers with commas', () => {
    const user = createMockUser({
      steps: { daily: 15432, weekly: 77160, total: 308640, previousDaily: 14000, previousWeekly: 70000 },
      dailyGoal: 12000
    })
    render(<MyStats user={user} />)

    expect(screen.getByText('15,432')).toBeInTheDocument()
    expect(screen.getByText('12,000 steps')).toBeInTheDocument()
  })
})
