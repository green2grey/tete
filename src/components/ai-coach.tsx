"use client";

import { useState, useEffect } from 'react';
import type { User, Department } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BrainCircuit, Dumbbell } from "lucide-react";
import { getMotivationAction } from '@/app/actions';
import { Skeleton } from './ui/skeleton';

interface AICoachProps {
  user: User & {
    department: Department;
    departmentRank: number;
    departmentTotalSteps: number;
    challengeTargetSteps: number;
  };
}

export function AICoach({ user }: AICoachProps) {
  const [motivation, setMotivation] = useState<{ message: string; fitnessTip: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMotivation = async () => {
      if (!user) return;
      setIsLoading(true);
      const res = await getMotivationAction({
        userName: user.name,
        userStepCount: user.steps.daily,
        departmentName: user.department.name,
        departmentRank: user.departmentRank,
        departmentTotalSteps: user.departmentTotalSteps,
        challengeTargetSteps: user.challengeTargetSteps,
      });
      if (res.success && res.data) {
        setMotivation(res.data);
      }
      setIsLoading(false);
    };

    fetchMotivation();
  }, [user]);

  return (
    <Card className="bg-secondary/50 flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <BrainCircuit className="text-primary" /> AI Coach
        </CardTitle>
        <CardDescription>Personalized motivation to keep you going.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col justify-center p-6">
        {isLoading ? (
          <div className="space-y-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex items-start gap-2 pt-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <div className="w-full space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
          </div>
        ) : motivation ? (
          <>
            <div>
              <p className="font-semibold text-foreground/90">Message for you:</p>
              <p className="text-muted-foreground font-medium italic">"{motivation.message}"</p>
            </div>
            <div className="flex items-start gap-3 pt-2">
              <Dumbbell className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
              <div>
                <p className="font-semibold text-foreground/90">Fitness Tip:</p>
                <p className="text-muted-foreground">{motivation.fitnessTip}</p>
              </div>
            </div>
          </>
        ) : (
          <p className="text-muted-foreground text-center">Could not load motivation at this time.</p>
        )}
      </CardContent>
    </Card>
  );
}
