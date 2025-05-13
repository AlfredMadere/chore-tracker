"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getPointsPerUser } from "../actions";
import ChorePointsChart from "@/components/ChorePointsChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type UserMinutes = {
  id: string;
  name: string;
  points: number; // Still using 'points' in the type but will display as minutes
};

export default function LeaderboardPage() {
  const params = useParams();
  const groupId = params.id as string;
  const [timeFrame, setTimeFrame] = useState<"week" | "all">("week");

  // Function to get the start of the current week (Sunday at 00:00:00)
  const getStartOfWeek = () => {
    const now = new Date();
    const day = now.getDay(); // 0 is Sunday, 1 is Monday, etc.
    const sunday = new Date(now);
    sunday.setDate(now.getDate() - day);
    sunday.setHours(0, 0, 0, 0);
    return sunday;
  };

  // Use React Query to fetch minutes data
  const { 
    data: minutesData, 
    isLoading,
    error
  } = useQuery({
    queryKey: ["minutes", groupId, timeFrame],
    queryFn: async () => {
      // Set date filters based on selected time frame
      let startDate: Date | undefined;
      let endDate: Date | undefined;
      
      if (timeFrame === "week") {
        startDate = getStartOfWeek();
        endDate = new Date(); // Current time
      }
      
      const result = await getPointsPerUser(groupId, startDate, endDate);
      if (!result.success) {
        throw new Error(result.error || "Failed to load minutes data");
      }
      return result.data;
    }
  });

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="pt-6 flex justify-center items-center min-h-[200px]">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/10 border-t-primary"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-destructive">
          <CardContent className="pt-6 text-center">
            <h2 className="text-lg font-medium text-destructive mb-2">Error</h2>
            <p className="text-destructive/80">{(error as Error).message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-end mb-4">
        <Tabs defaultValue="week" value={timeFrame} onValueChange={(value) => setTimeFrame(value as "week" | "all")}>
          <TabsList>
            <TabsTrigger value="all">All Time</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="grid grid-cols-1 gap-8">
        {/* Chart View */}
        <ChorePointsChart groupId={groupId} getPointsPerUser={getPointsPerUser} timeFrame={timeFrame} />
        
        {/* Leaderboard List View */}
        <Card>
          <CardHeader>
            <CardTitle>Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            {!minutesData || minutesData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-muted/30 rounded-lg p-8 max-w-md">
                  <h3 className="text-lg font-medium mb-2">No minutes logged yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start logging chores to see who's leading the scoreboard!
                  </p>
                  <a href={`/group/${groupId}/record`} className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2">
                    Record a Chore
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {minutesData.map((user, index) => (
                  <div 
                    key={user.id} 
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      index === 0 
                        ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' 
                        : 'bg-background border-border'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`
                        flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
                        ${index === 0 ? 'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200' : 
                          index === 1 ? 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200' :
                          index === 2 ? 'bg-amber-100 dark:bg-amber-800 text-amber-800 dark:text-amber-200' :
                          'bg-muted text-muted-foreground'}
                      `}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary">
                      {user.points} mins
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
