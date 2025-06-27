'use client';

import type { User, SupportThread, Department } from '@/lib/data';
import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserManagement } from '@/components/user-management';
import { SupportTickets } from '@/components/support-tickets';
import { DepartmentManagement } from './department-management';
import { CreateUserDialog } from './create-user-dialog';
import { cn } from '@/lib/utils';

type UserWithDept = User & { departmentName: string };

interface AdminDashboardProps {
  users: UserWithDept[];
  supportThreads: SupportThread[];
  adminUser: User;
  departments: Department[];
}

export function AdminDashboard({
  users: initialUsers,
  supportThreads: initialThreads,
  adminUser,
  departments: initialDepartments,
}: AdminDashboardProps) {
  const [users, setUsers] = useState(initialUsers);
  const [departments, setDepartments] = useState(initialDepartments);

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);
  
  useEffect(() => {
    setDepartments(initialDepartments);
  }, [initialDepartments]);

  const onUserDeleted = (userId: string) => {
    setUsers((currentUsers) => currentUsers.filter((u) => u.id !== userId));
  };
  
  return (
    <Tabs defaultValue="users" className="w-full">
      <TabsList className={cn(
        "grid w-full",
        adminUser.role === 'admin' ? "grid-cols-3" : "grid-cols-2"
      )}>
        <TabsTrigger value="users">User Management</TabsTrigger>
        <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
        {adminUser.role === 'admin' && (
            <TabsTrigger value="departments">Departments</TabsTrigger>
        )}
      </TabsList>
      <TabsContent value="users" className="mt-4">
        <div className="flex justify-end mb-4">
            <CreateUserDialog departments={departments} adminUser={adminUser} />
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Total Steps</TableHead>
                <TableHead className="w-[80px]">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <UserManagement users={users} onUserDeleted={onUserDeleted} adminUser={adminUser} departments={departments} />
            </TableBody>
          </Table>
        </div>
      </TabsContent>
      <TabsContent value="tickets" className="mt-4">
        <SupportTickets initialThreads={initialThreads} />
      </TabsContent>
       {adminUser.role === 'admin' && (
        <TabsContent value="departments" className="mt-4">
            <DepartmentManagement initialDepartments={departments} />
        </TabsContent>
       )}
    </Tabs>
  );
}
