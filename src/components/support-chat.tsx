'use client';

import type { User, SupportMessage, SupportThread } from '@/lib/data';
import {
  getSupportThreadAction,
  sendSupportMessageAction,
} from '@/app/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Send, Loader2, LifeBuoy } from 'lucide-react';
import { useEffect, useRef, useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';

interface SupportChatProps {
  currentUser: User;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="icon" disabled={pending}>
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Send className="h-4 w-4" />
      )}
      <span className="sr-only">Send Message</span>
    </Button>
  );
}

export function SupportChat({ currentUser }: SupportChatProps) {
  const [thread, setThread] = useState<SupportThread | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [state, formAction] = useActionState(sendSupportMessageAction, null);

  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const fetchThread = async () => {
      setIsLoading(true);
      const result = await getSupportThreadAction();
      if (result.success && result.data) {
        setThread(result.data);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      }
      setIsLoading(false);
    };
    fetchThread();
  }, [toast]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [thread?.messages]);

  useEffect(() => {
    if (state?.success && state.data && thread) {
        if (!thread.messages.find(m => m.id === state.data!.id)) {
            // Re-fetch the whole thread to get the new message and potential auto-reply
            getSupportThreadAction().then(result => {
                if (result.success && result.data) {
                    setThread(result.data);
                }
            });
        }
        formRef.current?.reset();
    }
  }, [state, thread]);

  const messages = thread?.messages || [];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b text-center bg-muted/50">
            <h3 className="font-headline flex items-center justify-center gap-2 text-lg"><LifeBuoy className="text-primary"/> Support Chat</h3>
            <p className="text-sm text-muted-foreground">Have a question? Ask an admin.</p>
        </div>
        <div className="flex-1 overflow-auto">
            <ScrollArea className="h-full p-6" ref={scrollAreaRef}>
            {isLoading ? (
                <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Send a message to start a conversation.</p>
                </div>
            ) : (
                <div className="space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={cn(
                            'flex items-end gap-2',
                            message.senderId === currentUser.id && 'justify-end'
                        )}
                    >
                    {message.senderId !== currentUser.id && (
                        <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                            <LifeBuoy className="m-1.5"/>
                            <AvatarFallback>AD</AvatarFallback>
                        </Avatar>
                    )}
                    <div
                        className={cn(
                        'max-w-xs rounded-lg p-3',
                        message.senderId === currentUser.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        )}
                    >
                        <p className="text-sm font-semibold mb-1">
                        {message.senderId === currentUser.id ? 'You' : message.senderName}
                        </p>
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1 text-right">
                            {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                        </p>
                    </div>
                    {message.senderId === currentUser.id && (
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={currentUser.avatar} data-ai-hint="profile person" />
                            <AvatarFallback>
                                {currentUser.name.slice(0, 2)}
                            </AvatarFallback>
                        </Avatar>
                    )}
                    </div>
                ))}
                </div>
            )}
            </ScrollArea>
        </div>
      <div className="border-t p-6 bg-background">
        <form action={formAction} ref={formRef} className="flex w-full items-center gap-2">
          <Input
            name="content"
            placeholder="Type a message..."
            autoComplete="off"
          />
          <SubmitButton />
        </form>
         {state && !state.success && state.error && (
            <p className="text-xs text-destructive pt-2">{state.error}</p>
        )}
      </div>
    </div>
  );
}
