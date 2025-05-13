"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteChore } from "@/app/group/[id]/chores/actions";

type Chore = {
  id: number;
  name: string;
  points: number;
  description?: string;
  groupId: number;
};

type ChoreCardProps = {
  chore: Chore;
  groupId: string;
  onEdit: (chore: Chore) => void;
};

export default function ChoreCard({ chore, groupId, onEdit }: ChoreCardProps) {
  const queryClient = useQueryClient();

  // Mutation for deleting a chore
  const deleteChoresMutation = useMutation({
    mutationFn: async (choreId: number) => {
      const result = await deleteChore(choreId);
      if (!result.success) {
        throw new Error(result.error || "Failed to delete chore");
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Chore deleted successfully");
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["chores", groupId] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to delete chore");
    },
  });

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${chore.name}"?`)) {
      deleteChoresMutation.mutate(chore.id);
    }
  };

  return (
    <Card className="mb-2">
      <CardContent className="p-2 py-1.5">
        <div className="flex flex-col space-y-1.5">
          {/* Chore name and points */}
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm mr-2 line-clamp-2">{chore.name}</h3>
            <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
              {chore.points} {chore.points === 1 ? 'point' : 'points'}
            </span>
          </div>
          
          {/* Description if available */}
          {chore.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {chore.description}
            </p>
          )}
          
          {/* Action buttons */}
          <div className="flex justify-end space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 md:hidden"
              onClick={() => onEdit(chore)}
              aria-label="Edit chore"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive md:hidden"
              onClick={handleDelete}
              disabled={deleteChoresMutation.isPending}
              aria-label="Delete chore"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            
            {/* Desktop buttons with text */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 py-0 hidden md:flex"
              onClick={() => onEdit(chore)}
            >
              <Edit className="h-3.5 w-3.5 mr-1" /> Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 py-0 text-destructive border-destructive hover:bg-destructive/10 hidden md:flex"
              onClick={handleDelete}
              disabled={deleteChoresMutation.isPending}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
