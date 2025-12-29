import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { SignUpForm } from './signup-form'
import { createMockDepartment } from '@/test/test-utils'
import type { Department } from '@/lib/data'

// Mock the server action
vi.mock('@/app/actions', () => ({
  signupAction: vi.fn(),
}))

const mockDepartments: Department[] = [
  createMockDepartment({ id: 'eng', name: 'Engineering' }),
  createMockDepartment({ id: 'mkt', name: 'Marketing' }),
  createMockDepartment({ id: 'hr', name: 'Human Resources' }),
]

describe('SignUpForm Component', () => {
  it('should render signup form with all fields', () => {
    render(<SignUpForm departments={mockDepartments} />)

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    // Radix UI Select doesn't properly associate label, check by text
    expect(screen.getByText('Department')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('should render create account button', () => {
    render(<SignUpForm departments={mockDepartments} />)

    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('should render form title and description', () => {
    render(<SignUpForm departments={mockDepartments} />)

    expect(screen.getByText('Create an account')).toBeInTheDocument()
    expect(screen.getByText(/enter your details to get started/i)).toBeInTheDocument()
  })

  it('should mention DHS employees restriction', () => {
    render(<SignUpForm departments={mockDepartments} />)

    expect(screen.getByText(/only open to DHS employees/i)).toBeInTheDocument()
  })

  it('should render sign in link', () => {
    render(<SignUpForm departments={mockDepartments} />)

    expect(screen.getByText(/already have an account/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument()
  })

  it('should link to the login page', () => {
    render(<SignUpForm departments={mockDepartments} />)

    const loginLink = screen.getByRole('link', { name: /sign in/i })
    expect(loginLink).toHaveAttribute('href', '/login')
  })

  it('should have name input with correct placeholder', () => {
    render(<SignUpForm departments={mockDepartments} />)

    const nameInput = screen.getByLabelText(/name/i)
    expect(nameInput).toHaveAttribute('placeholder', 'Alex Williams')
  })

  it('should have email input with correct placeholder', () => {
    render(<SignUpForm departments={mockDepartments} />)

    const emailInput = screen.getByLabelText(/email/i)
    expect(emailInput).toHaveAttribute('placeholder', 'name@dhs.lacounty.gov')
  })

  it('should have email input with type email', () => {
    render(<SignUpForm departments={mockDepartments} />)

    const emailInput = screen.getByLabelText(/email/i)
    expect(emailInput).toHaveAttribute('type', 'email')
  })

  it('should have password input with type password', () => {
    render(<SignUpForm departments={mockDepartments} />)

    const passwordInput = screen.getByLabelText(/password/i)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('should have required attribute on name input', () => {
    render(<SignUpForm departments={mockDepartments} />)

    const nameInput = screen.getByLabelText(/name/i)
    expect(nameInput).toBeRequired()
  })

  it('should have required attribute on email input', () => {
    render(<SignUpForm departments={mockDepartments} />)

    const emailInput = screen.getByLabelText(/email/i)
    expect(emailInput).toBeRequired()
  })

  it('should have required attribute on password input', () => {
    render(<SignUpForm departments={mockDepartments} />)

    const passwordInput = screen.getByLabelText(/password/i)
    expect(passwordInput).toBeRequired()
  })

  it('should render department select with placeholder', () => {
    render(<SignUpForm departments={mockDepartments} />)

    expect(screen.getByText('Select your department')).toBeInTheDocument()
  })

  it('should handle empty departments array', () => {
    render(<SignUpForm departments={[]} />)

    // Radix UI Select doesn't properly associate label, check by text
    expect(screen.getByText('Department')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByText('Select your department')).toBeInTheDocument()
  })
})
