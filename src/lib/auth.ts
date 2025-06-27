// @/lib/auth.ts
'use server';

import { cookies } from 'next/headers'
import { users, DEV_TEST_USER_ID, ADMIN_USER_ID } from './data'
import type { User } from './data'
import { unstable_noStore as noStore } from 'next/cache';

export async function getAuth(): Promise<{
  currentUser: (User & { password?: string }) | null;
  originalUser: (User & { password?: string }) | null;
}> {
  noStore();
  const userId = cookies().get('auth_token')?.value;
  const isDevUserView = cookies().get('dev_user_view')?.value === 'true';

  if (!userId) {
    return { currentUser: null, originalUser: null }
  }

  const loggedInUser = users.find(u => u.id === userId)

  if (!loggedInUser) {
    // User ID from cookie doesn't exist in our data.
    // This function cannot modify cookies, as it's called during render.
    // The calling component (e.g., a layout or page) must handle
    // redirecting the user to log out.
    return { currentUser: null, originalUser: null }
  }

  // Check for dev user view switch. Only the admin can use this.
  if (loggedInUser.id === ADMIN_USER_ID && isDevUserView) {
    const testUser = users.find(u => u.id === DEV_TEST_USER_ID);
    if (testUser) {
      // Admin is viewing as the test user. Return test user as current, admin as original.
      return { currentUser: testUser, originalUser: loggedInUser };
    }
  }

  // Default case: not in dev view, or not the admin.
  return { currentUser: loggedInUser, originalUser: null };
}
