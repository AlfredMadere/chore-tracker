import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { joinGroupById } from "./actions";

type GroupJoinPageParams = {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function JoinGroupPage({ params }: GroupJoinPageParams) {
  // Validate user is authenticated
  const session = await auth();
  
  if (!session?.user) {
    // Redirect to sign in page with callback URL
    redirect(`/signin?callbackUrl=/group/join/${(await params).id}`);
  }
  
  // Call server action to join the group
  const result = await joinGroupById((await params).id);
  
  if (!result.success) {
    // If there's an error, redirect to home page
    // In a real app, you might want to show an error page
    console.error("Error joining group:", result.error);
    redirect("/");
  }
  
  // Redirect to the group page
  redirect(`/group/${result.data?.groupId}`);
  return null;
}