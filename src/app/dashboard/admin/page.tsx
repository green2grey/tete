import { AdminDashboard } from '@/components/admin-dashboard';
import { getAuth } from '@/lib/auth';
import { departments, users } from '@/lib/data';
import { redirect } from 'next/navigation';
import { getAllSupportThreadsAction } from '@/app/actions';

export default async function AdminPage() {
  const { currentUser } = await getAuth();

  if (currentUser?.role !== 'admin' && currentUser?.role !== 'manager') {
    redirect('/dashboard');
  }

  // Combine users with department names for easy display
  const allUsersWithDept = users.map((u) => ({
    ...u,
    departmentName:
      departments.find((d) => d.id === u.departmentId)?.name || 'N/A',
  }));

  const supportThreadsResult = await getAllSupportThreadsAction();
  const supportThreads = supportThreadsResult.success ? supportThreadsResult.data : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage users and application data.
        </p>
      </div>
      <AdminDashboard 
        users={allUsersWithDept} 
        supportThreads={supportThreads || []} 
        adminUser={currentUser}
        departments={departments}
      />
    </div>
  );
}
