"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { CheckCircle, Loader2, Timer, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import FreeformChoreEntry from "@/components/FreeformChoreEntry";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
  DrawerDescription,
  DrawerHeader,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { getChoresForGroup, logChore, deleteChoreLog } from "../log/actions";

type Chore = {
  id: number;
  name: string;
  points: number;
  groupId: number;
  description?: string;
};

export default function RecordPage() {
  const params = useParams();
  const groupId = params.id as string;
  const queryClient = useQueryClient();
  //TODO: add an edit button in the corner of the grid that links to /group/[id]/chores/edit 
  
  // Track which chores are being logged (for optimistic UI)
  const [loggingChores, setLoggingChores] = React.useState<Set<number>>(new Set());
  
  // Fetch chores for this group
  const { data, isLoading, error } = useQuery({
    queryKey: ["chores", groupId],
    queryFn: async () => {
      const result = await getChoresForGroup(groupId);
      if (!result.success) {
        throw new Error(result.error || "Failed to load chores");
      }
      return result.data as Chore[];
    }
  });
  
  // Mutation for deleting a chore log
  const deleteChoreLogMutation = useMutation({
    mutationFn: async (choreLogId: number) => {
      const result = await deleteChoreLog(choreLogId);
      if (!result.success) {
        throw new Error(result.error || "Failed to delete chore log");
      }
      return result.data;
    },
    onSuccess: () => {
      // Show success toast
      toast.success("Chore log removed");
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to undo chore log");
    }
  });
  
  // Mutation for logging a chore
  const logChoreMutation = useMutation({
    mutationFn: async (choreId: number) => {
      const result = await logChore(choreId, parseInt(groupId));
      if (!result.success) {
        throw new Error(result.error || "Failed to log chore");
      }
      return result.data;
    },
    onMutate: (choreId) => {
      // Optimistically update UI
      setLoggingChores(prev => {
        const updated = new Set(prev);
        updated.add(choreId);
        return updated;
      });
    },
    onSuccess: (data, choreId) => {
      // Show toast with undo button
      if (data && 'id' in data) {
        toast.success("Chore logged successfully", {
          action: {
            label: "Undo",
            onClick: () => deleteChoreLogMutation.mutate(data.id)
          },
          duration: 5000, // Give user more time to click undo
        });
      } else {
        // Fallback if we don't have the ID for some reason
        toast.success("Chore logged successfully");
      }
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
      
      // Remove from logging state after a short delay for animation
      setTimeout(() => {
        setLoggingChores(prev => {
          const updated = new Set(prev);
          updated.delete(choreId);
          return updated;
        });
      }, 500);
    },
    onError: (error, choreId) => {
      toast.error(error instanceof Error ? error.message : "Failed to log chore");
      
      // Remove from logging state
      setLoggingChores(prev => {
        const updated = new Set(prev);
        updated.delete(choreId);
        return updated;
      });
    }
  });
  
  // Handle chore click
  const handleChoreClick = (choreId: number) => {
    // Prevent multiple clicks
    if (loggingChores.has(choreId)) return;
    
    // Log the chore
    logChoreMutation.mutate(choreId);
  };
  
  // Handle freeform chore submission
  const handleFreeformSubmit = (data: { 
    name: string; 
    minutes: number; 
    description?: string; 
    timeWasEdited: boolean 
  }) => {
    // This will be implemented later to handle freeform chore submission
    toast.success("Freeform chore logged: " + data.name);
    console.log("Freeform chore data:", data);
    // The timeWasEdited flag will help us track whether the user manually edited the time
    // or simply used the timer feature
    console.log("Time was edited:", data.timeWasEdited ? "Yes" : "No");
    // TODO: Implement server action for freeform chore logging
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-destructive mb-2">Error loading chores</p>
        <p className="text-muted-foreground text-sm">{error instanceof Error ? error.message : "Unknown error"}</p>
      </div>
    );
  }
  
  if (!data || data.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">No chores found for this group</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] relative">
      {/* Scrollable grid of chores (takes up all the space) */}
      <div className="flex-1 overflow-y-auto p-4 pb-16 relative">
        <div className="absolute top-2 right-2 z-10">
          <Link href={`/group/${groupId}/chores/edit`}>
            <Button variant="outline" size="sm" className="h-8 px-2 py-0">
              <Edit className="h-3.5 w-3.5 mr-1" /> Edit Chores
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-10">
          {data.map((chore) => (
            <Card 
              key={chore.id}
              className={cn(
                "p-3 flex flex-col justify-between h-24 cursor-pointer transition-all",
                "hover:shadow-md active:scale-95",
                loggingChores.has(chore.id) && "bg-green-100 dark:bg-green-900/30"
              )}
              onClick={() => handleChoreClick(chore.id)}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-sm line-clamp-2">{chore.name}</h3>
                {loggingChores.has(chore.id) ? (
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                ) : (
                  <span className="text-xs font-semibold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full flex-shrink-0">
                    +{chore.points}
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Freeform chore entry in a drawer with tab-like trigger */}
      <div className="fixed bottom-16 left-0 right-0 flex justify-center z-10">
        <Drawer direction="bottom">
          <DrawerTrigger asChild>
            <button className="bg-background border border-border rounded-t-lg shadow-md px-4 py-1.5 flex items-center gap-1.5 text-xs font-medium">
              <Timer className="h-3.5 w-3.5 text-primary" />
              Freeform
            </button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[40vh]">
            <DrawerHeader className="sr-only">
              <DrawerTitle>Freeform Chore Entry</DrawerTitle>
              <DrawerDescription>
                Log a custom chore with a timer or manual time entry
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pt-2">
              <FreeformChoreEntry 
                groupId={groupId} 
                onSubmit={handleFreeformSubmit} 
              />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}