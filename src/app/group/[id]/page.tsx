"use client";

import { useState, useEffect, useTransition } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getGroupById, updateGroupName, getPointsPerUser, updateGroupAgreement } from "./actions";
import { toast } from "sonner";
import ChorePointsChart from "@/components/ChorePointsChart";
import ChoreLogList from "@/components/ChoreLogList";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pencil, Share, Save, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Agreement form schema
const agreementSchema = z.object({
  agreement: z.string().max(2000, "Agreement text must be less than 2000 characters")
});

type AgreementFormData = z.infer<typeof agreementSchema>;

export default function GroupPage() {
  const params = useParams();
  const groupId = params.id as string;
  
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingAgreement, setIsEditingAgreement] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [error, setError] = useState("");
  const [choreLogs, setChoreLogs] = useState<any[]>([]);
  
  // Agreement form
  const agreementForm = useForm<AgreementFormData>({
    resolver: zodResolver(agreementSchema) as any,
    defaultValues: {
      agreement: ""
    }
  });
  
  // Use React Query to fetch group data
  const { 
    data: group, 
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["group", groupId],
    queryFn: async () => {
      const result = await getGroupById(groupId);
      if (!result.success) {
        throw new Error(result.error || "Failed to load group");
      }
      return result.data;
    }
  });
  
  // Set edited name, chore logs, and agreement when group data is available
  useEffect(() => {
    if (group) {
      setEditedName(group.name || "");
      setChoreLogs(group.ChoreLog || []);
      agreementForm.reset({ agreement: group.agreement || "" });
    }
  }, [group, agreementForm]);
  
  // Use React Query mutation for updating group name
  const updateGroupMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string, name: string }) => {
      const result = await updateGroupName(id, name);
      if (!result.success) {
        throw new Error(result.error || "Failed to update group name");
      }
      return result.data;
    },
    onSuccess: () => {
      setIsEditing(false);
      refetch(); // Refresh group data
      toast.success("Group name updated successfully");
    },
    onError: (err: unknown) => {
      setError(err instanceof Error ? err.message : "Failed to update group name");
      toast.error("Failed to update group name");
    }
  });
  
  // Use React Query mutation for updating group agreement
  const updateAgreementMutation = useMutation({
    mutationFn: async (agreement: string) => {
      const result = await updateGroupAgreement(groupId, agreement);
      if (!result.success) {
        throw new Error(result.error || "Failed to update group agreement");
      }
      return result.data;
    },
    onSuccess: () => {
      setIsEditingAgreement(false);
      refetch(); // Refresh group data
      toast.success("Group agreement updated successfully");
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Failed to update group agreement");
    }
  });
  
  // Handle agreement form submission
  const onAgreementSubmit = agreementForm.handleSubmit((data) => {
    updateAgreementMutation.mutate(data.agreement);
  });
  
  // Handle name edit
  const handleNameEdit = () => {
    if (!editedName.trim()) return;
    updateGroupMutation.mutate({ id: groupId, name: editedName });
  };
  
  // Copy invite link to clipboard
  const copyInviteLink = () => {
    // Use sharingId instead of groupId for more secure sharing links
    const sharingId = group?.sharingId;
    if (!sharingId) {
      setError("Sharing ID not available");
      return;
    }
    
    const inviteLink = `${window.location.origin}/group/join/${sharingId}`;
    navigator.clipboard.writeText(inviteLink)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 1000);
      })
      .catch(err => {
        console.error("Failed to copy link:", err);
        setError("Failed to copy link to clipboard");
      });
  };
  
  // Handle chore log deletion
  const handleChoreLogDeleted = (choreLogId: number) => {
    // Update the local state to remove the deleted log
    setChoreLogs(prevLogs => prevLogs.filter(log => log.id !== choreLogId));
    // Refresh the points chart data
    refetch();
  };
  
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8">
          <Card>
            <CardContent className="pt-6 flex justify-center items-center min-h-[200px]">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/10 border-t-primary"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-destructive">
          <CardContent className="pt-6 text-center">
            <h2 className="text-lg font-medium text-destructive mb-2">Error</h2>
            <p className="text-destructive/80">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!group) {
    return null;
  }
  
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 gap-8">
        {/* Group Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              {/* Group Name */}
              <div>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="max-w-xs"
                      autoFocus
                    />
                    <Button
                      onClick={handleNameEdit}
                      size="sm"
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditing(false);
                        setEditedName(group.name);
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">
                      {group.name}
                    </h1>
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      aria-label="Edit group name"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Share Link */}
              <div className="flex justify-end">
                <div className="relative">
                  <Button
                    onClick={copyInviteLink}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Share className="h-4 w-4" />
                    Share Group Link
                  </Button>
                  
                  {/* Copy Success Message */}
                  {copySuccess && (
                    <Badge variant="outline" className="absolute top-full right-0 mt-2 bg-green-100 text-green-800 border-green-200">
                      Link copied!
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      
        {/* Group Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">Members</p>
                <p className="text-2xl font-bold">{group.userGroups?.length || 0}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      
        {/* Chore Points Chart */}
        <ChorePointsChart groupId={groupId} getPointsPerUser={getPointsPerUser} />
      
        {/* Group Agreement */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Group Agreement</CardTitle>
              {!isEditingAgreement && (
                <Button
                  onClick={() => setIsEditingAgreement(true)}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label="Edit agreement"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
            </div>
            <CardDescription>
              Set expectations and rules for your group
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isEditingAgreement ? (
              <form onSubmit={onAgreementSubmit}>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Enter your group agreement here..."
                    className="min-h-[150px]"
                    {...agreementForm.register("agreement")}
                  />
                  {agreementForm.formState.errors.agreement && (
                    <p className="text-sm text-red-500">
                      {agreementForm.formState.errors.agreement.message}
                    </p>
                  )}
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsEditingAgreement(false);
                        agreementForm.reset({ agreement: group?.agreement || "" });
                      }}
                      className="flex items-center gap-1"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      className="flex items-center gap-1"
                      disabled={updateAgreementMutation.isPending}
                    >
                      {updateAgreementMutation.isPending ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {group?.agreement ? (
                  <div className="whitespace-pre-wrap">{group.agreement}</div>
                ) : (
                  <p className="text-muted-foreground italic">
                    No agreement has been set for this group. Click the edit button to add one.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Recent Activity */}
        <ChoreLogList 
          choreLogs={choreLogs} 
          maxHeight="400px" 
          onChoreLogDeleted={handleChoreLogDeleted} 
        />
      </div>
    </div>
  );
}