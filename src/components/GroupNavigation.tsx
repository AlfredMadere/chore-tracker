"use client";

import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ReactNode, useState } from 'react';
import { Calendar, CheckCircle, Home, PencilLine, Menu } from 'lucide-react';
import { UserCard } from './UserCard';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

type NavItemProps = {
  href: string;
  icon: ReactNode;
  label: string;
  isActive: boolean;
};

function NavItem({ href, icon, label, isActive }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center px-3 py-3 mb-1 rounded-md group relative ${
        isActive
          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
    >
      <div className="flex items-center justify-center w-6 h-6">
        {icon}
      </div>
      <span className="hidden md:block ml-3 text-sm font-medium">{label}</span>
      
      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none md:hidden whitespace-nowrap">
        {label}
      </div>
    </Link>
  );
}

export  function GroupNavigationDesktop() {
  const params = useParams();
  const pathname = usePathname();
  const groupId = params.id as string;
  
  const navItems = [
    {
      href: `/group/${groupId}/log`,
      label: 'Log',
      icon: <CheckCircle className="h-5 w-5" />,
    },
    {
      href: `/group/${groupId}`,
      label: 'Home',
      icon: <Home className="h-5 w-5" />,
    },
    {
      href: `/group/${groupId}/chores`,
      label: 'Edit Chores',
      icon: <PencilLine className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex flex-col h-full w-full border-r border-gray-200 dark:border-gray-800 bg-background">
      <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-800">
        <Link href="/" className="flex items-center justify-center text-primary">
          <Calendar className="h-6 w-6" />
          <span className="ml-2 font-medium">ChoreTracker</span>
        </Link>
      </div>
      
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={pathname === item.href}
          />
        ))}
      </nav>
      
      <div className="mt-auto p-3 border-t border-gray-200 dark:border-gray-800">
        <UserCard />
      </div>
    </div>
  );
}

export function GroupNavigationMobile() {
  const params = useParams();
  const pathname = usePathname();
  const groupId = params.id as string;
  const [open, setOpen] = useState(false);
  
  const navItems = [
    {
      href: `/group/${groupId}/log`,
      label: 'Log',
      icon: <CheckCircle className="h-5 w-5" />,
    },
    {
      href: `/group/${groupId}`,
      label: 'Home',
      icon: <Home className="h-5 w-5" />,
    },
    {
      href: `/group/${groupId}/chores`,
      label: 'Edit Chores',
      icon: <PencilLine className="h-5 w-5" />,
    },
  ];
  
  return (
    <div className="w-full py-2 px-4 flex items-center justify-between bg-background">
      {/* Logo/Title */}
      <div className="flex items-center">
        <Calendar className="h-6 w-6 text-primary" />
        <span className="ml-2 font-medium">ChoreTracker</span>
      </div>
      
      {/* Menu Button */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button 
            size="icon" 
            variant="ghost"
            className="h-9 w-9"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="top" className="pt-10 px-4">
          <SheetHeader>
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-3 h-12"
                onClick={() => setOpen(false)}
                asChild
              >
                <Link href={item.href}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </Button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
  




