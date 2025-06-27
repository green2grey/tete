'use server';

import { getPersonalizedMotivation, PersonalizedMotivationInput } from '@/ai/flows/personalized-motivation';
import { users, pendingVerifications, User, messages, Message, predefinedAvatars, supportThreads, SupportThread, SupportMessage, departments, Department } from '@/lib/data';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAuth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getMotivationAction(input: PersonalizedMotivationInput) {
    try {
        const motivation = await getPersonalizedMotivation(input);
        return { success: true, data: motivation };
    } catch (error) {
        console.error('Error fetching personalized motivation:', error);
        return { success: false, error: 'Failed to get personalized motivation. Please try again later.' };
    }
}

// Mock sign-up action
export async function signupAction(prevState: unknown, data: FormData) {
    const name = data.get('name') as string;
    const email = data.get('email') as string;
    const password = data.get('password') as string;
    const departmentId = data.get('departmentId') as string;

    if (!name || !email || !password || !departmentId) {
        return { success: false, error: 'All fields are required.' };
    }

    if (!email.endsWith('@dhs.lacounty.gov')) {
        return { success: false, error: 'Only @dhs.lacounty.gov emails are allowed.' };
    }

    if (users.some(user => user.id === email)) {
        return { success: false, error: 'User with this email already exists.' };
    }

    // In a real app, you would use a secure random code generator
    const code = '123456'; // Mock verification code
    console.log(`Verification code for ${email}: ${code}`);

    const randomAvatar = predefinedAvatars[Math.floor(Math.random() * predefinedAvatars.length)];

    pendingVerifications.set(email, {
        code,
        user: { name, avatar: randomAvatar, steps: { daily: 0, weekly: 0, total: 0, previousDaily: 0, previousWeekly: 0 }, dailyGoal: 10000, departmentId, password, role: 'user' },
        timestamp: Date.now(),
    });

    return { success: true };
}

// Mock email verification action
export async function verifyEmailAction(prevState: unknown, data: FormData) {
    const email = data.get('email') as string;
    const code = data.get('code') as string;

    if (!email || !code) {
        return { success: false, error: 'Email and code are required.' };
    }
    
    const pending = pendingVerifications.get(email);

    if (!pending || pending.code !== code) {
        return { success: false, error: 'Invalid verification code.' };
    }
    
    // Optional: Check if verification code has expired
    // const fiveMinutes = 5 * 60 * 1000;
    // if (Date.now() - pending.timestamp > fiveMinutes) {
    //     pendingVerifications.delete(email);
    //     return { success: false, error: 'Verification code expired.' };
    // }

    users.push({ ...pending.user, id: email });
    pendingVerifications.delete(email);

    return { success: true };
}

// Mock login action
export async function loginAction(prevState: unknown, data: FormData) {
    const email = data.get('email') as string;
    const password = data.get('password') as string;

    if (!email || !password) {
        return { success: false, error: 'Email and password are required.' };
    }

    const user = users.find(u => u.id === email);

    if (!user || user.password !== password) {
        return { success: false, error: 'Invalid email or password.' };
    }

    cookies().set('auth_token', user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    });

    return { success: true };
}

export async function logoutAction() {
    cookies().delete('auth_token');
    cookies().delete('dev_user_view');
    redirect('/login');
}

// User Actions
export async function updateAvatarAction(prevState: unknown, formData: FormData) {
    const { currentUser } = await getAuth();
    if (!currentUser) {
      return { success: false, error: 'You must be logged in to do that.' };
    }
  
    const avatarUrl = formData.get('avatarUrl') as string;
    if (!avatarUrl || !predefinedAvatars.includes(avatarUrl)) {
      return { success: false, error: 'Invalid avatar selected.' };
    }
  
    const userIndex = users.findIndex((u) => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex].avatar = avatarUrl;
    
      // Also update the avatar in past chat messages for consistency
      messages.forEach((message, index) => {
          if (message.senderId === currentUser.id) {
              messages[index].senderAvatar = avatarUrl;
          }
      });

    } else {
      return { success: false, error: 'User not found.' };
    }
    
    revalidatePath('/dashboard');
    return { success: true };
}

