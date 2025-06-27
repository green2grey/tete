'use client';

import { switchToAdminViewAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import type { User } from '@/lib/data';
import { AlertTriangle, UserCog } from 'lucide-react';

interface DevSwitchBannerProps {
  adminUser: User;
}

export function DevSwitchBanner({ adminUser }: DevSwitchBannerProps) {
  return (
    <div className="bg-yellow-500 text-yellow-900 py-2 px-4 text-center text-sm font-semibold flex items-center justify-center gap-4 z-50 relative">
      <div className="flex items-center gap-2">
        <UserCog className="h-5 w-5" />
        <span>
          You ({adminUser.name}) are currently in User View.
        </span>
      </div>
      <form action={switchToAdminViewAction}>
        <Button
          type="submit"
          variant="ghost"
          size="sm"
          className="h-auto px-2 py-1 border border-yellow-700/50 hover:bg-yellow-600 hover:text-yellow-900"
        >
          Switch back to Admin View
        </Button>
      </form>
    </div>
  );
}
