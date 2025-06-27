'use client';

import type { User } from '@/lib/data';
import { AppHeader } from '@/components/app-header';
import { departments } from '@/lib/data';
import { ChatWidget } from '@/components/chat-widget';
import { useState } from 'react';
import { ForcePasswordChangeDialog } from './force-password-change-dialog';

export function DashboardClientLayout({
  user,
  originalUser,
  children,
}: {
  user: User;
  originalUser: User | null;
  children: React.ReactNode;
}) {
  const [isChatOpen, setChatOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<'department' | 'support'>('department');

  const currentUserDept = departments.find(d => d.id === user.departmentId);

  const openSupportChat = () => {
    setActiveChat('support');
    setChatOpen(true);
  };
  
  if (user.mustChangePassword) {
    return <ForcePasswordChangeDialog />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <AppHeader user={user} originalUser={originalUser} onContactSupportClick={openSupportChat} />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        {children}
      </main>
      {currentUserDept && (
        <ChatWidget
          user={user}
          department={currentUserDept}
          isOpen={isChatOpen}
          onOpenChange={setChatOpen}
          activeChat={activeChat}
          setActiveChat={setActiveChat}
        />
      )}
    </div>
  );
}
