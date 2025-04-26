"use client";


import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getUserGroups } from "@/app/actions";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

export function UserGroups() {
  const router = useRouter();
  
  // Use React Query to fetch the user's groups
  const { data, isLoading, isError } = useQuery({
    queryKey: ["userGroups"],
    queryFn: async () => {
      const result = await getUserGroups();
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch groups");
      }
      return result.data;
    }
  });
  
  const navigateToGroup = (groupId: number) => {
    router.push(`/group/${groupId}`);
  };
  
  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <CardTitle className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3"></CardTitle>
          <CardDescription className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-2/3 mt-2"></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (isError || !data) {
    return null; // Don't show anything if there's an error
  }
  
  if (data.length === 0) {
    return null; // Don't show anything if the user has no groups
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Groups</CardTitle>
        <CardDescription>{`Groups you've joined or created`}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.map((group) => (
            <Button
              key={group.id}
              variant="outline"
              className="w-full justify-between"
              onClick={() => navigateToGroup(group.id)}
            >
              <span className="truncate">{group.name}</span>
              <div className="flex items-center gap-1 text-neutral-500">
                <Users className="h-3 w-3" />
                {/* <span className="text-xs">{group.userGroups?.length || 0}</span> */}
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
