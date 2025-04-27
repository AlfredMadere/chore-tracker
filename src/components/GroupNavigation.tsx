"use client";

import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ReactNode } from 'react';
import { Calendar, CheckCircle, Home, PencilLine } from 'lucide-react';
import { UserCard } from './UserCard';

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
      
      {/* Tooltip for mobile */}
      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none md:hidden whitespace-nowrap">
        {label}
      </div>
    </Link>
  );
}

export default function GroupNavigation() {
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
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-800">
        <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
          {/* Placeholder logo */}
          <Link href={`/`} className="flex items-center justify-center">
            <Calendar className="h-8 w-8" />
            <span className="hidden md:block ml-2">ChoreTracker</span>
          </Link>
        </div>
      </div>
      
      {/* Navigation Items */}
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
      
      {/* User Card */}
      <div className="mt-auto p-3 border-t border-gray-200 dark:border-gray-800">
        <UserCard />
      </div>
    </div>
  );
}
