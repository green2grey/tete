"use client";

import type { User, Department } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flame, TrendingUp, TrendingDown, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DepartmentRivalryProps {
  user: User;
  department: Department & { totalSteps: number, weeklySteps: number, previousWeeklySteps: number };
  nextDepartment: (Department & { totalSteps: number }) | null;
}

function TrendIndicator({ value, unit }: { value: number; unit: string }) {
  const isUp = value >= 0;
  return (
    <div className={cn("flex items-center text-sm font-semibold", isUp ? 'text-green-600' : 'text-red-600')}>
      {isUp ? <TrendingUp className="mr-1 h-4 w-4" /> : <TrendingDown className="mr-1 h-4 w-4" />}
      <span>{value >= 0 && '+'}{value.toLocaleString()} {unit}</span>
    </div>
  );
}

export function DepartmentRivalry({ user, department, nextDepartment }: DepartmentRivalryProps) {
  const userDailyTrend = user.steps.daily - user.steps.previousDaily;
  const deptWeeklyTrend = department.weeklySteps - department.previousWeeklySteps;
  
  const stepsToNextDept = nextDepartment ? nextDepartment.totalSteps - department.totalSteps + 1 : 0;
  
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Trophy className="text-primary" /> Department Rivalry
        </CardTitle>
        <CardDescription>See how you and your team are trending.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 flex-1 flex flex-col justify-center">
        <div className="space-y-2">
          <div className='flex justify-between items-center'>
            <p className="text-sm font-medium">Your Daily Trend</p>
            <TrendIndicator value={userDailyTrend} unit="steps vs yesterday" />
          </div>
          <div className='flex justify-between items-center'>
            <p className="text-sm font-medium">{department.name} Weekly Trend</p>
            <TrendIndicator value={deptWeeklyTrend} unit="steps vs last week" />
          </div>
        </div>

        <div className="space-y-3 p-4 rounded-lg bg-muted/50">
          {nextDepartment ? (
            <>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-base">Next up: {nextDepartment.name}</p>
                <Flame className="w-5 h-5 text-destructive" />
              </div>
              <p className="text-sm text-muted-foreground">
                You're just <span className="font-bold text-primary">{stepsToNextDept.toLocaleString()}</span> steps away from overtaking them!
              </p>
              <Progress value={Math.max(0, 100 - (stepsToNextDept / (nextDepartment.totalSteps - department.totalSteps + stepsToNextDept || 1)) * 100)} className="h-2" />
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-base">You're Number 1!</p>
                <Trophy className="w-5 h-5 text-yellow-500" />
              </div>
              <p className="text-sm text-muted-foreground">
                Your department is leading the challenge. Keep up the great work!
              </p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
