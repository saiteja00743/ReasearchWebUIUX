import Link from "next/link";
import { Bookmark, Download, Eye, Heart } from "lucide-react";
import type { PublicationCard as PublicationCardType } from "@researchhub/shared";
import { Card } from "@/components/ui/card";

export function PublicationCard({ publication }: { publication: PublicationCardType }) {
  return (
    <Card className="flex h-full flex-col gap-4 p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-md bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800">{publication.category}</span>
        <span className="text-xs text-muted-foreground">{new Date(publication.publishedAt).toLocaleDateString()}</span>
      </div>
      <div>
        <Link href={`/publication/${publication.slug}`} className="text-lg font-bold leading-snug hover:text-primary">
          {publication.title}
        </Link>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{publication.abstract}</p>
      </div>
      <div className="mt-auto flex flex-wrap gap-2">
        {publication.tags.map((tag) => (
          <span key={tag} className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
        <Link href={`/u/${publication.author.username}`} className="font-semibold text-slate-800">
          {publication.author.name}
        </Link>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><Eye size={14} />{publication.views.toLocaleString()}</span>
          <span className="flex items-center gap-1"><Download size={14} />{publication.downloads.toLocaleString()}</span>
          <span className="flex items-center gap-1"><Heart size={14} />{publication.likes.toLocaleString()}</span>
          <Bookmark size={14} />
        </div>
      </div>
    </Card>
  );
}
