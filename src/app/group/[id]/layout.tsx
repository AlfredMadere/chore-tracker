"use client";

import { GroupNavigationDesktop, GroupNavigationMobile } from "@/components/GroupNavigation";

export default function GroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Mobile Navigation - Only visible on mobile, sticky at top */}
      <div className="md:hidden sticky top-0 z-40 w-full bg-background border-b border-border">
        <GroupNavigationMobile />
      </div>
      
      {/* Desktop Navigation - Only visible on desktop, fixed on left */}
      <div className="hidden md:block w-64 flex-shrink-0 border-r border-border">
        <div className="sticky top-0 h-screen overflow-y-auto">
          <GroupNavigationDesktop />
        </div>
      </div>
      
      {/* Main Content - Full width on mobile, partial width on desktop */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}