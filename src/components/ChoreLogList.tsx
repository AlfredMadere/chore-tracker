"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteChoreLog } from "@/app/group/[id]/log/actions";
import { useSession } from "next-auth/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  onChoreLogDeleted?: (choreLogId: number) => void;
};

export default function ChoreLogList({ choreLogs, maxHeight = "400px", onChoreLogDeleted }: ChoreLogListProps) {
  const { data: session } = useSession();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedChoreLog, setSelectedChoreLog] = useState<ChoreLog | null>(null);
  
  // Delete chore log mutation
  const deleteMutation = useMutation<
    { success: boolean; error?: string },
    Error,
    number
  >({
    mutationFn: async (choreLogId: number) => {
      const result = await deleteChoreLog(choreLogId);
      return result;
    },
    onSuccess: (result, choreLogId) => {
      if (result.success) {
        toast.success("Chore unlogged successfully");
        if (onChoreLogDeleted) {
          onChoreLogDeleted(choreLogId);
        }
      } else {
        toast.error(result.error || "Failed to unlog chore");
      }
    },
    onError: (error) => {
      toast.error("An error occurred while unlogging the chore");
      console.error("Error unlogging chore:", error);
    }
  });
  
  // Handle delete button click
  const handleDeleteClick = (log: ChoreLog) => {
    setSelectedChoreLog(log);
    setIsDeleteDialogOpen(true);
  };
  
  // Handle confirm delete
  const handleConfirmDelete = () => {
    if (selectedChoreLog) {
      deleteMutation.mutate(selectedChoreLog.id);
    }
    setIsDeleteDialogOpen(false);
  };
  
  // Check if user can delete a log (if they created it)
  const canDeleteLog = (log: ChoreLog) => {
    // Use email to match users since the session doesn't have the ID in the client component
    return session?.user?.email === log.user.email;
  };
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
                  
                  <div className="flex items-center gap-2">
                    {canDeleteLog(log) && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-destructive" 
                        onClick={() => handleDeleteClick(log)}
                        title="Unlog this chore"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400 hover:bg-green-500/10 hover:text-green-600 dark:hover:bg-green-500/20 dark:hover:text-green-400">
                      +{log.chore.points} points
                    </Badge>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
      
      {/* Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unlog Chore</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unlog this chore? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Unlog
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
