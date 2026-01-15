import Link from 'next/link';
import { Recycle, Gem, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Recycle className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block font-headline">
            SORTIFY
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm lg:gap-6">
          <Link
            href="/"
            className="transition-colors hover:text-foreground/80 text-foreground"
          >
            Home
          </Link>
          <Link
            href="/activity"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Activity
          </Link>
          <Link
            href="/rewards"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Rewards
          </Link>
           <Link
            href="/dashboard"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Dashboard
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end gap-2">
           <Button asChild size="sm" variant="secondary">
            <Link href="/rewards">
              <Gem className="mr-2 h-4 w-4" />
              <span>150 Points</span>
            </Link>
          </Button>
          <Button asChild size="icon" variant="ghost">
            <Link href="/profile">
              <User />
              <span className="sr-only">Profile</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
