import { getAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { DevSwitchBanner } from '@/components/dev-switch-banner';
import { DashboardClientLayout } from '@/components/dashboard-client-layout';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, originalUser } = await getAuth();

  if (!currentUser) {
    // If getAuth returns no user, but middleware let us through,
    // it means the auth cookie is invalid (e.g., user was deleted).
    // We redirect to a dedicated logout route to clear the bad cookie
    // and prevent a redirect loop.
    redirect('/logout');
  }

  return (
    <div className="flex flex-col min-h-screen">
      {originalUser && <DevSwitchBanner adminUser={originalUser} />}
      <DashboardClientLayout user={currentUser} originalUser={originalUser}>
        {children}
      </DashboardClientLayout>
    </div>
  );
}
