"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { createGroup } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function CreateGroupPage() {
  const router = useRouter();
  const { status } = useSession();
  const [groupName, setGroupName] = useState("");
  const [error, setError] = useState("");
  
  // Redirect to sign in page if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);
  
  // Use useMutation to call the server action for creating a group
  const createGroupMutation = useMutation({
    mutationFn: async (name: string) => {
      const result = await createGroup(name);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (data) => {
      // Redirect to the new group page
      if (data && data.id) {
        router.push(`/group/${data.id}`);
      }
    },
    onError: (error: Error) => {
      setError(error.message || "Failed to create group");
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!groupName.trim()) {
      setError("Group name is required");
      return;
    }
    
    setError("");
    createGroupMutation.mutate(groupName);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create a New Group</CardTitle>
          <CardDescription>
            Start tracking chores with your roommates
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="groupName">
                  Group Name
                </Label>
                <Input
                  id="groupName"
                  placeholder="Enter a name for your group"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  autoFocus
                />
              </div>
              
              {error && (
                <div className="p-3 text-sm border rounded-md border-destructive/50 bg-destructive/10 text-destructive">
                  {error}
                </div>
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={createGroupMutation.isPending}
              >
                {createGroupMutation.isPending ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground"></div>
                    Creating...
                  </>
                ) : (
                  "Create Group"
                )}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
