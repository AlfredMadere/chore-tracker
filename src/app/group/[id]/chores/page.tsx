"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getChoresForGroup, addChore, deleteChore } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Chores</h1>
          
          {/* Add Chore Button */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
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
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md text-green-800 dark:text-green-400">
            {successMessage}
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-800 dark:text-red-400">
            {error}
          </div>
        )}
        
        {/* Chores Grid */}
        {chores.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No chores have been added yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {chores.map((chore) => (
              <Card key={chore.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">{chore.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{chore.points} points</p>
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
                        <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        Remove
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
