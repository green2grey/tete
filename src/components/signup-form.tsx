'use client';

import { useFormStatus } from 'react-dom';
import { signupAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Department } from '@/lib/data';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useActionState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Terminal } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Creating Account...' : 'Create Account'}
    </Button>
  );
}

interface SignUpFormProps {
  departments: Department[];
}

export function SignUpForm({ departments }: SignUpFormProps) {
  const [state, formAction] = useActionState(signupAction, null);
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (state?.success) {
      toast({
        title: "Account Pending Verification",
        description: "A verification code has been sent to your email.",
      });
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    }
  }, [state, router, toast, email]);

  return (
    <Card>
      <form action={formAction}>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Create an account</CardTitle>
          <CardDescription>Enter your details to get started. Registration is only open to DHS employees.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" type="text" placeholder="Alex Williams" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="name@dhs.lacounty.gov" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="departmentId">Department</Label>
            <Select name="departmentId" required>
              <SelectTrigger>
                <SelectValue placeholder="Select your department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map(dept => (
                  <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
        <CardFooter className="flex flex-col gap-4">
          <SubmitButton />
          <div className="text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
