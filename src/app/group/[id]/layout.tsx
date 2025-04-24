import GroupNavigation from "@/components/GroupNavigation";

export default function GroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Navigation Sidebar */}
      <div className="w-16 md:w-56 flex-shrink-0">
        <GroupNavigation />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
