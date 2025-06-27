import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // This route is called when a user has an invalid auth cookie.
  // We clear the cookies and redirect to the login page.
  const response = NextResponse.redirect(new URL('/login', request.url));
  response.cookies.delete('auth_token');
  response.cookies.delete('dev_user_view');
  return response;
}
