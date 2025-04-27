"use client";

import { useQuery } from "@tanstack/react-query";
import { getGroupCount } from "@/app/actions/group-actions";
import { toast } from "sonner";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

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
    <div className="inline-flex items-center gap-2 bg-neutral-100 dark:bg-neutral-900 rounded-full px-4 py-2 text-sm font-medium">
      <div className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
      </div>
      <span>
        {isLoading ? (
          "Counting households..."
        ) : error ? (
          "Error loading count"
        ) : (
          <>Keeping <strong>{data?.count || 0}</strong> households harmonious</>
        )}
      </span>
    </div>
  );
}
