import Link from "next/link";
import { BookOpen, Search, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground">
            <BookOpen size={20} />
          </span>
          ResearchHub
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <Link href="/discover">Discover</Link>
          <Link href="/publish">Publish</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/admin">Admin</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/discover" aria-label="Search research">
              <Search size={18} />
            </Link>
          </Button>
          <Button asChild>
            <Link href="/publish">
              <Upload size={18} />
              Publish
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
