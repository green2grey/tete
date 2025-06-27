"use client";

import type { User, Department } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Users, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type TimeFrame = 'daily' | 'weekly' | 'total';

interface LeaderboardsProps {
  departments: (Department & { members: User[] })[];
  currentUser: User;
}

const DepartmentLeaderboard = ({ departments, timeFrame }: { departments: LeaderboardsProps['departments'], timeFrame: TimeFrame }) => {
  const departmentsWithSteps = departments.map(dept => {
    const totalSteps = dept.members.reduce((sum, member) => sum + (member.steps[timeFrame] || 0), 0);
    return { ...dept, totalSteps };
  });

  departmentsWithSteps.sort((a, b) => b.totalSteps - a.totalSteps);

  return (
    <div className="space-y-3">
      {departmentsWithSteps.map((dept, index) => (
        <Card key={dept.id} className="p-4 flex items-center gap-4 transition-all hover:border-primary/50 hover:shadow-md">
          <span className="text-xl font-bold font-headline w-8 text-center text-primary">{index + 1}</span>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <p className="font-semibold font-headline text-lg">{dept.name}</p>
              <p className="font-bold text-primary">{dept.totalSteps.toLocaleString()} steps</p>
            </div>
            <p className="text-sm text-muted-foreground">{dept.members.length} members</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

const UserLeaderboard = ({ department, currentUser, timeFrame }: { department?: (Department & { members: User[] }), currentUser: User, timeFrame: TimeFrame }) => {
  if (!department) {
    return <p>Your department could not be found.</p>;
  }
  const members = [...department.members]; // Create a copy to avoid mutating prop
  members.sort((a, b) => (b.steps[timeFrame] || 0) - (a.steps[timeFrame] || 0));

  return (
    <div className="space-y-3">
      {members.map((member, index) => (
        <Card key={member.id} className={`p-3 flex items-center gap-4 transition-all hover:shadow-md ${member.id === currentUser.id ? 'border-primary' : ''}`}>
          <span className="text-lg font-bold w-6 text-center">{index + 1}</span>
          <Avatar>
            <AvatarImage src={member.avatar} alt={member.name} data-ai-hint="profile person" />
            <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold">{member.name}</p>
            <p className="text-sm text-muted-foreground">{(member.steps[timeFrame] || 0).toLocaleString()} steps</p>
          </div>
          {index < 3 && <Award className={`w-6 h-6 ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-slate-400' : 'text-amber-700'}`} />}
        </Card>
      ))}
    </div>
  );
}

const LeaderboardTabs = ({ children }: { children: (timeFrame: TimeFrame) => React.ReactNode }) => {
  return (
      <Tabs defaultValue="total" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="total">Overall</TabsTrigger>
          </TabsList>
          <TabsContent value="daily" className="mt-4">
              {children('daily')}
          </TabsContent>
          <TabsContent value="weekly" className="mt-4">
              {children('weekly')}
          </TabsContent>
          <TabsContent value="total" className="mt-4">
              {children('total')}
          </TabsContent>
      </Tabs>
  );
};


export function Leaderboards({ departments, currentUser }: LeaderboardsProps) {
  const currentUserDept = departments.find(d => d.id === currentUser.departmentId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2"><Award className="text-primary"/> Leaderboards</CardTitle>
        <CardDescription>See how you and your department stack up against the competition.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="department">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="department"><Users className="mr-2 h-4 w-4" />Departments</TabsTrigger>
            <TabsTrigger value="user"><UserIcon className="mr-2 h-4 w-4" />My Department</TabsTrigger>
          </TabsList>
          <TabsContent value="department">
            <LeaderboardTabs>
                {(timeFrame) => <DepartmentLeaderboard departments={departments} timeFrame={timeFrame} />}
            </LeaderboardTabs>
          </TabsContent>
          <TabsContent value="user">
            <LeaderboardTabs>
                {(timeFrame) => <UserLeaderboard department={currentUserDept} currentUser={currentUser} timeFrame={timeFrame} />}
            </LeaderboardTabs>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
