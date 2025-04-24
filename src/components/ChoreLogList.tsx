"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ChoreLog = {
  id: number;
  createdAt: string;
  chore: {
    id: number;
    name: string;
    points: number;
  };
  user: {
    id: number;
    email: string;
    name?: string | null;
  };
};

type ChoreLogListProps = {
  choreLogs: ChoreLog[];
  maxHeight?: string;
};

export default function ChoreLogList({ choreLogs, maxHeight = "400px" }: ChoreLogListProps) {
  // Format the date nicely
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
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
        <CardContent>
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
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
        <div 
          className="overflow-y-auto pr-2" 
          style={{ maxHeight }}
        >
          <ul className="space-y-4">
            {choreLogs.map((log) => (
              <li 
                key={log.id} 
                className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-800/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {/* Avatar with first initial */}
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      {getUserDisplayName(log.user).charAt(0).toUpperCase()}
                    </div>
                    
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        <span className="font-semibold">{getUserDisplayName(log.user)}</span> completed{" "}
                        <span className="font-semibold">{log.chore.name}</span>
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {formatDate(log.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2.5 py-0.5 rounded-full text-xs font-medium">
                    +{log.chore.points} points
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
