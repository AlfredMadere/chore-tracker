"use client";

import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { CheckCircle, Home, PencilLine, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

export default function MobileNav() {
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
    <div className="fixed bottom-4 right-4 z-50">
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            size="icon" 
            className="rounded-full shadow-lg h-12 w-12"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-xl px-4 py-6">
          <SheetHeader>
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-3 h-12"
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
