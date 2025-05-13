"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getGroupById, updateGroupName, updateGroupAgreement } from "../actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Users, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// Using a simpler type approach with any for React Query

export default function SettingsPage() {
  const params = useParams();
  const groupId = params.id as string;
  const queryClient = useQueryClient();
  
  // Form states
  const [groupName, setGroupName] = React.useState("");
  const [agreement, setAgreement] = React.useState("");
  
  // Fetch group data
  const { data: group, isLoading } = useQuery({
    queryKey: ["group", groupId],
    queryFn: async () => {
      const result = await getGroupById(parseInt(groupId));
      if (!result.success) {
        throw new Error(result.error || "Failed to load group");
      }
      return result.data;
    }
  });
  
  // Update form values when data is loaded
  React.useEffect(() => {
    if (group) {
      setGroupName(group.name || "");
      setAgreement(group.agreement || "");
    }
  }, [group]);
  
  // Update group name mutation
  const updateNameMutation = useMutation({
    mutationFn: async () => {
      const result = await updateGroupName(groupId, groupName);
      if (!result.success) {
        throw new Error(result.error || "Failed to update group name");
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success("Group name updated successfully");
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update group name");
    }
  });
  
  // Update group agreement mutation
  const updateAgreementMutation = useMutation({
    mutationFn: async () => {
      const result = await updateGroupAgreement(groupId, agreement);
      if (!result.success) {
        throw new Error(result.error || "Failed to update group agreement");
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success("Group agreement updated successfully");
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update group agreement");
    }
  });
  
  // Handle form submissions
  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (groupName.trim() === "") {
      toast.error("Group name cannot be empty");
      return;
    }
    updateNameMutation.mutate();
  };
  
  const handleAgreementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAgreementMutation.mutate();
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>General</span>
          </TabsTrigger>
          <TabsTrigger value="agreement" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Agreement</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Group Settings</CardTitle>
              <CardDescription>
                Update your group's name and other general settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form id="name-form" onSubmit={handleNameSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="group-name" className="text-sm font-medium">
                    Group Name
                  </label>
                  <Input
                    id="group-name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Enter group name"
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                form="name-form"
                disabled={updateNameMutation.isPending || groupName === group?.name}
              >
                {updateNameMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Members</CardTitle>
                <CardDescription>
                  People in this group ({group?.userGroups?.length || 0})
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {group?.userGroups?.map((userGroup) => (
                    <div key={userGroup.userId} className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                        {userGroup.user.name?.[0] || userGroup.user.email?.[0] || '?'}
                      </div>
                      <div>
                        <p className="font-medium">{userGroup.user.name || 'Unknown'}</p>
                        <p className="text-sm text-muted-foreground">{userGroup.user.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="agreement" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Group Agreement</CardTitle>
              <CardDescription>
                Set the rules and guidelines for your group.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form id="agreement-form" onSubmit={handleAgreementSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="agreement" className="text-sm font-medium">
                    Agreement Text
                  </label>
                  <Textarea
                    id="agreement"
                    value={agreement}
                    onChange={(e) => setAgreement(e.target.value)}
                    placeholder="Enter your group agreement..."
                    rows={8}
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                form="agreement-form"
                disabled={updateAgreementMutation.isPending || agreement === group?.agreement}
              >
                {updateAgreementMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : "Save Agreement"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}