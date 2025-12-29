import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { Leaderboards } from './leaderboards'
import { createMockUser, createMockDepartment } from '@/test/test-utils'
import type { User, Department } from '@/lib/data'

type DepartmentWithMembers = Department & { members: User[] }

function createDepartmentsWithMembers(): DepartmentWithMembers[] {
  return [
    {
      ...createMockDepartment({ id: 'eng', name: 'Engineering' }),
      members: [
        createMockUser({
          id: 'user1@test.com',
          name: 'Alice Engineer',
          departmentId: 'eng',
          steps: { daily: 10000, weekly: 50000, total: 200000, previousDaily: 9000, previousWeekly: 45000 }
        }),
        createMockUser({
          id: 'user2@test.com',
          name: 'Bob Developer',
          departmentId: 'eng',
          steps: { daily: 8000, weekly: 40000, total: 160000, previousDaily: 7500, previousWeekly: 38000 }
        }),
      ],
    },
    {
      ...createMockDepartment({ id: 'mkt', name: 'Marketing' }),
      members: [
        createMockUser({
          id: 'user3@test.com',
          name: 'Carol Marketer',
          departmentId: 'mkt',
          steps: { daily: 12000, weekly: 60000, total: 240000, previousDaily: 11000, previousWeekly: 55000 }
        }),
      ],
    },
  ]
}

describe('Leaderboards Component', () => {
  it('should render leaderboards title', () => {
    const departments = createDepartmentsWithMembers()
    const currentUser = departments[0].members[0]

    render(<Leaderboards departments={departments} currentUser={currentUser} />)

    expect(screen.getByText('Leaderboards')).toBeInTheDocument()
  })

  it('should render department and user tabs', () => {
    const departments = createDepartmentsWithMembers()
    const currentUser = departments[0].members[0]

    render(<Leaderboards departments={departments} currentUser={currentUser} />)

    expect(screen.getByRole('tab', { name: /departments/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /my department/i })).toBeInTheDocument()
  })

  it('should render time frame tabs (Daily, Weekly, Overall)', () => {
    const departments = createDepartmentsWithMembers()
    const currentUser = departments[0].members[0]

    render(<Leaderboards departments={departments} currentUser={currentUser} />)

    expect(screen.getByRole('tab', { name: /daily/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /weekly/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /overall/i })).toBeInTheDocument()
  })

  it('should display department names in leaderboard', () => {
    const departments = createDepartmentsWithMembers()
    const currentUser = departments[0].members[0]

    render(<Leaderboards departments={departments} currentUser={currentUser} />)

    expect(screen.getByText('Engineering')).toBeInTheDocument()
    expect(screen.getByText('Marketing')).toBeInTheDocument()
  })

  it('should display member counts for departments', () => {
    const departments = createDepartmentsWithMembers()
    const currentUser = departments[0].members[0]

    render(<Leaderboards departments={departments} currentUser={currentUser} />)

    expect(screen.getByText('2 members')).toBeInTheDocument()
    expect(screen.getByText('1 members')).toBeInTheDocument()
  })

  it('should show description text', () => {
    const departments = createDepartmentsWithMembers()
    const currentUser = departments[0].members[0]

    render(<Leaderboards departments={departments} currentUser={currentUser} />)

    expect(screen.getByText(/see how you and your department stack up/i)).toBeInTheDocument()
  })

  it('should handle empty departments array', () => {
    const currentUser = createMockUser()
    render(<Leaderboards departments={[]} currentUser={currentUser} />)

    expect(screen.getByText('Leaderboards')).toBeInTheDocument()
  })

  it('should display formatted step counts', () => {
    const departments = createDepartmentsWithMembers()
    const currentUser = departments[0].members[0]

    render(<Leaderboards departments={departments} currentUser={currentUser} />)

    // Total steps for Engineering: 200000 + 160000 = 360000
    expect(screen.getByText(/360,000 steps/)).toBeInTheDocument()
    // Total steps for Marketing: 240000
    expect(screen.getByText(/240,000 steps/)).toBeInTheDocument()
  })
})

describe('Leaderboards Sorting', () => {
  it('should sort departments by total steps (highest first)', () => {
    const departments: DepartmentWithMembers[] = [
      {
        ...createMockDepartment({ id: 'small', name: 'Small Dept' }),
        members: [
          createMockUser({
            steps: { daily: 1000, weekly: 5000, total: 10000, previousDaily: 900, previousWeekly: 4500 }
          }),
        ],
      },
      {
        ...createMockDepartment({ id: 'large', name: 'Large Dept' }),
        members: [
          createMockUser({
            steps: { daily: 10000, weekly: 50000, total: 100000, previousDaily: 9000, previousWeekly: 45000 }
          }),
        ],
      },
    ]
    const currentUser = departments[0].members[0]

    render(<Leaderboards departments={departments} currentUser={currentUser} />)

    // Get all the cards with department names and check order
    const departmentCards = screen.getAllByText(/steps$/)
    expect(departmentCards[0]).toHaveTextContent('100,000')
  })
})