export async function updatePasswordAction(prevState: unknown, data: FormData) {
    const { currentUser } = await getAuth();
    if (!currentUser) {
      return { success: false, error: 'You must be logged in to do that.' };
    }

    const newPassword = data.get('newPassword') as string;
    const confirmPassword = data.get('confirmPassword') as string;

    if (!newPassword || !confirmPassword) {
        return { success: false, error: 'Both password fields are required.' };
    }
    if (newPassword.length < 8) {
        return { success: false, error: 'Password must be at least 8 characters long.' };
    }
    if (newPassword !== confirmPassword) {
        return { success: false, error: 'Passwords do not match.' };
    }

    const userIndex = users.findIndex((u) => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex].password = newPassword;
      users[userIndex].mustChangePassword = false;
    } else {
      return { success: false, error: 'User not found.' };
    }
    
    revalidatePath('/dashboard');
    return { success: true };
}

export async function updateStepsAction(prevState: unknown, data: FormData) {
    const { currentUser } = await getAuth();
    if (!currentUser) {
      return { success: false, error: 'You must be logged in to do that.' };
    }
    
    const stepsStr = data.get('steps') as string;
    const newDailySteps = parseInt(stepsStr, 10);
    
    if (isNaN(newDailySteps) || newDailySteps < 0) {
        return { success: false, error: 'Please enter a valid number of steps.' };
    }

    const userIndex = users.findIndex((u) => u.id === currentUser.id);
    if (userIndex === -1) {
      return { success: false, error: 'User not found.' };
    }
    
    const oldDailySteps = users[userIndex].steps.daily || 0;
    
    // Update total and weekly steps based on the change in daily steps
    users[userIndex].steps.total = (users[userIndex].steps.total - oldDailySteps) + newDailySteps;
    users[userIndex].steps.weekly = (users[userIndex].steps.weekly - oldDailySteps) + newDailySteps;
    
    // Set the new daily step count
    users[userIndex].steps.daily = newDailySteps;
    
    revalidatePath('/dashboard');
    return { success: true, newDailySteps };
}

// Admin Actions
export async function adminCreateUserAction(prevState: unknown, data: FormData) {
    const { currentUser } = await getAuth();
    if (currentUser?.role !== 'admin' && currentUser?.role !== 'manager') {
        return { success: false, error: 'Unauthorized action.' };
    }

    const firstName = data.get('firstName') as string;
    const lastName = data.get('lastName') as string;
    const email = data.get('email') as string;
    const password = data.get('password') as string;
    const departmentId = data.get('departmentId') as string;
    const role = data.get('role') as 'user' | 'manager' | 'admin';

    if (!firstName || !lastName || !email || !password || !departmentId) {
        return { success: false, error: 'All fields are required.' };
    }
    
    if (users.some(user => user.id === email)) {
        return { success: false, error: 'User with this email already exists.' };
    }
    
    let newUserRole: 'user' | 'manager' | 'admin' = 'user';
    // Only admins can assign roles. Managers can only create users.
    if (currentUser.role === 'admin' && role) {
        newUserRole = role;
    }

    const randomAvatar = predefinedAvatars[Math.floor(Math.random() * predefinedAvatars.length)];

    const newUser: User & { password?: string } = {
        id: email,
        name: `${firstName} ${lastName}`,
        password,
        departmentId,
        avatar: randomAvatar,
        steps: { daily: 0, weekly: 0, total: 0, previousDaily: 0, previousWeekly: 0 },
        dailyGoal: 10000,
        role: newUserRole,
        mustChangePassword: true,
    };

    users.push(newUser);
    revalidatePath('/dashboard/admin');
    return { success: true };
}

export async function adminCreateDepartmentAction(prevState: unknown, data: FormData) {
    const { currentUser } = await getAuth();
    if (currentUser?.role !== 'admin') {
        return { success: false, error: 'Unauthorized action.' };
    }
    
    const name = data.get('name') as string;

    if (!name) {
        return { success: false, error: 'Department name is required.' };
    }
    
    if (departments.some(d => d.name.toLowerCase() === name.toLowerCase())) {
        return { success: false, error: 'A department with this name already exists.' };
    }

    const newDepartment: Department = {
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
    };

    departments.push(newDepartment);
    revalidatePath('/dashboard/admin');
    return { success: true };
}

