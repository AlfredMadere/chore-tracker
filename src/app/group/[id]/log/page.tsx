"use client";

import { Chore as PrismaChore } from "@/generated/prisma";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getChoresForGroup, logChore } from "./actions";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

// Use a type that matches what we get from the server
type Chore = Pick<PrismaChore, 'id' | 'name' | 'points' | 'groupId'>;

export default function ChoreLogPage() {
  const params = useParams();
  const groupId = params.id as string;
  
 
  
  const [chores, setChores] = useState<Chore[]>([]);
  const [filteredChores, setFilteredChores] = useState<Chore[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loggingChore, setLoggingChore] = useState<number | null>(null);
  const [completedChores, setCompletedChores] = useState<number[]>([]);
  
  // Fetch chores
  useEffect(() => {
    async function fetchChores() {
      setLoading(true);
      const result = await getChoresForGroup(groupId);
      
      if (result.success) {
        setChores(result.data || []);
        setFilteredChores(result.data || []);
        setError("");
      } else {
        setError(result.error || "Failed to load chores");
      }
      
      setLoading(false);
    }
    
    fetchChores();
  }, [groupId]);
  
  // Filter chores based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredChores(chores);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = chores.filter(chore => 
        chore.name.toLowerCase().includes(query)
      );
      setFilteredChores(filtered);
    }
  }, [searchQuery, chores]);
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle logging a chore
  const handleLogChore = async (choreId: number) => {
    setLoggingChore(choreId);
    
    // Check if user is authenticated
    
    try {
      const result = await logChore(choreId, parseInt(groupId));
      
      if (result.success) {
        toast.success("Chore logged successfully!");
        setCompletedChores(prev => [...prev, choreId]);
      } else {
        toast.error(result.error || "Failed to log chore");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "An error occurred while logging the chore");
    }
    
    setLoggingChore(null);
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Chores</h1>
          
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-white"
              placeholder="Search chores"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        
        {/* No inline success/error messages - using toast notifications instead */}
        
        {/* Chores List */}
        {filteredChores.length === 0 ? (
          <div className="text-center py-12">
            {searchQuery ? (
              <p className="text-gray-500 dark:text-gray-400">No chores match your search</p>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No chores have been added yet</p>
            )}
          </div>
        ) : (
          <div className="overflow-hidden rounded-md border border-gray-200 dark:border-gray-800">
            <ul className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredChores.map((chore) => (
                <li key={chore.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{chore.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{chore.points} points</p>
                  </div>
                  {completedChores.includes(chore.id) ? (
                    <Button 
                      variant="outline" 
                      className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                      disabled
                    >
                      <Check className="h-4 w-4 mr-2" /> Completed
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleLogChore(chore.id)}
                      disabled={loggingChore === chore.id}
                      variant="default"
                    >
                      {loggingChore === chore.id ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        "Did it!"
                      )}
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
