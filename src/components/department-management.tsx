'use client';

import { useState, useActionState, useRef, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { adminCreateDepartmentAction } from '@/app/actions';
import type { Department } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Terminal, Loader2 } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? 'Creating...' : 'Create Department'}
    </Button>
  );
}

export function DepartmentManagement({
  initialDepartments,
}: {
  initialDepartments: Department[];
}) {
  const [state, formAction] = useActionState(adminCreateDepartmentAction, null);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      toast({
        title: 'Department Created',
        description: 'The new department has been added.',
      });
      formRef.current?.reset();
    }
  }, [state, toast]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Existing Departments</CardTitle>
          <CardDescription>
            List of all departments participating in the challenge.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {initialDepartments.map((d) => (
              <li
                key={d.id}
                className="p-3 bg-muted rounded-md text-sm font-medium"
              >
                {d.name}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Create New Department</CardTitle>
          <CardDescription>
            Add a new department to the step challenge.
          </CardDescription>
        </CardHeader>
        <form action={formAction} ref={formRef}>
          <CardContent className="space-y-2">
            <Label htmlFor="name">Department Name</Label>
            <Input id="name" name="name" required />
            {state && !state.success && state.error && (
              <Alert variant="destructive" className="mt-4">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
