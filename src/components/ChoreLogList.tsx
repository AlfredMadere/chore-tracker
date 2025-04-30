"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

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
  // Format the date nicely
  const formatDate = (dateValue: string | Date) => {
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // If it's today
    if (date.toDateString() === now.toDateString()) {
      return `Today at ${format(date, "h:mm a")}`;
    }
    
    // If it's yesterday
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${format(date, "h:mm a")}`;
    }
    
    // Otherwise show full date
    return format(date, "MMM d, yyyy 'at' h:mm a");
  };
  
  // Get display name for user
  const getUserDisplayName = (user: { email: string; name?: string | null }) => {
    return user.name || user.email.split('@')[0];
  };
  
  if (choreLogs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center min-h-[100px]">
          <p className="text-center text-muted-foreground py-4">
            No chores have been logged yet
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="pr-2" style={{ maxHeight }}>
          <ul className="space-y-4">
            {choreLogs.map((log) => (
              <li 
                key={log.id} 
                className="p-4 border border-border rounded-lg bg-muted/30"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getUserDisplayName(log.user).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <p className="font-medium text-foreground">
                        <span className="font-semibold">{getUserDisplayName(log.user)}</span> completed{" "}
                        <span className="font-semibold">{log.chore.name}</span>
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatDate(log.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400 hover:bg-green-500/10 hover:text-green-600 dark:hover:bg-green-500/20 dark:hover:text-green-400">
                    +{log.chore.points} points
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
