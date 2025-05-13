"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, isSameDay, isToday, isYesterday } from "date-fns";
import ChoreLogItem from "./ChoreLogItem";
import { Calendar } from "lucide-react";

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
  
  // Group logs by date for the timeline
  const groupedLogs = useMemo(() => {
    // Sort logs by date (newest first)
    const sortedLogs = [...choreLogs].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
    
    // Track which logs start a new day
    const newDayFlags = sortedLogs.map((log, index) => {
      if (index === 0) return true;
      
      const currentDate = new Date(log.createdAt);
      const prevDate = new Date(sortedLogs[index - 1].createdAt);
      
      return !isSameDay(currentDate, prevDate);
    });
    
    return sortedLogs.map((log, index) => ({
      log,
      isNewDay: newDayFlags[index],
      formattedDate: formatDate(log.createdAt)
    }));
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
          <div className="flex flex-col gap-4">

              {groupedLogs.map(({ log, isNewDay, formattedDate }) => (
                <ChoreLogItem
                  key={log.id}
                  log={log}
                  timeMarker={formattedDate}
                  isNewDay={isNewDay}
                />
              ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
