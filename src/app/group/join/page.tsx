"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { joinGroupByCode } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function JoinGroupPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/signin?callbackUrl=/group/join`);
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
        <Card className="w-full max-w-md animate-pulse">
          <CardHeader>
            <div className="h-7 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-full"></div>
          </CardHeader>
          <CardContent>
            <div className="h-10 bg-neutral-200 dark:bg-neutral-800 rounded w-full"></div>
          </CardContent>
          <CardFooter>
            <div className="h-10 bg-neutral-200 dark:bg-neutral-800 rounded w-1/4"></div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("joinCode", joinCode);

      const result = await joinGroupByCode(formData);

      if (result.success && result.data) {
        router.push(`/group/${result.data.groupId}`);
      } else {
        setError(result.error || "Failed to join group");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Join a Group</CardTitle>
          <CardDescription>
            Enter the join code provided by the group admin
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="joinCode"
                  placeholder="Enter join code"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  required
                  className="w-full"
                  autoComplete="off"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || !joinCode.trim()}
              >
                {isSubmitting ? "Joining..." : "Join Group"}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}