import { Instagram, Phone } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full mt-auto py-8 bg-muted/40">
      <div className="container mx-auto px-4 text-center text-foreground/80">
        <div className="flex items-center justify-center gap-6 mb-4">
          <Link href="#" className="hover:text-primary transition-colors">
            <Instagram className="h-6 w-6" />
            <span className="sr-only">Instagram</span>
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            <Phone className="h-6 w-6" />
            <span className="sr-only">Contact</span>
          </Link>
        </div>
        <p className="text-sm">&copy; 2026 SORTIFY. All rights reserved.</p>
      </div>
    </footer>
  );
}
