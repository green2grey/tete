
'use client';

import { deleteUserAction, resetPasswordAction } from '@/app/actions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableCell, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import type { User, Department } from '@/lib/data';
import { KeyRound, MoreHorizontal, Trash2 } from 'lucide-react';
import { EditUserDialog } from './edit-user-dialog';

type UserWithDept = User & { departmentName: string };

interface UserManagementProps {
  users: UserWithDept[];
  onUserDeleted: (userId: string) => void;
  adminUser: User;
  departments: Department[];
}

export function UserManagement({ users, onUserDeleted, adminUser, departments }: UserManagementProps) {
  const { toast } = useToast();

  const handleResetPassword = async (userId: string) => {
    const result = await resetPasswordAction(userId);
    if (result.success) {
      toast({
        title: 'Password Reset',
        description: `User's password has been reset. New password: ${
          result.message?.split('"')[1]
        }`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const result = await deleteUserAction(userId);
    if (result.success) {
      onUserDeleted(userId);
      toast({
        title: 'User Deleted',
        description: 'The user has been successfully deleted.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
  };

  return (
    <>
      {users.map((user) => (
        <TableRow key={user.id}>
          <TableCell className="font-medium">{user.name}</TableCell>
          <TableCell>{user.id}</TableCell>
          <TableCell>{user.departmentName}</TableCell>
          <TableCell className="capitalize">{user.role}</TableCell>
          <TableCell className="text-right">
            {user.steps.total.toLocaleString()}
          </TableCell>
          <TableCell>
            {user.id !== adminUser.id && adminUser.role === 'admin' && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <EditUserDialog user={user} departments={departments} />
                  <DropdownMenuSeparator />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="cursor-pointer"
                      >
                        <KeyRound className="mr-2 h-4 w-4" />
                        <span>Reset Password</span>
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will reset the user's password to a default
                          value and require them to change it on next login. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleResetPassword(user.id)}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  {user.role !== 'admin' && (
                    <>
                      <DropdownMenuSeparator />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="cursor-pointer text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete User</span>
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the user's account and remove
                              their data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive hover:bg-destructive/90"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
