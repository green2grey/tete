'use client';

import type { SupportThread, SupportMessage } from '@/lib/data';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { useActionState, useEffect, useRef } from 'react';
import { sendAdminSupportReplyAction } from '@/app/actions';
import { useFormStatus } from 'react-dom';
import { Button } from './ui/button';
import { Loader2, Send } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface SupportTicketsProps {
  initialThreads: SupportThread[];
}

function ReplyForm({ userId }: { userId: string }) {
  const [state, formAction] = useActionState(sendAdminSupportReplyAction, null);
  const { pending } = useFormStatus({ action: formAction });
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      toast({ title: 'Reply Sent', description: 'Your message has been sent to the user.' });
    }
    if (state?.error) {
        toast({ variant: 'destructive', title: 'Error', description: state.error });
    }
  }, [state, toast]);

  return (
    <form action={formAction} ref={formRef} className="mt-4 flex flex-col gap-2">
      <input type="hidden" name="userId" value={userId} />
      <Textarea
        name="content"
        placeholder="Type your reply..."
        required
        className="bg-card"
      />
      <div className='flex justify-end'>
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
          {pending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          Send Reply
        </Button>
      </div>
      {state && !state.success && state.error && (
        <p className="text-xs text-destructive">{state.error}</p>
      )}
    </form>
  );
}

function Message({ message }: { message: SupportMessage & { userAvatar?: string } }) {
    const isAdmin = message.senderId === 'admin';
    return (
        <div className={cn(
            "flex items-start gap-3 my-2",
            isAdmin && "justify-end"
        )}>
            {!isAdmin && (
                <Avatar className="h-8 w-8 border">
                    <AvatarImage src={message.userAvatar} />
                    <AvatarFallback>{message.senderName.slice(0, 2)}</AvatarFallback>
                </Avatar>
            )}
            <div className={cn(
                "rounded-lg p-3 max-w-sm",
                isAdmin ? "bg-primary text-primary-foreground" : "bg-muted"
            )}>
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-75 mt-1 text-right">
                    {format(new Date(message.timestamp), 'PPpp')}
                </p>
            </div>
            {isAdmin && (
                 <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                    <AvatarFallback>AD</AvatarFallback>
                </Avatar>
            )}
        </div>
    )
}

export function SupportTickets({ initialThreads: threads }: SupportTicketsProps) {
  
  if (threads.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        <p>No support tickets yet.</p>
      </div>
    );
  }

  return (
    <Accordion type="multiple" className="w-full space-y-2">
      {threads.map((thread) => (
        <AccordionItem
          key={thread.userId}
          value={thread.userId}
          className="border rounded-md px-4 bg-card"
        >
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={thread.userAvatar} />
                <AvatarFallback>{thread.userName.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-left">{thread.userName}</p>
                <p className="text-xs text-muted-foreground text-left">
                  {thread.userId}
                </p>
              </div>
              {thread.hasUnreadUserMessages && (
                <Badge variant="destructive">New</Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="max-h-96 overflow-y-auto bg-muted/30 p-4 rounded-md">
              {thread.messages.map((msg) => (
                <Message key={msg.id} message={{...msg, userAvatar: thread.userAvatar}} />
              ))}
            </div>
            <ReplyForm userId={thread.userId} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
