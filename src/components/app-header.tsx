'use client';

import type { User } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { logoutAction, updateAvatarAction, switchToUserViewAction } from "@/app/actions";
import { LogOut, Shield, User as UserIcon, LifeBuoy, Users } from "lucide-react";
import Link from "next/link";
import { useState, useActionState, useEffect } from "react";
import { predefinedAvatars } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useFormStatus } from "react-dom";

interface AppHeaderProps {
  user: User;
  originalUser: User | null;
  onContactSupportClick: () => void;
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <Button type="submit" disabled={pending}>
        {pending ? 'Saving...' : 'Save Changes'}
      </Button>
    );
}

function ChangeAvatarDialog({ user }: { user: User }) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState(user.avatar);
    const [state, formAction] = useActionState(updateAvatarAction, null);
    const { toast } = useToast();

    useEffect(() => {
        if (state?.success) {
            toast({
                title: "Avatar Updated",
                description: "Your new profile picture has been saved.",
            });
            setDialogOpen(false);
        }
        if (state?.error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: state.error,
            });
        }
    }, [state, toast]);
    
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Change Avatar</span>
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
                <form action={formAction}>
                    <DialogHeader>
                        <DialogTitle>Choose your avatar</DialogTitle>
                        <DialogDescription>
                            Select a new avatar from the options below. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-4 gap-4 py-4">
                        {predefinedAvatars.map((avatarUrl) => (
                            <div 
                                key={avatarUrl}
                                className="flex justify-center"
                                onClick={() => setSelectedAvatar(avatarUrl)}
                            >
                                <Avatar className={cn(
                                    "h-16 w-16 cursor-pointer ring-offset-background transition-all ring-offset-2",
                                    selectedAvatar === avatarUrl ? 'ring-2 ring-primary' : 'ring-0'
                                )}>
                                    <AvatarImage src={avatarUrl} alt="Avatar" data-ai-hint="avatar" />
                                    <AvatarFallback>AV</AvatarFallback>
                                </Avatar>
                            </div>
                        ))}
                    </div>
                    <input type="hidden" name="avatarUrl" value={selectedAvatar} />
                    <DialogFooter>
                        <SubmitButton />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export function AppHeader({ user, originalUser, onContactSupportClick }: AppHeaderProps) {
  const isAdmin = originalUser ? originalUser.role === 'admin' : user.role === 'admin';
  const canAccessAdminPanel = user.role === 'admin' || user.role === 'manager';
  const isViewingAsUser = !!originalUser;

  return (
    <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/dashboard">
          <h1 className="text-2xl font-headline font-bold text-primary">Olive View Wellness</h1>
        </Link>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="profile person" />
                <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground font-normal">{user.id}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ChangeAvatarDialog user={user} />
               <DropdownMenuItem onSelect={onContactSupportClick} className="cursor-pointer">
                <LifeBuoy className="mr-2 h-4 w-4" />
                <span>Contact Support</span>
              </DropdownMenuItem>
              {canAccessAdminPanel && !isViewingAsUser && (
                <>
                  <DropdownMenuSeparator />
                  <Link href="/dashboard/admin">
                    <DropdownMenuItem className="cursor-pointer">
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Admin Panel</span>
                    </DropdownMenuItem>
                  </Link>
                  {isAdmin && (
                     <form action={switchToUserViewAction} className="w-full">
                          <button type="submit" className="w-full">
                              <DropdownMenuItem className="w-full cursor-pointer">
                                  <Users className="mr-2 h-4 w-4" />
                                  <span>Switch to User View</span>
                              </DropdownMenuItem>
                          </button>
                      </form>
                  )}
                </>
              )}
              <DropdownMenuSeparator />
              <form action={logoutAction} className="w-full">
                <Button type="submit" variant="ghost" className="w-full justify-start p-0">
                  <DropdownMenuItem className="w-full cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </Button>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