export async function adminUpdateUserAction(prevState: unknown, data: FormData) {
    const { currentUser } = await getAuth();
    if (currentUser?.role !== 'admin') {
        return { success: false, error: 'Unauthorized action.' };
    }
    
    const userId = data.get('userId') as string;
    const departmentId = data.get('departmentId') as string;
    const role = data.get('role') as 'user' | 'manager' | 'admin';

    if (!userId || !departmentId || !role) {
        return { success: false, error: 'User, department, and role are required.' };
    }
    
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return { success: false, error: 'User not found.' };
    }
    
    // Prevent admin from demoting themselves if they are the only admin
    if (users[userIndex].id === currentUser.id && users[userIndex].role === 'admin' && role !== 'admin') {
        const adminCount = users.filter(u => u.role === 'admin').length;
        if (adminCount <= 1) {
            return { success: false, error: 'Cannot remove the last admin account.' };
        }
    }


    users[userIndex].departmentId = departmentId;
    users[userIndex].role = role;

    revalidatePath('/dashboard/admin');
    revalidatePath('/dashboard'); // for leaderboards
    return { success: true };
}


export async function deleteUserAction(userId: string) {
    const { currentUser: adminUser } = await getAuth();
    if (adminUser?.role !== 'admin') {
        return { success: false, error: 'Unauthorized action.' };
    }
    if (adminUser.id === userId) {
        return { success: false, error: "Admins cannot delete their own account." };
    }
    
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return { success: false, error: "User not found." };
    }

    users.splice(userIndex, 1);
    revalidatePath('/dashboard/admin');
    return { success: true };
}

export async function resetPasswordAction(userId: string) {
    const { currentUser: adminUser } = await getAuth();
    if (adminUser?.role !== 'admin') {
        return { success: false, error: 'Unauthorized action.' };
    }

    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return { success: false, error: 'User not found.' };
    }
    
    const newPassword = 'password123'; // Reset to a default password
    users[userIndex].password = newPassword;
    users[userIndex].mustChangePassword = true;

    console.log(`Password for user ${userId} has been reset to "${newPassword}"`);

    return { success: true, message: `Password reset successfully to "${newPassword}".` };
}

// Chat Actions
export async function getDepartmentMessagesAction(departmentId: string) {
    const { currentUser } = await getAuth();
    if (!currentUser || currentUser.departmentId !== departmentId) {
        return { success: false, error: 'Unauthorized' };
    }
    const departmentMessages = messages
        .filter(m => m.departmentId === departmentId)
        .sort((a, b) => a.timestamp - b.timestamp);
    return { success: true, data: departmentMessages };
}

export async function sendDepartmentMessageAction(prevState: unknown, formData: FormData) {
    const content = formData.get('content') as string;
    const departmentId = formData.get('departmentId') as string;
    
    const { currentUser } = await getAuth();
    if (!currentUser) {
        return { success: false, error: 'You must be logged in to send a message.' };
    }
    if (!content.trim() || !departmentId) {
        return { success: false, error: 'Message content cannot be empty.' };
    }
    if (currentUser.departmentId !== departmentId) {
        return { success: false, error: 'You can only send messages to your own department.' };
    }

    const newMessage: Message = {
        id: `msg-${Date.now()}-${Math.random()}`,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        departmentId: departmentId,
        content: content.trim(),
        timestamp: Date.now(),
    };

    messages.push(newMessage);
    revalidatePath('/dashboard'); // To update the chat for other users in a real-time-ish way
    return { success: true, data: newMessage };
}

// Support Chat Actions
export async function getSupportThreadAction() {
    const { currentUser } = await getAuth();
    if (!currentUser) {
      return { success: false, error: 'Unauthorized' };
    }
  
    let thread = supportThreads.find((t) => t.userId === currentUser.id);
  
    if (!thread) {
      // Create a new thread if one doesn't exist
      thread = {
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        messages: [],
        hasUnreadAdminMessages: false,
        hasUnreadUserMessages: false,
      };
      supportThreads.push(thread);
    }
  
    // When user checks their thread, mark admin messages as read
    thread.hasUnreadAdminMessages = false;
  
    return { success: true, data: thread };
}

