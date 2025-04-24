"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getGroupById, updateGroupName, getPointsPerUser } from "./actions";
import ChorePointsChart from "@/components/ChorePointsChart";
import ChoreLogList from "@/components/ChoreLogList";

export default function GroupPage() {
  const params = useParams();
  const groupId = params.id as string;
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [error, setError] = useState("");
  
  // Use React Query to fetch group data
  const { 
    data: group, 
    isLoading,
    error: queryError,
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
  
  // Set edited name when group data is available
  useEffect(() => {
    if (group) {
      setEditedName(group.name || "");
    }
  }, [group]);
  
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
    },
    onError: (err: any) => {
      setError(err.message || "Failed to update group name");
    }
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
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(err => {
        console.error("Failed to copy link:", err);
        setError("Failed to copy link to clipboard");
      });
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <h2 className="text-lg font-medium text-red-800 dark:text-red-400 mb-2">Error</h2>
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      </div>
    );
  }
  
  if (!group) {
    return null;
  }
  
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Group Header */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Group Name */}
          <div>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  autoFocus
                />
                <button
                  onClick={handleNameEdit}
                  className="text-sm px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedName(group.name);
                  }}
                  className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {group.name}
                </h1>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  aria-label="Edit group name"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          
          {/* Share Link */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <button
                onClick={copyInviteLink}
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                Share Group Link
              </button>
              
              {/* Copy Success Message */}
              {copySuccess && (
                <div className="absolute top-full left-0 mt-2 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-md">
                  Link copied!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Group Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Members</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{group.userGroups?.length || 0}</p>
        </div>
      </div>
      
      {/* Chore Points Histogram */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-8">
        <ChorePointsChart groupId={groupId} getPointsPerUser={getPointsPerUser} />
      </div>
      
      {/* Recent Chore Activity */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <ChoreLogList choreLogs={group.ChoreLog || []} maxHeight="400px" />
      </div>
    </div>
  );
}