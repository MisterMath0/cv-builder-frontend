'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from 'next/navigation';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { FileText } from "lucide-react";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // For hamburger and close icons
import { CardTitle } from "./ui/card";

const hideNavigationPaths = ['/login', '/register'];
const shouldHideNavigation = (pathname: string) => {
    // Direct matches
    if (hideNavigationPaths.includes(pathname)) return true;
    
    // Check if pathname starts with /cv/
    if (pathname.startsWith('/cv/')) return true;
    
    return false;
  };

export function MainNav() {
  const pathname = usePathname();
  const shouldShowNavigation = !shouldHideNavigation(pathname);
  const [menuOpen, setMenuOpen] = useState(false);

  if (!shouldShowNavigation) return null;

  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
          <img src="/favicon.ico" alt="Logo" className="w-12 h-12 mx-auto mb-2" />
            <CardTitle className="text-xl font-bold text-gray-800 dark:text-white">CV Builder</CardTitle>
          </Link>

          {/* Hamburger Menu Toggle */}
          <button
            className="md:hidden flex items-center justify-center p-2 text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Main Navigation (desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <NavigationMenu>
              <NavigationMenuList className="flex space-x-4">
                <NavigationMenuItem>
                  <Link href="/templates" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Templates
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/pricing" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Pricing
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/features" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Features
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Auth Buttons (desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden flex flex-col space-y-4 mt-4">
            <Link href="/templates" className="block text-gray-700">
              Templates
            </Link>
            <Link href="/pricing" className="block text-gray-700">
              Pricing
            </Link>
            <Link href="/features" className="block text-gray-700">
              Features
            </Link>
            <Link href="/login" className="block text-gray-700">
              Login
            </Link>
            <Link href="/register" className="block text-blue-600 font-bold">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
