"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getGroupById } from "../actions";
import ChoreLogList from "@/components/ChoreLogList";
import { Card, CardContent } from "@/components/ui/card";

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

export default function ChoreTimelinePage() {
  const params = useParams();
  const groupId = params.id as string;
  const [choreLogs, setChoreLogs] = useState<ChoreLog[]>([]);

  // Use React Query to fetch group data
  const { 
    data: group, 
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["group", groupId, "timeline"],
    queryFn: async () => {
      const result = await getGroupById(groupId);
      if (!result.success) {
        throw new Error(result.error || "Failed to load group");
      }
      return result.data;
    }
  });

  // Set chore logs when group data is available
  useEffect(() => {
    if (group) {
      setChoreLogs(group.ChoreLog || []);
    }
  }, [group]);

  // Handle chore log deletion
  const handleChoreLogDeleted = (choreLogId: number) => {
    setChoreLogs(prev => prev.filter(log => log.id !== choreLogId));
    refetch(); // Refresh data
  };

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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 gap-8">
        <ChoreLogList 
          choreLogs={choreLogs} 
          maxHeight="800px" 
          onChoreLogDeleted={handleChoreLogDeleted} 
        />
      </div>
    </div>
  );
}
