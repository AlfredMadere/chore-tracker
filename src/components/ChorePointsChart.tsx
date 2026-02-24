"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CHART_WEEKS_TO_SHOW } from "@/lib/constants";

type UserPoints = {
  id: string;
  name: string;
  points: number;
};

type ChorePointsChartProps = {
  groupId: string;
  getPointsPerUser: (id: string, startDate?: Date, endDate?: Date) => Promise<{ 
    success: boolean; 
    data?: UserPoints[];
    error?: string;
  }>;
  timeFrame: "week" | "all";
};

export default function ChorePointsChart({ groupId, getPointsPerUser, timeFrame }: ChorePointsChartProps) {
  const [pointsData, setPointsData] = useState<UserPoints[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Get the start date for the configured number of weeks back (Sunday at 00:00:00)
  const getStartDate = () => {
    const now = new Date();
    const day = now.getDay(); // 0 is Sunday, 1 is Monday, etc.
    const sunday = new Date(now);
    sunday.setDate(now.getDate() - day - (CHART_WEEKS_TO_SHOW - 1) * 7);
    sunday.setHours(0, 0, 0, 0);
    return sunday;
  };

  // Colors for the bars
  const colors = ["#3b82f6", "#10b981", "#6366f1", "#f97316", "#ec4899", "#8b5cf6"];

  useEffect(() => {
    async function fetchPointsData() {
      setLoading(true);
      try {
        // Set date filters based on selected time frame
        let startDate: Date | undefined;
        let endDate: Date | undefined;
        
        if (timeFrame === "week") {
          startDate = getStartDate();
          endDate = new Date(); // Current time
        }
        
        const result = await getPointsPerUser(groupId, startDate, endDate);
        
        if (result.success && result.data) {
          setPointsData(result.data);
          setError("");
        } else {
          setError(result.error || "Failed to load points data");
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An error occurred while fetching points data");
      }
      setLoading(false);
    }
    
    fetchPointsData();
  }, [groupId, getPointsPerUser, timeFrame]);

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Chore Points by User</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/10 border-t-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Chore Points by User</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (pointsData.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Chore Points by User</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">No chore points data available yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Chore Points by User</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={pointsData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  borderRadius: "var(--radius)",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow)",
                }}
                formatter={(value) => [`${value} points`, "Points"]}
              />
              <Bar dataKey="points" radius={[4, 4, 0, 0]}>
                {pointsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
