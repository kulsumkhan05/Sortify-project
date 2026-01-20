'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Recycle, LogIn, Menu, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function Header() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isLoggedIn = searchParams.has('email');
  const queryString = searchParams.toString();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/activity', label: 'Activity' },
    { href: '/rewards', label: 'Rewards' },
    { href: '/dashboard', label: 'Dashboard' },
  ];

  const profileLink = `/profile?${queryString}`;
  const homeLink = `/${queryString ? `?${queryString}` : ''}`;

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href={homeLink} className="mr-6 flex items-center space-x-2">
          <Recycle className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block font-headline">
            SORTIFY
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {navLinks.map(link => (
             <Link
              key={link.href}
              href={`${link.href}${queryString ? `?${queryString}` : ''}`}
              className="transition-colors hover:text-foreground/80 text-foreground/60 text-base"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end gap-2">
            {isLoggedIn ? (
              <div className="hidden md:flex items-center gap-2">
                 <Button asChild>
                  <Link href={profileLink}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
              </div>
            ) : (
              <Button asChild className="hidden md:flex">
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
            )}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="grid gap-4 py-6">
                  <Link href={homeLink} className="flex items-center space-x-2">
                     <Recycle className="h-6 w-6 text-primary" />
                    <span className="font-bold">SORTIFY</span>
                  </Link>
                  <nav className="grid gap-2">
                    {navLinks.map(link => (
                      <Link
                        key={link.href}
                        href={`${link.href}${queryString ? `?${queryString}` : ''}`}
                        className="flex w-full items-center py-2 text-lg font-semibold"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="flex flex-col gap-4 mt-4">
                     {isLoggedIn ? (
                        <>
                          <Button asChild>
                              <Link href={profileLink}>
                                  <User className="mr-2 h-4 w-4" />
                                  Profile
                              </Link>
                          </Button>
                          <Button variant="outline" onClick={handleLogout}>
                              <LogOut className="mr-2 h-4 w-4" />
                              Logout
                          </Button>
                        </>
                     ) : (
                        <Button asChild>
                            <Link href="/login">
                                <LogIn className="mr-2 h-4 w-4" />
                                Login / Sign Up
                            </Link>
                        </Button>
                     )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