export async function sendSupportMessageAction(prevState: unknown, formData: FormData) {
    const content = formData.get('content') as string;
    const { currentUser } = await getAuth();
  
    if (!currentUser) {
      return { success: false, error: 'You must be logged in to send a message.' };
    }
    if (!content.trim()) {
      return { success: false, error: 'Message content cannot be empty.' };
    }
  
    let thread = supportThreads.find((t) => t.userId === currentUser.id);
    if (!thread) {
      // This should ideally not happen if getSupportThreadAction is called first,
      // but as a fallback, create a new thread.
      thread = {
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        messages: [],
        hasUnreadAdminMessages: false,
        hasUnreadUserMessages: false,
      };
      supportThreads.push(thread);
    }
  
    const isFirstMessageFromUser = thread.messages.every(m => m.senderId === 'admin');

    const newMessage: SupportMessage = {
      id: `smsg-${Date.now()}-${Math.random()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: content.trim(),
      timestamp: Date.now(),
    };
  
    thread.messages.push(newMessage);
    thread.hasUnreadUserMessages = true;

    // Add automated reply on first message
    if (isFirstMessageFromUser) {
        const autoReply: SupportMessage = {
            id: `smsg-${Date.now()}-admin-reply`,
            senderId: 'admin',
            senderName: 'Admin',
            content: "Thanks for reaching out! An administrator will contact you shortly.",
            timestamp: Date.now() + 1000, // ensure it appears after the user's message
        };
        thread.messages.push(autoReply);
    }
  
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/admin');
    return { success: true, data: newMessage };
}

// Admin Support Actions
export async function getAllSupportThreadsAction() {
    const { currentUser } = await getAuth();
    if (currentUser?.role !== 'admin' && currentUser?.role !== 'manager') {
      return { success: false, error: 'Unauthorized' };
    }
    // Return a copy sorted by which has unread messages first, then by most recent message
    const sortedThreads = [...supportThreads].sort((a, b) => {
        if (a.hasUnreadUserMessages && !b.hasUnreadUserMessages) return -1;
        if (!a.hasUnreadUserMessages && b.hasUnreadUserMessages) return 1;
        const lastMessageA = a.messages[a.messages.length - 1]?.timestamp || 0;
        const lastMessageB = b.messages[b.messages.length - 1]?.timestamp || 0;
        return lastMessageB - lastMessageA;
    });

    return { success: true, data: sortedThreads };
}

export async function sendAdminSupportReplyAction(prevState: unknown, formData: FormData) {
    const content = formData.get('content') as string;
    const userId = formData.get('userId') as string;
  
    const { currentUser } = await getAuth();
    if (currentUser?.role !== 'admin' && currentUser?.role !== 'manager') {
      return { success: false, error: 'Unauthorized action.' };
    }
    if (!content.trim() || !userId) {
      return { success: false, error: 'User ID and message content are required.' };
    }
  
    const thread = supportThreads.find((t) => t.userId === userId);
    if (!thread) {
      return { success: false, error: 'Support thread not found.' };
    }
  
    const newMessage: SupportMessage = {
      id: `smsg-${Date.now()}-admin-reply`,
      senderId: 'admin',
      senderName: 'Admin',
      content: content.trim(),
      timestamp: Date.now(),
    };
  
    thread.messages.push(newMessage);
    thread.hasUnreadUserMessages = false; // Admin has replied, so mark as read on their end
    thread.hasUnreadAdminMessages = true; // User now has a new message to read
  
    revalidatePath('/dashboard/admin');
    revalidatePath('/dashboard');
    return { success: true, data: newMessage };
}

// Dev View Switch Actions
export async function switchToUserViewAction() {
    cookies().set('dev_user_view', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    });
    revalidatePath('/');
    redirect('/dashboard');
}

export async function switchToAdminViewAction() {
    cookies().delete('dev_user_view');
    revalidatePath('/');
    redirect('/dashboard');
}
