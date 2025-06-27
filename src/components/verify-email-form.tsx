'use client';

import { useFormStatus } from 'react-dom';
import { verifyEmailAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useActionState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Terminal } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Verifying...' : 'Verify Email'}
    </Button>
  );
}

export function VerifyEmailForm() {
  const [state, formAction] = useActionState(verifyEmailAction, null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const { toast } = useToast();

  useEffect(() => {
    if (state?.success) {
      toast({
        title: "Email Verified",
        description: "Your account has been created. Please log in.",
      });
      router.push('/login');
    }
  }, [state, router, toast]);

  if (!email) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Error</CardTitle>
                <CardDescription>No email address was provided for verification.</CardDescription>
            </CardHeader>
        </Card>
    )
  }

  return (
    <Card>
      <form action={formAction}>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Verify your email</CardTitle>
          <CardDescription>
            We've sent a 6-digit code to <span className="font-semibold text-foreground">{email}</span>. Please enter it below.
            <br/>(Hint: for this demo, the code is always 123456)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input id="email" name="email" type="hidden" value={email} />
          <div className="space-y-2">
            <Label htmlFor="code">Verification Code</Label>
            <Input 
                id="code" 
                name="code"
                type="text"
                required 
                maxLength={6}
                pattern="\d{6}"
                placeholder="123456"
            />
          </div>
          {state && !state.success && state.error && (
             <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                    {state.error}
                </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
