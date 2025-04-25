import { auth } from "@/auth";
import { AuthStatus } from "@/components/AuthStatus";
import { Button } from "@/components/ui/button";
import { UserGroups } from "@/components/UserGroups";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  
  async function handleCreateGroup() {
    "use server";
    if (!session) {
      return redirect("/signin");
    }
    return redirect("/create");
  }
  
  async function handleJoinGroup() {
    "use server";
    if (!session) {
      return redirect("/signin");
    }
    return redirect("/group/join");
  }
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black">
      {/* Auth Status Indicator */}
      <div className="absolute top-4 right-4">
        <AuthStatus />
      </div>
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-black dark:text-white mb-6">
            Track Chores, <span className="text-blue-600 dark:text-blue-400">Build Harmony</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-10">
            A simple way for roommates to equitably distribute household tasks and keep each other accountable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <form action={handleCreateGroup}>
              <Button 
                type="submit"
                className="cursor-pointer rounded-full bg-black dark:bg-white text-white dark:text-black px-6 py-3 font-medium text-base hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors inline-flex items-center justify-center"
              >
                Create a Group
              </Button>
            </form>
            <form action={handleJoinGroup}>
              <Button 
                type="submit"
                variant="outline"
                className="rounded-full border border-gray-300 dark:border-gray-700 px-6 py-3 font-medium text-base hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors inline-flex items-center justify-center"
              >
                Join a Group
              </Button>
            </form>
          </div>
          
          {/* User's Groups - Only shown when authenticated */}
          {session?.user && (
            <div className="w-full max-w-2xl mx-auto mt-8">
              <UserGroups />
            </div>
          )}
        </div>
      </main>
      
      <footer className="py-8 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 dark:text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Chore Tracker. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
