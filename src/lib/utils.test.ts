import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn (className utility)', () => {
  it('should merge class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('should handle conditional classes', () => {
    expect(cn('base', true && 'included', false && 'excluded')).toBe('base included')
  })

  it('should handle undefined and null values', () => {
    expect(cn('base', undefined, null, 'end')).toBe('base end')
  })

  it('should merge Tailwind classes correctly', () => {
    // tailwind-merge should handle conflicting classes
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
  })

  it('should handle object syntax', () => {
    expect(cn({ 'text-red-500': true, 'text-blue-500': false })).toBe('text-red-500')
  })

  it('should handle array syntax', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar')
  })

  it('should handle empty inputs', () => {
    expect(cn()).toBe('')
    expect(cn('')).toBe('')
  })

  it('should deduplicate conflicting Tailwind classes', () => {
    // tailwind-merge deduplicates conflicting Tailwind utilities, not generic classes
    expect(cn('text-sm', 'text-lg')).toBe('text-lg')
  })

  it('should handle complex Tailwind merging', () => {
    expect(cn('bg-red-500 hover:bg-red-600', 'bg-blue-500')).toBe('hover:bg-red-600 bg-blue-500')
  })
})
