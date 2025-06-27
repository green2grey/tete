"use client";

import type { User } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Award, Target, Footprints, Loader2 } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useActionState, useEffect, useState } from 'react';
import { updateStepsAction } from '@/app/actions';
import { useFormStatus } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Terminal } from 'lucide-react';

interface MyStatsProps {
  user: User;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : <Footprints />}
      {pending ? 'Saving...' : 'Update Steps'}
    </Button>
  );
}

function LogStepsDialog({ user }: { user: User }) {
    const [open, setOpen] = useState(false);
    const [state, formAction] = useActionState(updateStepsAction, null);
    const { toast } = useToast();

    useEffect(() => {
        if (state?.success) {
            toast({
                title: "Steps Updated!",
                description: `Your new daily step count is ${state.newDailySteps?.toLocaleString()}.`,
            });
            setOpen(false);
        }
    }, [state, toast]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Footprints className="mr-2 h-4 w-4" />
                    Log Today's Steps
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <form action={formAction}>
                    <DialogHeader>
                        <DialogTitle>Log Today's Steps</DialogTitle>
                        <DialogDescription>
                            Enter your total step count for today from your fitness tracker.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-6">
                        <Label htmlFor="steps" className="sr-only">Daily Steps</Label>
                        <Input 
                            id="steps" 
                            name="steps" 
                            type="number" 
                            placeholder="e.g., 8500" 
                            defaultValue={user.steps.daily}
                            required 
                            min="0"
                        />
                         {state && !state.success && state.error && (
                            <Alert variant="destructive" className="mt-4">
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
    )
}

export function MyStats({ user }: MyStatsProps) {
  const progress = Math.min((user.steps.daily / user.dailyGoal) * 100, 100);
  const goalMet = user.steps.daily >= user.dailyGoal;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Target className="text-primary" /> Your Progress
        </CardTitle>
        <CardDescription>Your daily step challenge summary.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col justify-center">
        <div className="text-center">
          <p className="text-5xl font-bold font-headline text-primary">{user.steps.daily.toLocaleString()}</p>
          <p className="text-muted-foreground">steps today</p>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <p className="text-sm font-medium">Daily Goal</p>
            <p className="text-sm text-muted-foreground">{user.dailyGoal.toLocaleString()} steps</p>
          </div>
          <Progress value={progress} />
        </div>
        {goalMet ? (
          <div className="flex justify-center pt-2">
            <Badge variant="secondary" className="text-base py-1 px-3 border-green-500/50 text-green-700 bg-green-500/10">
              <Award className="mr-2 h-4 w-4" /> Goal Achieved!
            </Badge>
          </div>
        ) : (
            <div className="flex justify-center pt-2">
                <LogStepsDialog user={user} />
            </div>
        )}
      </CardContent>
    </Card>
  );
}
