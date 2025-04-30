"use client";

import { useQuery } from "@tanstack/react-query";
import { getGroupCount } from "@/app/actions/group-actions";
import { toast } from "sonner";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function GroupCounter() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["groupCount"],
    queryFn: async () => {
      const result = await getGroupCount();
      if (result.error) {
        throw new Error(result.error);
      }
      return result;
    }
  });

  useEffect(() => {
    if (error) {
      console.error("Group count error:", error);
      toast.error("Failed to load group count", {
        description: error instanceof Error ? error.message : String(error),
      });
    }
  }, [error]);

  return (
    <Badge variant="secondary" className="gap-2 py-1.5 px-4 text-sm">
      <div className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
      </div>
      <span>
        {isLoading ? (
          <Skeleton className="h-4 w-32 rounded-full" />
        ) : error ? (
          "Error loading count"
        ) : (
          <>Keeping <strong>{data?.count || 0}</strong> households harmonious</>
        )}
      </span>
    </Badge>
  );
}
