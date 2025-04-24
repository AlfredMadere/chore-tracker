"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { findGroupBySharingId } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function JoinPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get code from URL if provided
  const initialCode = searchParams.get("code") || "";
  
  const [joinCode, setJoinCode] = useState(initialCode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Use useMutation to call the server action for finding a group by sharing ID
  const findGroupMutation = useMutation({
    mutationFn: async (code: string) => {
      const result = await findGroupBySharingId(code);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (data) => {
      // Redirect to the join page for the specific group
      if (data && data.id) {
        router.push(`/join/${data.id}`);
      }
    },
    onError: (error: Error) => {
      setError(error.message || "Invalid join code. Please check and try again.");
      setIsLoading(false);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!joinCode.trim()) {
      setError("Please enter a join code");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    // Call the mutation with the join code
    findGroupMutation.mutate(joinCode);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Join a Group</CardTitle>
          <CardDescription>
            Enter the join code to connect with your roommates
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="joinCode" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Join Code
                </label>
                <Input
                  id="joinCode"
                  placeholder="Enter your join code"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  className="w-full"
                  autoFocus={!initialCode}
                />
              </div>
              
              {error && (
                <div className="p-3 text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-400 rounded-md">
                  {error}
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || findGroupMutation.isPending}
            >
              {(isLoading || findGroupMutation.isPending) ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Joining...
                </>
              ) : (
                "Join Group"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
