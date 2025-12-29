import { describe, it, expect, beforeEach } from 'vitest'
import type { User, Department, Message, SupportThread } from './data'

describe('Data Types', () => {
  describe('User interface', () => {
    it('should create a valid user object', () => {
      const user: User = {
        id: 'test@example.com',
        name: 'Test User',
        avatar: 'https://example.com/avatar.png',
        steps: {
          daily: 5000,
          weekly: 25000,
          total: 100000,
          previousDaily: 4500,
          previousWeekly: 24000,
        },
        dailyGoal: 10000,
        departmentId: 'eng',
      }

      expect(user.id).toBe('test@example.com')
      expect(user.steps.daily).toBe(5000)
      expect(user.dailyGoal).toBe(10000)
    })

    it('should support optional role field', () => {
      const adminUser: User = {
        id: 'admin@example.com',
        name: 'Admin User',
        avatar: 'https://example.com/avatar.png',
        steps: {
          daily: 5000,
          weekly: 25000,
          total: 100000,
          previousDaily: 4500,
          previousWeekly: 24000,
        },
        dailyGoal: 10000,
        departmentId: 'eng',
        role: 'admin',
      }

      expect(adminUser.role).toBe('admin')
    })

    it('should support optional mustChangePassword field', () => {
      const newUser: User = {
        id: 'new@example.com',
        name: 'New User',
        avatar: 'https://example.com/avatar.png',
        steps: {
          daily: 0,
          weekly: 0,
          total: 0,
          previousDaily: 0,
          previousWeekly: 0,
        },
        dailyGoal: 10000,
        departmentId: 'eng',
        mustChangePassword: true,
      }

      expect(newUser.mustChangePassword).toBe(true)
    })
  })

  describe('Department interface', () => {
    it('should create a valid department object', () => {
      const department: Department = {
        id: 'eng',
        name: 'Engineering',
      }

      expect(department.id).toBe('eng')
      expect(department.name).toBe('Engineering')
    })
  })

  describe('Message interface', () => {
    it('should create a valid message object', () => {
      const message: Message = {
        id: 'msg-1',
        senderId: 'user@example.com',
        senderName: 'Test User',
        senderAvatar: 'https://example.com/avatar.png',
        departmentId: 'eng',
        content: 'Hello, team!',
        timestamp: Date.now(),
      }

      expect(message.id).toBe('msg-1')
      expect(message.content).toBe('Hello, team!')
      expect(message.timestamp).toBeGreaterThan(0)
    })
  })

  describe('SupportThread interface', () => {
    it('should create a valid support thread object', () => {
      const thread: SupportThread = {
        userId: 'user@example.com',
        userName: 'Test User',
        userAvatar: 'https://example.com/avatar.png',
        messages: [],
        hasUnreadAdminMessages: false,
        hasUnreadUserMessages: false,
      }

      expect(thread.userId).toBe('user@example.com')
      expect(thread.messages).toHaveLength(0)
    })

    it('should support messages in thread', () => {
      const thread: SupportThread = {
        userId: 'user@example.com',
        userName: 'Test User',
        userAvatar: 'https://example.com/avatar.png',
        messages: [
          {
            id: 'msg-1',
            senderId: 'user@example.com',
            senderName: 'Test User',
            content: 'I need help',
            timestamp: Date.now(),
          },
        ],
        hasUnreadAdminMessages: false,
        hasUnreadUserMessages: true,
      }

      expect(thread.messages).toHaveLength(1)
      expect(thread.hasUnreadUserMessages).toBe(true)
    })
  })
})

describe('Data Constants', () => {
  it('should have predefined avatars as an array', async () => {
    const { predefinedAvatars } = await import('./data')
    expect(Array.isArray(predefinedAvatars)).toBe(true)
    expect(predefinedAvatars.length).toBeGreaterThan(0)
    expect(predefinedAvatars[0]).toMatch(/^https:\/\//)
  })

  it('should have ADMIN_USER_ID defined', async () => {
    const { ADMIN_USER_ID } = await import('./data')
    expect(ADMIN_USER_ID).toBeDefined()
    expect(typeof ADMIN_USER_ID).toBe('string')
  })

  it('should have CHALLENGE_TARGET_STEPS defined', async () => {
    const { CHALLENGE_TARGET_STEPS } = await import('./data')
    expect(CHALLENGE_TARGET_STEPS).toBeDefined()
    expect(typeof CHALLENGE_TARGET_STEPS).toBe('number')
    expect(CHALLENGE_TARGET_STEPS).toBeGreaterThan(0)
  })
})

describe('User Step Calculations', () => {
  it('should calculate goal progress correctly', () => {
    const user: User = {
      id: 'test@example.com',
      name: 'Test User',
      avatar: 'https://example.com/avatar.png',
      steps: {
        daily: 7500,
        weekly: 25000,
        total: 100000,
        previousDaily: 7000,
        previousWeekly: 24000,
      },
      dailyGoal: 10000,
      departmentId: 'eng',
    }

    const progress = (user.steps.daily / user.dailyGoal) * 100
    expect(progress).toBe(75)
  })

  it('should cap progress at 100%', () => {
    const user: User = {
      id: 'test@example.com',
      name: 'Test User',
      avatar: 'https://example.com/avatar.png',
      steps: {
        daily: 15000,
        weekly: 25000,
        total: 100000,
        previousDaily: 7000,
        previousWeekly: 24000,
      },
      dailyGoal: 10000,
      departmentId: 'eng',
    }

    const progress = Math.min((user.steps.daily / user.dailyGoal) * 100, 100)
    expect(progress).toBe(100)
  })

  it('should detect goal achievement', () => {
    const userWithGoalMet: User = {
      id: 'test@example.com',
      name: 'Test User',
      avatar: 'https://example.com/avatar.png',
      steps: {
        daily: 10000,
        weekly: 50000,
        total: 200000,
        previousDaily: 9000,
        previousWeekly: 45000,
      },
      dailyGoal: 10000,
      departmentId: 'eng',
    }

    const goalMet = userWithGoalMet.steps.daily >= userWithGoalMet.dailyGoal
    expect(goalMet).toBe(true)
  })

  it('should calculate daily change', () => {
    const user: User = {
      id: 'test@example.com',
      name: 'Test User',
      avatar: 'https://example.com/avatar.png',
      steps: {
        daily: 8000,
        weekly: 40000,
        total: 160000,
        previousDaily: 7000,
        previousWeekly: 38000,
      },
      dailyGoal: 10000,
      departmentId: 'eng',
    }

    const dailyChange = user.steps.daily - user.steps.previousDaily
    expect(dailyChange).toBe(1000)
  })
})
