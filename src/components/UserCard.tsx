"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, LogOut } from "lucide-react";

export function UserCard() {
  const { data: session } = useSession();

  if (!session?.user) {
    return (
      <Button
        variant="outline"
        className="w-full justify-start gap-2 border-dashed text-muted-foreground"
        size="sm"
        asChild
      >
        <Link href="/signin">
          <User className="h-4 w-4" />
          <span>Sign In</span>
        </Link>
      </Button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="p-0 h-auto w-full hover:bg-transparent">
          <div className="flex items-center gap-2 p-2 w-full rounded-lg hover:bg-muted">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary">
                {session.user.name ? session.user.name.charAt(0).toUpperCase() : session.user.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-foreground truncate">
                {session.user.name || session.user.email?.split('@')[0]}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {session.user.email}
              </p>
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2">
        <div className="flex flex-col gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
