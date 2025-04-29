export const runtime = "nodejs";

import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import GoogleProvider from "next-auth/providers/google"


export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || ""
    })
  ],
  callbacks: {
    // Ensure callback URLs are properly handled
    async redirect({ url, baseUrl }) {
      // If the URL starts with the base URL, it's safe to redirect
      if (url.startsWith(baseUrl)) return url;
      
      // Handle relative URLs (they start with /)
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      
      // Default fallback to the base URL
      return baseUrl;
    }
  },
  pages: {
    signIn: "/signin",
    // You can add other custom pages here if needed
  }
})  