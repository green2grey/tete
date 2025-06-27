'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { updatePasswordAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Terminal, Loader2 } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? 'Updating Password...' : 'Update Password'}
    </Button>
  );
}

export function ForcePasswordChangeDialog() {
  const [state, formAction] = useActionState(updatePasswordAction, null);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.success) {
      toast({
        title: 'Password Updated',
        description: 'Your password has been changed successfully.',
      });
      // The revalidation in the action will cause a page reload,
      // and this component will no longer be rendered.
    }
  }, [state, toast]);

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">
              Update Your Password
            </DialogTitle>
            <DialogDescription>
              For security, you must change your temporary password before
              proceeding.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-6">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password (min. 8 characters)</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                minLength={8}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
              />
            </div>
            {state && !state.success && state.error && (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
