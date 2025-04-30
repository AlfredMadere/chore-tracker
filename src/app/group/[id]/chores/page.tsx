"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getChoresForGroup, addChore, deleteChore } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
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

type Chore = {
  id: number;
  name: string;
  points: number;
  groupId: number;
};

type ChoreFormData = {
  name: string;
  points: number;
};

export default function EditChoresPage() {
  const params = useParams();
  const groupId = params.id as string;
  
  const [chores, setChores] = useState<Chore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ChoreFormData>();
  
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
  const onSubmit = async (data: ChoreFormData) => {
    const result = await addChore(groupId, data.name, data.points);
    
    if (result.success && result.data) {
      setChores(prev => [...prev, result.data]);
      setSuccessMessage("Chore added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      reset();
      setIsDialogOpen(false);
    } else {
      setError(result.error || "Failed to add chore");
      setTimeout(() => setError(""), 3000);
    }
  };
  
  // Handle deleting a chore
  const handleDeleteChore = async (choreId: number) => {
    setIsDeleting(choreId);
    
    const result = await deleteChore(choreId);
    
    if (result.success) {
      setChores(prev => prev.filter(chore => chore.id !== choreId));
      setSuccessMessage("Chore deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } else {
      setError(result.error || "Failed to delete chore");
      setTimeout(() => setError(""), 3000);
    }
    
    setIsDeleting(null);
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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="name"
                        placeholder="Enter chore name"
                        {...register("name", { required: "Name is required" })}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
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
                        {...register("points", { 
                          required: "Points are required",
                          valueAsNumber: true,
                          min: { value: 1, message: "Points must be at least 1" }
                        })}
                      />
                      {errors.points && (
                        <p className="text-sm text-red-500 mt-1">{errors.points.message}</p>
                      )}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Add Chore</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-4 p-3 border rounded-md border-green-200 bg-green-50/50 text-green-700 dark:border-green-900 dark:bg-green-900/20 dark:text-green-400">
            {successMessage}
          </div>
        )}
        
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
                </CardContent>
                <CardFooter className="flex justify-end p-4 pt-0">
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
