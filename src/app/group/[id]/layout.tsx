"use client";

import { GroupNavigationDesktop } from "@/components/GroupNavigation";
import MobileBottomNav from "@/components/MobileBottomNav";
import MobileHeader from "@/components/MobileHeader";

export default function GroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Desktop Navigation - Only visible on desktop, fixed on left */}
      <div className="hidden md:block w-64 flex-shrink-0 border-r border-border">
        <div className="sticky top-0 h-screen overflow-y-auto">
          <GroupNavigationDesktop />
        </div>
      </div>
      
      {/* Main Content - Full width on mobile, partial width on desktop */}
      <div className="flex-1 overflow-y-auto pb-16 md:pb-0">
        {/* Mobile Header - Only visible on mobile */}
        <MobileHeader />
        
        {children}
        
        {/* Mobile Bottom Navigation - Only visible on mobile */}
        <MobileBottomNav />
      </div>
    </div>
  );
}