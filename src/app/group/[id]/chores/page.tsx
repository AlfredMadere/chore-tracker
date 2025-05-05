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
          <div className="text-center py-12">
            <p className="text-muted-foreground">No chores have been added yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {chores.map((chore) => (
              <Card key={chore.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-1">{chore.name}</h3>
                  <p className="text-sm text-muted-foreground">{chore.points} points</p>
                  {chore.description && (
                    <p className="text-sm mt-2 text-muted-foreground">{chore.description}</p>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between p-4 pt-0">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditChore(chore)}
                    disabled={isDeleting === chore.id || editMutation.isPending}
                    className="flex items-center gap-1"
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeleteChore(chore.id)}
                    disabled={isDeleting === chore.id}
                    className="flex items-center gap-1"
                  >
                    {isDeleting === chore.id ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground"></div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </>
                    )}
                  </Button>
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
