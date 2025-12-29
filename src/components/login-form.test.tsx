import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { LoginForm } from './login-form'

// Mock the server action
vi.mock('@/app/actions', () => ({
  loginAction: vi.fn(),
}))

describe('LoginForm Component', () => {
  it('should render login form with email and password fields', () => {
    render(<LoginForm />)

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('should render sign in button', () => {
    render(<LoginForm />)

    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('should render login title and description', () => {
    render(<LoginForm />)

    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByText(/enter your email below to login/i)).toBeInTheDocument()
  })

  it('should render sign up link', () => {
    render(<LoginForm />)

    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument()
  })

  it('should have email input with correct placeholder', () => {
    render(<LoginForm />)

    const emailInput = screen.getByLabelText(/email/i)
    expect(emailInput).toHaveAttribute('placeholder', 'name@dhs.lacounty.gov')
  })

  it('should have email input with type email', () => {
    render(<LoginForm />)

    const emailInput = screen.getByLabelText(/email/i)
    expect(emailInput).toHaveAttribute('type', 'email')
  })

  it('should have password input with type password', () => {
    render(<LoginForm />)

    const passwordInput = screen.getByLabelText(/password/i)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('should have required attribute on email input', () => {
    render(<LoginForm />)

    const emailInput = screen.getByLabelText(/email/i)
    expect(emailInput).toBeRequired()
  })

  it('should have required attribute on password input', () => {
    render(<LoginForm />)

    const passwordInput = screen.getByLabelText(/password/i)
    expect(passwordInput).toBeRequired()
  })

  it('should render the form as a card', () => {
    render(<LoginForm />)

    // Card should be present (contains the form structure)
    expect(screen.getByRole('button', { name: /sign in/i }).closest('form')).toBeInTheDocument()
  })

  it('should link to the signup page', () => {
    render(<LoginForm />)

    const signupLink = screen.getByRole('link', { name: /sign up/i })
    expect(signupLink).toHaveAttribute('href', '/signup')
  })
})
