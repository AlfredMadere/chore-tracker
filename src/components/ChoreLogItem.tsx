"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar, Clock } from "lucide-react";
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
    freeform?: boolean;
  };
  user: {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
  };
  usedTimer?: boolean;
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
  
  // Get formatted name for user (first name + last initial)
  const getFormattedName = (user: { email: string; name?: string | null }) => {
    if (!user.name) {
      return user.email.split('@')[0];
    }
    
    const nameParts = user.name.trim().split(' ');
    if (nameParts.length === 1) {
      return nameParts[0];
    }
    
    const firstName = nameParts[0];
    const lastInitial = nameParts[nameParts.length - 1][0];
    return `${firstName} ${lastInitial}.`;
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
        {/* Date and time header */}
        <div className="flex items-center justify-between mb-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{format(new Date(log.createdAt), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{format(new Date(log.createdAt), 'h:mm a')}</span>
          </div>
        </div>
        
        {/* Main content */}
        <div className="space-y-3">
          {/* Chore name */}
          <h3 className="text-base font-medium leading-tight">
            {log.chore.freeform 
              ? log.chore.name.split('__')[0] // Remove UUID from freeform chores
              : log.chore.name
            }
            {log.chore.freeform && (
              <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                (Freeform)
              </span>
            )}
          </h3>
          
          {/* User info and points */}
          <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-3">
            <div className="flex items-center gap-2 min-w-0">
              <Avatar className="h-6 w-6 flex-shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {getFormattedName(log.user).charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground truncate">
                by {getFormattedName(log.user)}
              </span>
            </div>
            
            <div className="flex items-center gap-2 ml-auto">
              <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400 hover:bg-green-500/10 hover:text-green-600 dark:hover:bg-green-500/20 dark:hover:text-green-400 whitespace-nowrap">
                +{log.chore.points} mins
              </Badge>
              {canDelete && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 flex-shrink-0 text-muted-foreground hover:text-destructive" 
                  onClick={handleDeleteClick}
                  title="Unlog this chore"
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
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
