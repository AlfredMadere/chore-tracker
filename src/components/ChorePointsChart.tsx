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

type UserPoints = {
  id: number;
  name: string;
  points: number;
};

type ChorePointsChartProps = {
  groupId: string;
  getPointsPerUser: (id: string) => Promise<{ 
    success: boolean; 
    data?: UserPoints[];
    error?: string;
  }>;
};

export default function ChorePointsChart({ groupId, getPointsPerUser }: ChorePointsChartProps) {
  const [pointsData, setPointsData] = useState<UserPoints[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Colors for the bars
  const colors = ["#3b82f6", "#10b981", "#6366f1", "#f97316", "#ec4899", "#8b5cf6"];

  useEffect(() => {
    async function fetchPointsData() {
      setLoading(true);
      try {
        const result = await getPointsPerUser(groupId);
        
        if (result.success && result.data) {
          setPointsData(result.data);
          setError("");
        } else {
          setError(result.error || "Failed to load points data");
        }
      } catch (err) {
        setError("An error occurred while fetching points data");
      }
      setLoading(false);
    }
    
    fetchPointsData();
  }, [groupId, getPointsPerUser]);

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Chore Points by User</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
          <p className="text-red-500">{error}</p>
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
          <p className="text-gray-500 dark:text-gray-400">No chore points data available yet</p>
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
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "6px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
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
