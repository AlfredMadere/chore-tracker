"use client";

import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, BarChart, Clock, CheckCircle, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MobileBottomNav() {
  const params = useParams();
  const pathname = usePathname();
  const groupId = params.id as string;
  
  const navItems = [
    {
      href: `/group/${groupId}/record`,
      label: 'Record',
      icon: CheckCircle,
    },
    {
      href: `/group/${groupId}/timeline`,
      label: 'Timeline',
      icon: Clock,
    },
    {
      href: `/group/${groupId}/leaderboard`,
      label: 'Leaderboard',
      icon: BarChart,
    },
    {
      href: `/group/${groupId}/settings`,
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <nav className="grid grid-cols-4 h-16 bg-background border-t border-border shadow-lg">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 transition-colors touch-manipulation",
                "active:bg-muted/50 h-full", // Better touch feedback
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              prefetch={true} // For super fast navigation
            >
              {/* Active indicator dot */}
              {isActive && (
                <span className="absolute top-2 right-1/2 translate-x-4 h-1.5 w-1.5 rounded-full bg-primary" />
              )}
              
              <Icon className={cn(
                "h-5 w-5",
                isActive && "text-primary"
              )} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
