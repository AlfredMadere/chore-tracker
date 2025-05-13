"use client";

import { useParams, usePathname } from 'next/navigation';
import { Calendar, Home, Clock, BarChart, CheckCircle, PencilLine } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MobileHeader() {
  const params = useParams();
  const pathname = usePathname();
  const groupId = params.id as string;
  
  // Define page info based on pathname
  const getPageInfo = () => {
    if (pathname === `/group/${groupId}`) {
      return { title: "Home", icon: Home };
    }
    if (pathname === `/group/${groupId}/record`) {
      return { title: "Log Chore", icon: CheckCircle };
    }
    if (pathname === `/group/${groupId}/timeline`) {
      return { title: "Timeline", icon: Clock };
    }
    if (pathname === `/group/${groupId}/leaderboard`) {
      return { title: "Leaderboard", icon: BarChart };
    }
    if (pathname === `/group/${groupId}/chores`) {
      return { title: "Manage Chores", icon: PencilLine };
    }
    
    // Default
    return { title: "Chore Tracker", icon: Calendar };
  };
  
  const pageInfo = getPageInfo();
  const Icon = pageInfo.icon;

  return (
    <div className="md:hidden sticky top-0 z-40 w-full bg-background border-b border-border shadow-sm">
      <div className="flex items-center justify-center h-14 px-4">
        <div className="flex items-center">
          <Icon className={cn("h-5 w-5 text-primary mr-2")} />
          <h1 className="text-lg font-semibold">{pageInfo.title}</h1>
        </div>
      </div>
    </div>
  );
}
