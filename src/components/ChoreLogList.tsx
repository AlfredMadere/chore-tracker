"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, isSameDay, isToday, isYesterday, startOfWeek, differenceInWeeks, addWeeks } from "date-fns";
import ChoreLogItem from "./ChoreLogItem";
import { Calendar } from "lucide-react";
import { Separator } from "@/components/ui/separator";

type ChoreLog = {
  id: number;
  createdAt: string | Date;
  chore: {
    id: number;
    name: string;
    points: number;
    groupId: number;
  };
  user: {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
  };
};

type ChoreLogListProps = {
  choreLogs: ChoreLog[];
};

export default function ChoreLogList({ choreLogs}: ChoreLogListProps) {
  // Format the date for display
  const formatDate = (dateValue: string | Date) => {
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    
    if (isToday(date)) {
      return `Today at ${format(date, "h:mm a")}`;
    }
    
    if (isYesterday(date)) {
      return `Yesterday at ${format(date, "h:mm a")}`;
    }
    
    return format(date, "MMM d, yyyy 'at' h:mm a");
  };
  
  // Format the day header
  const formatDayHeader = (dateValue: string | Date) => {
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    const now = new Date();
    const currentWeekStart = startOfWeek(now, { weekStartsOn: 0 }); // Sunday as week start
    const dateWeekStart = startOfWeek(date, { weekStartsOn: 0 });
    const weeksAgo = differenceInWeeks(currentWeekStart, dateWeekStart);
    
    if (isToday(date)) {
      return `${format(date, "EEEE")} (Today)`;
    }
    
    if (isYesterday(date)) {
      return `${format(date, "EEEE")} (Yesterday)`;
    }
    
    if (weeksAgo === 0) {
      // This week
      return format(date, "EEEE");
    }
    
    if (weeksAgo === 1) {
      // Last week
      return `${format(date, "EEEE")} (Last Week)`;
    }
    
    if (weeksAgo === 2) {
      // Two weeks ago
      return `${format(date, "EEEE")} (Two Weeks Ago)`;
    }
    
    // More than two weeks ago
    return format(date, "MMMM d, yyyy");
  };
  
  // Group logs by date for the timeline
  const groupedLogs = useMemo(() => {
    if (choreLogs.length === 0) return [];
    
    // Sort logs by date (newest first)
    const sortedLogs = [...choreLogs].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
    
    // Group logs by day
    const dayGroups: { date: Date; logs: typeof sortedLogs }[] = [];
    let currentDay: Date | null = null;
    let currentLogs: typeof sortedLogs = [];
    
    sortedLogs.forEach(log => {
      const logDate = new Date(log.createdAt);
      // Set time to midnight for comparison
      const dayDate = new Date(logDate.getFullYear(), logDate.getMonth(), logDate.getDate());
      
      if (!currentDay || !isSameDay(currentDay, dayDate)) {
        if (currentDay && currentLogs.length > 0) {
          dayGroups.push({ date: currentDay, logs: currentLogs });
        }
        currentDay = dayDate;
        currentLogs = [log];
      } else {
        currentLogs.push(log);
      }
    });
    
    // Add the last group
    if (currentDay && currentLogs.length > 0) {
      dayGroups.push({ date: currentDay, logs: currentLogs });
    }
    
    return dayGroups;
  }, [choreLogs]);
  

  
  if (choreLogs.length === 0) {
    // Extract groupId from URL if available
    const groupId = typeof window !== 'undefined' ? 
      window.location.pathname.split('/').find((segment, index, arr) => 
        arr[index-1] === 'group' && segment !== 'timeline'
      ) : null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Chore Timeline
          </CardTitle>
          <CardDescription>
            Track when chores are completed
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center min-h-[200px] py-12">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No activity yet</h3>
          <p className="text-center text-muted-foreground max-w-md mb-6">
            Your chore timeline will show a history of all completed chores in your group.
          </p>
          {groupId && (
            <div className="flex gap-4">
              <a href={`/group/${groupId}/record`} className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2">
                Record a Chore
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
  
  return (
    
          <div className="flex flex-col gap-6">
            {groupedLogs.map((group, groupIndex) => (
              <div key={group.date.toISOString()} className="space-y-4">
                {/* Day header with separator */}
                <div className="flex items-center gap-3 sticky top-14 sm:top-0 bg-background py-2 z-10 ">
                  <div className="h-px flex-grow bg-border" />
                  <h3 className="text-sm font-semibold text-foreground whitespace-nowrap px-2">
                    {formatDayHeader(group.date)}
                  </h3>
                  <div className="h-px flex-grow bg-border" />
                </div>
                
                {/* Logs for this day */}
                <div className="space-y-4 pl-1">
                  {group.logs.map(log => (
                    <ChoreLogItem
                      key={log.id}
                      log={log}
                      timeMarker={formatDate(log.createdAt)}
                      isNewDay={false}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
      
  );
}
