"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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
    description?: string;
  };
  user: {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
  };
};

type ChoreLogItemProps = {
  log: ChoreLog;
  timeMarker: string;
  isNewDay: boolean;
};

export default function ChoreLogItem({ log, timeMarker, isNewDay }: ChoreLogItemProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  
  // Check if user can delete a log (if they created it)
  const canDelete = session?.user?.email === log.user.email;
  
  // Delete chore log mutation
  const deleteMutation = useMutation<
    { success: boolean; error?: string },
    Error,
    number
  >({
    mutationFn: async (choreLogId: number) => {
      const response = await fetch(`/api/chore-logs?id=${choreLogId}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete chore log');
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Chore unlogged successfully");
      console.log("Invalidating group query", ["group", log.chore.groupId]);
      queryClient.invalidateQueries({
        queryKey: ["group", log.chore.groupId],
      });
    },
    onError: (error) => {
      toast.error("An error occurred while unlogging the chore");
      console.error("Error unlogging chore:", error);
    }
  });
  
  // Get display name for user
  const getUserDisplayName = (user: { email: string; name?: string | null }) => {
    return user.name || user.email.split('@')[0];
  };
  
  // Handle delete button click
  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };
  
  // Handle confirm delete
  const handleConfirmDelete = () => {
    deleteMutation.mutate(log.id);
    setIsDeleteDialogOpen(false);
  };
  
  return (
    <div className="">
      {/* Content */}
      <div className="bg-card border border-border rounded-lg p-4 shadow-sm w-full overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex items-start space-x-3 min-w-0">
            <Avatar className="flex-shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary">
                {getUserDisplayName(log.user).charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground truncate">
                <span className="font-semibold">{getUserDisplayName(log.user)}</span> completed{" "}
                <span className="font-semibold">{log.chore.name}</span>
              </p>
              {log.chore.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2 break-words">
                  {log.chore.description}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-2 sm:mt-0 justify-end">
            <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400 hover:bg-green-500/10 hover:text-green-600 dark:hover:bg-green-500/20 dark:hover:text-green-400 whitespace-nowrap">
              +{log.chore.points} points
            </Badge>
            {canDelete && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 flex-shrink-0 text-muted-foreground hover:text-destructive" 
                onClick={handleDeleteClick}
                title="Unlog this chore"
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
      
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
    </div>
  );
}
