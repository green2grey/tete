export interface User {
  id: string;
  name: string;
  avatar: string;
  steps: {
    daily: number;
    weekly: number;
    total: number;
    previousDaily: number;
    previousWeekly: number;
  };
  dailyGoal: number;
  departmentId: string;
  role?: 'admin' | 'manager' | 'user';
  mustChangePassword?: boolean;
  password?: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  departmentId: string;
  content: string;
  timestamp: number;
}

export interface SupportMessage {
    id: string;
    senderId: 'admin' | string; // user's id or 'admin'
    senderName: string; // 'Admin' or user's name
    content: string;
    timestamp: number;
}
  
export interface SupportThread {
    userId: string;
    userName: string;
    userAvatar: string;
    messages: SupportMessage[];
    hasUnreadAdminMessages: boolean; // For user notification
    hasUnreadUserMessages: boolean; // For admin notification
}

// This is a workaround to persist our in-memory "database" across Next.js hot reloads in development.
// In a real app, you would use a proper database like Firestore or PostgreSQL.
declare global {
  var __users: (User & { password?: string })[] | undefined;
  var __departments: Department[] | undefined;
  var __messages: Message[] | undefined;
  var __supportThreads: SupportThread[] | undefined;
  var __pendingVerifications: Map<string, { code: string; user: Omit<User, 'id'> & { password?: string }; timestamp: number }> | undefined;
}


// In a real app, these would be hosted images. For this demo, we use placeholders.
export const predefinedAvatars: string[] = [
    'https://placehold.co/100x100/F87171/FFFFFF.png',
    'https://placehold.co/100x100/FBBF24/FFFFFF.png',
    'https://placehold.co/100x100/34D399/FFFFFF.png',
    'https://placehold.co/100x100/60A5FA/FFFFFF.png',
    'https://placehold.co/100x100/A78BFA/FFFFFF.png',
    'https://placehold.co/100x100/F472B6/FFFFFF.png',
    'https://placehold.co/100x100/4FD1C5/FFFFFF.png',
    'https://placehold.co/100x100/9CA3AF/FFFFFF.png',
    'https://placehold.co/100x100/fd9b52/FFFFFF.png',
    'https://placehold.co/100x100/c084fc/FFFFFF.png',
    'https://placehold.co/100x100/2dd4bf/FFFFFF.png',
    'https://placehold.co/100x100/fb7185/FFFFFF.png',
];

export const ADMIN_USER_ID = 'babken.egoian@dhs.lacounty.gov';
export const DEV_TEST_USER_ID = 'brianna.smith@dhs.lacounty.gov';
export const CHALLENGE_TARGET_STEPS = 250000;


// Initialize data or use existing global data to avoid data loss during hot reloads
if (!global.__users) {
  global.__users = [
    // Engineering - Babken is an Admin
    { id: 'babken.egoian@dhs.lacounty.gov', name: 'Babken Egoian', password: 'password123', avatar: predefinedAvatars[0], steps: { daily: 8543, weekly: 45210, total: 85430, previousDaily: 7500, previousWeekly: 42000 }, dailyGoal: 10000, departmentId: 'eng', role: 'admin' },
    { id: 'brianna.smith@dhs.lacounty.gov', name: 'Brianna Smith', password: 'password123', avatar: predefinedAvatars[1], steps: { daily: 12345, weekly: 61234, total: 123450, previousDaily: 11500, previousWeekly: 59000 }, dailyGoal: 8000, departmentId: 'eng', role: 'user' },
    { id: 'charlie.brown@dhs.lacounty.gov', name: 'Charlie Brown', password: 'password123', avatar: predefinedAvatars[2], steps: { daily: 7654, weekly: 38901, total: 76540, previousDaily: 8000, previousWeekly: 41000 }, dailyGoal: 9000, departmentId: 'eng', role: 'user' },
  
    // Marketing - Diana is a Manager
    { id: 'diana.prince@dhs.lacounty.gov', name: 'Diana Prince', password: 'password123', avatar: predefinedAvatars[3], steps: { daily: 15234, weekly: 78901, total: 152340, previousDaily: 14000, previousWeekly: 75000 }, dailyGoal: 12000, departmentId: 'mkt', role: 'manager' },
    { id: 'ethan.hunt@dhs.lacounty.gov', name: 'Ethan Hunt', password: 'password123', avatar: predefinedAvatars[4], steps: { daily: 6789, weekly: 34567, total: 67890, previousDaily: 7100, previousWeekly: 35000 }, dailyGoal: 7000, departmentId: 'mkt', role: 'user' },
    { id: 'fiona.glenanne@dhs.lacounty.gov', name: 'Fiona Glenanne', password: 'password123', avatar: predefinedAvatars[5], steps: { daily: 9876, weekly: 50123, total: 98760, previousDaily: 9500, previousWeekly: 48000 }, dailyGoal: 10000, departmentId: 'mkt', role: 'user' },
  
    // Sales
    { id: 'george.costanza@dhs.lacounty.gov', name: 'George Costanza', password: 'password123', avatar: predefinedAvatars[6], steps: { daily: 18001, weekly: 91234, total: 180010, previousDaily: 17500, previousWeekly: 89000 }, dailyGoal: 15000, departmentId: 'sales', role: 'user' },
    { id: 'hannah.montana@dhs.lacounty.gov', name: 'Hannah Montana', password: 'password123', avatar: predefinedAvatars[7], steps: { daily: 2100, weekly: 10500, total: 21000, previousDaily: 2500, previousWeekly: 12000 }, dailyGoal: 5000, departmentId: 'sales', role: 'user' },
  
    // HR
    { id: 'ian.malcolm@dhs.lacounty.gov', name: 'Ian Malcolm', password: 'password123', avatar: predefinedAvatars[8], steps: { daily: 11111, weekly: 55555, total: 111110, previousDaily: 10000, previousWeekly: 54000 }, dailyGoal: 11000, departmentId: 'hr', role: 'user' },
    { id: 'jane.doe@dhs.lacounty.gov', name: 'Jane Doe', password: 'password123', avatar: predefinedAvatars[9], steps: { daily: 8888, weekly: 44444, total: 88880, previousDaily: 8500, previousWeekly: 43000 }, dailyGoal: 8000, departmentId: 'hr', role: 'user' },
  ];
}
if (!global.__departments) {
  global.__departments = [
    { id: 'eng', name: 'Engineering' },
    { id: 'mkt', name: 'Marketing' },
    { id: 'sales', name: 'Sales' },
    { id: 'hr', name: 'Human Resources' },
  ];
}
if (!global.__messages) {
  global.__messages = [];
}
if (!global.__supportThreads) {
  global.__supportThreads = [];
}
if (!global.__pendingVerifications) {
  global.__pendingVerifications = new Map();
}

export let users = global.__users;
export let departments = global.__departments;
export let messages = global.__messages;
export let supportThreads = global.__supportThreads;
export let pendingVerifications = global.__pendingVerifications;
