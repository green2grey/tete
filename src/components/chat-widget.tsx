'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { DepartmentChat } from '@/components/department-chat';
import { SupportChat } from '@/components/support-chat';
import { MessageCircle, LifeBuoy } from 'lucide-react';
import type { User, Department } from '@/lib/data';
import { cn } from '@/lib/utils';

interface ChatWidgetProps {
  user: User;
  department: Department;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  activeChat: 'department' | 'support';
  setActiveChat: (chat: 'department' | 'support') => void;
}

export function ChatWidget({ 
  user,
  department,
  isOpen,
  onOpenChange,
  activeChat,
  setActiveChat,
}: ChatWidgetProps) {
  // In a real app, this would be based on actual unread messages.
  const [hasNewMessages, setHasNewMessages] = useState(true);

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (open) {
      setHasNewMessages(false); // Hide notification when chat is opened
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="default"
          size="icon"
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl z-50"
          aria-label="Open chat"
        >
          <MessageCircle className="h-8 w-8" />
          {hasNewMessages && !isOpen && (
            <span className="absolute top-1 right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col" side="right">
        <SheetHeader className="p-4 pb-2 border-b">
           <SheetTitle className="sr-only">Chat Panel</SheetTitle>
           <div className="grid grid-cols-2 gap-2">
            <Button
              variant={activeChat === 'department' ? 'default' : 'outline'}
              onClick={() => setActiveChat('department')}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              {department.name}
            </Button>
            <Button
              variant={activeChat === 'support' ? 'default' : 'outline'}
              onClick={() => setActiveChat('support')}
            >
              <LifeBuoy className="mr-2 h-4 w-4" />
              Support
            </Button>
          </div>
        </SheetHeader>
        {activeChat === 'department' ? (
          <DepartmentChat department={department} currentUser={user} />
        ) : (
          <SupportChat currentUser={user} />
        )}
      </SheetContent>
    </Sheet>
  );
}
