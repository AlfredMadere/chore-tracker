"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getChoresForGroup, addChore, deleteChore, updateChore } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Plus, Trash2, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type Chore = {
  id: number;
  name: string;
  points: number;
  description: string;
  groupId: number;
};

// Zod schema for chore form validation
const choreSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  points: z.number().min(1, { message: "Points must be at least 1" }),
  description: z.string().default("")
});

type ChoreFormData = z.infer<typeof choreSchema>;

export default function EditChoresPage() {
  const params = useParams();
  const groupId = params.id as string;
  
  const [chores, setChores] = useState<Chore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [selectedChore, setSelectedChore] = useState<Chore | null>(null);
  
  // Form for adding new chores
  const addForm = useForm<ChoreFormData>({
    resolver: zodResolver(choreSchema) as any,
    defaultValues: {
      name: "",
      points: 1,
      description: ""
    }
  });
  
  // Form for editing existing chores
  const editForm = useForm<ChoreFormData>({
    resolver: zodResolver(choreSchema) as any,
    defaultValues: {
      name: "",
      points: 1,
      description: ""
    }
  });
  
  // Fetch chores
  useEffect(() => {
    async function fetchChores() {
      setLoading(true);
      const result = await getChoresForGroup(groupId);
      
      if (result.success) {
        setChores(result.data || []);
        setError("");
      } else {
        setError(result.error || "Failed to load chores");
      }
      
      setLoading(false);
    }
    
    fetchChores();
  }, [groupId]);
  
  // Handle adding a new chore
  const addMutation = useMutation<
    { success: boolean; data?: any; error?: string },
    Error,
    ChoreFormData
  >({
    mutationFn: async (data: ChoreFormData) => {
      return await addChore(groupId, data.name, data.points, data.description);
    },
    onSuccess: (result) => {
      if (result.success && result.data) {
        setChores(prev => [...prev, result.data]);
        toast.success("Chore added successfully!");
        addForm.reset();
        setIsAddDialogOpen(false);
      } else {
        toast.error(result.error || "Failed to add chore");
      }
    },
    onError: (error) => {
      toast.error("An error occurred while adding the chore");
      console.error("Error adding chore:", error);
    }
  });
  
  const onAddSubmit = addForm.handleSubmit((data) => {
    addMutation.mutate(data);
  });
  
  // Handle editing a chore
  const editMutation = useMutation<
    { success: boolean; data?: any; error?: string },
    Error,
    ChoreFormData & { id: number }
  >({
    mutationFn: async (data: ChoreFormData & { id: number }) => {
      return await updateChore(data.id, data.name, data.points, data.description);
    },
    onSuccess: (result) => {
      if (result.success && result.data) {
        setChores(prev => prev.map(chore => 
          chore.id === result.data.id ? result.data : chore
        ));
        toast.success("Chore updated successfully!");
        editForm.reset();
        setIsEditDialogOpen(false);
        setSelectedChore(null);
      } else {
        toast.error(result.error || "Failed to update chore");
      }
    },
    onError: (error) => {
      toast.error("An error occurred while updating the chore");
      console.error("Error updating chore:", error);
    }
  });
  
  const onEditSubmit = editForm.handleSubmit((data) => {
    if (selectedChore) {
      editMutation.mutate({ ...data, id: selectedChore.id });
    }
  });
  
  // Open edit dialog and populate form with chore data
  const handleEditChore = (chore: Chore) => {
    setSelectedChore(chore);
    editForm.reset({
      name: chore.name,
      points: chore.points,
      description: chore.description
    });
    setIsEditDialogOpen(true);
  };
  
  // Handle deleting a chore
  const deleteMutation = useMutation<
    { success: boolean; error?: string },
    Error,
    number
  >({
    mutationFn: async (choreId: number) => {
      return await deleteChore(choreId);
    },
    onSuccess: (result, choreId) => {
      if (result.success) {
        setChores(prev => prev.filter(chore => chore.id !== choreId));
        toast.success("Chore deleted successfully!");
      } else {
        toast.error(result.error || "Failed to delete chore");
      }
    },
    onError: (error) => {
      toast.error("An error occurred while deleting the chore");
      console.error("Error deleting chore:", error);
    },
    onSettled: () => {
      setIsDeleting(null);
    }
  });
  
  const handleDeleteChore = (choreId: number) => {
    setIsDeleting(choreId);
    deleteMutation.mutate(choreId);
  };
  
  if (loading) {
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
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-2xl font-bold">Edit Chores</h1>
          
          {/* Add Chore Button */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Chore
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Chore</DialogTitle>
                <DialogDescription>
                  Create a new chore for your group. Fill out the details below.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={onAddSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="name"
                        placeholder="Enter chore name"
                        {...addForm.register("name")}
                      />
                      {addForm.formState.errors.name && (
                        <p className="text-sm text-red-500 mt-1">{addForm.formState.errors.name.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="points" className="text-right">
                      Points
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="points"
                        type="number"
                        min="1"
                        placeholder="Enter points value"
                        {...addForm.register("points", { valueAsNumber: true })}
                      />
                      {addForm.formState.errors.points && (
                        <p className="text-sm text-red-500 mt-1">{addForm.formState.errors.points.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <div className="col-span-3">
                      <Textarea
                        id="description"
                        placeholder="Enter chore description (optional)"
                        {...addForm.register("description")}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={addMutation.isPending}>
                    {addMutation.isPending ? "Adding..." : "Add Chore"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          
          {/* Edit Chore Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Chore</DialogTitle>
                <DialogDescription>
                  Update the details of this chore.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={onEditSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-name" className="text-right">
                      Name
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="edit-name"
                        placeholder="Enter chore name"
                        {...editForm.register("name")}
                      />
                      {editForm.formState.errors.name && (
                        <p className="text-sm text-red-500 mt-1">{editForm.formState.errors.name.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-points" className="text-right">
                      Points
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="edit-points"
                        type="number"
                        min="1"
                        placeholder="Enter points value"
                        {...editForm.register("points", { valueAsNumber: true })}
                      />
                      {editForm.formState.errors.points && (
                        <p className="text-sm text-red-500 mt-1">{editForm.formState.errors.points.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-description" className="text-right">
                      Description
                    </Label>
                    <div className="col-span-3">
                      <Textarea
                        id="edit-description"
                        placeholder="Enter chore description (optional)"
                        {...editForm.register("description")}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={editMutation.isPending}>
                    {editMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Error message (for fetch errors only) */}
        {error && (
          <div className="mb-4 p-3 border rounded-md border-destructive/50 bg-destructive/10 text-destructive">
            {error}
          </div>
        )}
        
        {/* Chores Grid */}
        {chores.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-muted/30 rounded-lg p-8 max-w-md">
              <h3 className="text-lg font-medium mb-2">No chores yet</h3>
              <p className="text-muted-foreground mb-6">Click the "Add Chore" button above to create your first chore.</p>
              <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" /> Add Your First Chore
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {chores.map((chore) => (
              <Card key={chore.id} className="flex flex-col h-full border border-border">
                <CardContent className="flex-grow p-4 pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-foreground truncate">{chore.name}</h3>
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {chore.points} points
                    </span>
                  </div>
                  {chore.description && (
                    <div className="mt-2 text-sm text-muted-foreground line-clamp-3 overflow-hidden">
                      {chore.description}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="p-4 pt-4 mt-auto">
                  <div className="w-full flex flex-row gap-2 justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditChore(chore)}
                      disabled={isDeleting === chore.id || editMutation.isPending}
                      className="flex-1 flex items-center justify-center"
                    >
                      <Pencil className="h-4 w-4 mr-1.5" />
                      <span>Edit</span>
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteChore(chore.id)}
                      disabled={isDeleting === chore.id}
                      className="flex-1 flex items-center justify-center"
                    >
                      {isDeleting === chore.id ? (
                        <>
                          <div className="mr-1.5 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground"></div>
                          <span>Deleting...</span>
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-1.5" />
                          <span>Remove</span>
                        </>
                      )}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        </CardContent>
      </Card>
    </div>
  );
}
