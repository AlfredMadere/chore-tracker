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
  maxHeight?: string;
};

export default function ChoreLogList({ choreLogs, maxHeight = "400px" }: ChoreLogListProps) {
  console.log("choreLogs", choreLogs);
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
          <p className="text-center text-muted-foreground">
            No chores have been logged yet
          </p>
          <p className="text-center text-sm text-muted-foreground mt-1">
            Complete a chore to see it in the timeline
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="border-0 shadow-none md:border md:shadow ">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Chore Timeline
        </CardTitle>
        <CardDescription>
          Track when chores are completed
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 sm:px-2">
        <ScrollArea className="w-full overflow-y-scroll" style={{ maxHeight }}>
          <div className="flex flex-col gap-6">
            {groupedLogs.map((group, groupIndex) => (
              <div key={group.date.toISOString()} className="space-y-4">
                {/* Day header with separator */}
                <div className="flex items-center gap-3 sticky top-0 bg-background py-2 z-10">
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
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
