'use client';

import type { Department, User } from '@/lib/data';
import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { adminUpdateUserAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Terminal, Loader2, UserCog } from 'lucide-react';
import { DropdownMenuItem } from './ui/dropdown-menu';

type UserWithDept = User & { departmentName: string };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? 'Saving...' : 'Save Changes'}
    </Button>
  );
}

export function EditUserDialog({
  user,
  departments,
}: {
  user: UserWithDept;
  departments: Department[];
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(
    adminUpdateUserAction,
    null
  );
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.success) {
      toast({
        title: 'User Updated',
        description: `${user.name}'s profile has been updated.`,
      });
      setOpen(false);
    }
     if (state?.error) {
      toast({
        variant: 'destructive',
        title: 'Error updating user',
        description: state.error,
      });
    }
  }, [state, toast, user.name]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="cursor-pointer"
        >
          <UserCog className="mr-2 h-4 w-4" />
          <span>Edit User</span>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit {user.name}</DialogTitle>
          <DialogDescription>
            Change the user's assigned department or role.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} ref={formRef} className="space-y-4 py-2">
          <input type="hidden" name="userId" value={user.id} />
          <div className="space-y-2">
            <Label htmlFor="departmentId">Department</Label>
            <Select name="departmentId" defaultValue={user.departmentId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select name="role" defaultValue={user.role} required>
                <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
            </Select>
          </div>
          {state && !state.success && state.error && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
          <DialogFooter className="pt-4">
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
