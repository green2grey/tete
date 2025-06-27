import { MyStats } from '@/components/my-stats';
import { Leaderboards } from '@/components/leaderboards';
import { AICoach } from '@/components/ai-coach';
import { DepartmentRivalry } from '@/components/department-rivalry';
import { 
  departments as initialDepts, 
  users as initialUsers,
  CHALLENGE_TARGET_STEPS 
} from '@/lib/data';
import { getAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';


export default async function DashboardPage() {
  const { currentUser } = await getAuth();

  if (!currentUser) {
    redirect('/login');
  }
  
  const departmentsWithMembers = initialDepts.map(dept => {
    const members = initialUsers.filter(u => u.departmentId === dept.id);
    const totalSteps = members.reduce((sum, member) => sum + member.steps.total, 0);
    const weeklySteps = members.reduce((sum, member) => sum + member.steps.weekly, 0);
    const previousWeeklySteps = members.reduce((sum, member) => sum + member.steps.previousWeekly, 0);
    return { ...dept, totalSteps, weeklySteps, previousWeeklySteps, members };
  });

  departmentsWithMembers.sort((a, b) => b.totalSteps - a.totalSteps);

  const currentUserDeptIndex = departmentsWithMembers.findIndex(d => d.id === currentUser.departmentId);
  const currentUserDept = departmentsWithMembers[currentUserDeptIndex];
  
  const nextDepartment = currentUserDeptIndex > 0 ? departmentsWithMembers[currentUserDeptIndex - 1] : null;

  const currentUserWithDept = {
    ...currentUser,
    department: currentUserDept,
    departmentRank: currentUserDeptIndex + 1,
    departmentTotalSteps: currentUserDept.totalSteps,
    challengeTargetSteps: CHALLENGE_TARGET_STEPS,
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-8 md:grid-cols-2">
        <MyStats user={currentUser} />
        <DepartmentRivalry 
          user={currentUser} 
          department={currentUserDept} 
          nextDepartment={nextDepartment} 
        />
      </div>
      <AICoach user={currentUserWithDept} />
      <Leaderboards departments={departmentsWithMembers} currentUser={currentUser} />
    </div>
  );
}
