"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Plus, Search, ArrowLeft } from "lucide-react";
import ChoreCard from "@/components/ChoreCard";
import ChoreForm from "@/components/ChoreForm";
import { getChoresForGroup, addChore, updateChore } from "../actions";
import Link from "next/link";

type Chore = {
  id: number;
  name: string;
  points: number;
  description?: string;
  groupId: number;
};

export default function EditChoresPage() {
  const params = useParams();
  const groupId = params.id as string;
  const queryClient = useQueryClient();
  
  // State for search and modals
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [choreToEdit, setChoreToEdit] = useState<Chore | null>(null);

  // Fetch chores
  const { data, isLoading, isError } = useQuery({
    queryKey: ["chores", groupId],
    queryFn: async () => {
      const result = await getChoresForGroup(groupId);
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch chores");
      }
      return result.data;
    }
  });

  // Add chore mutation
  const addChoreMutation = useMutation({
    mutationFn: async (values: { name: string; points: number; description?: string }) => {
      const result = await addChore(
        groupId, 
        values.name, 
        values.points, 
        values.description || ""
      );
      if (!result.success) {
        throw new Error(result.error || "Failed to add chore");
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success("Chore added successfully");
      setIsAddModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["chores", groupId] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to add chore");
    }
  });

  // Update chore mutation
  const updateChoreMutation = useMutation({
    mutationFn: async (values: { id: number; name: string; points: number; description?: string }) => {
      const result = await updateChore(
        values.id,
        values.name,
        values.points,
        values.description || ""
      );
      if (!result.success) {
        throw new Error(result.error || "Failed to update chore");
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success("Chore updated successfully");
      setIsEditModalOpen(false);
      setChoreToEdit(null);
      queryClient.invalidateQueries({ queryKey: ["chores", groupId] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update chore");
    }
  });

  // Handle edit chore
  const handleEditChore = (chore: Chore) => {
    setChoreToEdit(chore);
    setIsEditModalOpen(true);
  };

  // Filter chores based on search query
  const filteredChores = data ? data.filter(
    (chore: Chore) => 
      chore.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (chore.description && chore.description.toLowerCase().includes(searchQuery.toLowerCase()))
  ) : [];

  if (isLoading) {
    return (
      <div className="p-4 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-center text-destructive">
        <p>Error loading chores. Please try again.</p>
        <Button variant="outline" className="mt-4" onClick={() => queryClient.invalidateQueries({ queryKey: ["chores", groupId] })}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20">
      {/* Header */}
      <div className="flex flex-col space-y-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href={`/group/${groupId}/record`} className="mr-2">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Edit Chores</h1>
          </div>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-1" /> Add Chore
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Chore</DialogTitle>
              </DialogHeader>
              <ChoreForm 
                onSubmit={addChoreMutation.mutate} 
                isSubmitting={addChoreMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search chores..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Chores List */}
      <div className="space-y-1">
        {filteredChores.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchQuery ? "No chores match your search" : "No chores found. Add your first chore!"}
          </div>
        ) : (
          filteredChores.map((chore: Chore) => (
            <ChoreCard
              key={chore.id}
              chore={chore}
              groupId={groupId}
              onEdit={handleEditChore}
            />
          ))
        )}
      </div>

      {/* Edit Chore Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Chore</DialogTitle>
          </DialogHeader>
          {choreToEdit && (
            <ChoreForm
              initialValues={{
                name: choreToEdit.name,
                points: choreToEdit.points,
                description: choreToEdit.description,
              }}
              onSubmit={(values) => 
                updateChoreMutation.mutate({
                  id: choreToEdit.id,
                  ...values,
                })
              }
              isSubmitting={updateChoreMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}