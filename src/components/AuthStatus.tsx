"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";

export function AuthStatus() {
  const { data: session, status } = useSession();
  
  if (status === "loading") {
    return (
      <div className="h-9 w-24 bg-neutral-100 dark:bg-neutral-800 animate-pulse rounded-md"></div>
    );
  }
  
  if (!session) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => signIn()}
        className="gap-2"
      >
        <User className="h-4 w-4" />
        <span>Sign In</span>
      </Button>
    );
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
            {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : session?.user?.email?.charAt(0).toUpperCase() || '?'}
          </div>
          <span className="max-w-[100px] truncate">
            {session?.user?.name || session?.user?.email?.split('@')[0] || 'User'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
