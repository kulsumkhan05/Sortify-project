import { Instagram, Phone } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full mt-auto py-8 bg-muted/40">
      <div className="container mx-auto px-4 text-center text-foreground/80">
        <p className="text-sm">&copy; 2026 SORTIFY. All rights reserved.</p>
        <div className="mt-4 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
          <Link
            href="https://instagram.com/sortify_app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 transition-colors hover:text-primary"
          >
            <Instagram className="h-5 w-5" />
            <span>@sortify_app</span>
          </Link>
          <a
            href="tel:+1234567890"
            className="flex items-center gap-2 transition-colors hover:text-primary"
          >
            <Phone className="h-5 w-5" />
            <span>+1 (234) 567-890</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
