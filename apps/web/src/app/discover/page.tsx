import { Search } from "lucide-react";
import { researchCategories } from "@researchhub/shared";
import { PublicationCard } from "@/components/publication-card";
import { featuredPublications } from "@/lib/mock-data";

export const metadata = { title: "Discover Research" };

export default function DiscoverPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold">Discover student research</h1>
          <p className="mt-3 text-muted-foreground">Search by keyword, author, category, trending, latest, and most downloaded.</p>
        </div>
        <form className="flex min-w-0 max-w-xl flex-1 items-center gap-2 rounded-md border border-border bg-white px-3 py-2">
          <Search size={18} className="text-muted-foreground" />
          <input className="h-9 min-w-0 flex-1 outline-none" placeholder="Search AI, IoT, placement prediction..." />
        </form>
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        {researchCategories.map((category) => (
          <button key={category} className="rounded-md border border-border bg-white px-3 py-2 text-sm font-semibold hover:border-primary">
            {category}
          </button>
        ))}
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {featuredPublications.map((publication) => (
          <PublicationCard key={publication.id} publication={publication} />
        ))}
      </div>
    </main>
  );
}
