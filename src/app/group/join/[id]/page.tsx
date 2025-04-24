import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { joinGroupById } from "./actions";

export default async function JoinGroupPage({ params }: { params: { id: string } }) {
  // Validate user is authenticated
  const session = await auth();
  
  if (!session?.user) {
    // Redirect to sign in page with callback URL
    redirect(`/signin?callbackUrl=/group/join/${params.id}`);
  }
  
  // Call server action to join the group
  const result = await joinGroupById(params.id);
  
  if (!result.success) {
    // If there's an error, redirect to home page
    // In a real app, you might want to show an error page
    console.error("Error joining group:", result.error);
    redirect("/");
  }
  
  // Redirect to the group page
  redirect(`/group/${result.data?.groupId}`);
}