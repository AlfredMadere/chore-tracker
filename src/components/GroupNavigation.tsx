"use client";

import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ReactNode, useState, useEffect } from 'react';
import { getUserFromStorage } from '@/lib/userStorage';
import { Calendar, CheckCircle, Home, PencilLine } from 'lucide-react';

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
  
  const [user, setUser] = useState<{ id: number; email: string; name?: string } | null>(null);
  
  // Get user from localStorage on component mount and when window is focused
  useEffect(() => {
    const updateUser = () => {
      const currentUser = getUserFromStorage();
      setUser(currentUser);
    };
    
    // Initial load
    updateUser();
    
    // Update when window is focused (in case user changed in another tab)
    window.addEventListener('focus', updateUser);
    
    return () => {
      window.removeEventListener('focus', updateUser);
    };
  }, []);
  
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
        {user ? (
          <div className="flex flex-col p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.name || user.email.split('@')[0]}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <Link 
              href={`/join/${groupId}`} 
              className="mt-2 text-xs text-center text-blue-600 dark:text-blue-400 hover:underline"
            >
              Switch User
            </Link>
          </div>
        ) : (
          <Link
            href={`/join/${groupId}`}
            className="flex items-center justify-center p-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
            </svg>
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}
