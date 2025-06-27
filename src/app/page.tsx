import { redirect } from 'next/navigation';

export default function Home() {
  // The middleware will handle redirection based on auth status.
  // This just initiates the navigation.
  redirect('/dashboard');
}
