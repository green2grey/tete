import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { Toaster } from '@/components/ui/toaster'

// Custom render function that includes providers
function AllProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options })

// Re-export everything from testing-library
export * from '@testing-library/react'

// Override render with our custom render
export { customRender as render }

// Helper to create mock user data
export function createMockUser(overrides = {}) {
  return {
    id: 'test.user@dhs.lacounty.gov',
    name: 'Test User',
    avatar: 'https://placehold.co/100x100/F87171/FFFFFF.png',
    steps: {
      daily: 5000,
      weekly: 25000,
      total: 100000,
      previousDaily: 4500,
      previousWeekly: 24000,
    },
    dailyGoal: 10000,
    departmentId: 'eng',
    role: 'user' as const,
    ...overrides,
  }
}

// Helper to create mock department data
export function createMockDepartment(overrides = {}) {
  return {
    id: 'test-dept',
    name: 'Test Department',
    ...overrides,
  }
}
