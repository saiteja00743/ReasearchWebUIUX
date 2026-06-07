import type { Metadata } from "next";
import Link from "next/link";
import { Bookmark, Download, Eye, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { featuredPublications } from "@/lib/mock-data";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const publication = featuredPublications.find((item) => item.slug === slug) ?? featuredPublications[0];
  return {
    title: publication.title,
    description: publication.abstract,
    openGraph: {
      title: publication.title,
      description: publication.abstract,
      type: "article"
    }
  };
}

export default async function PublicationPage({ params }: Props) {
  const { slug } = await params;
  const publication = featuredPublications.find((item) => item.slug === slug) ?? featuredPublications[0];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: publication.title,
    abstract: publication.abstract,
    author: { "@type": "Person", name: publication.author.name },
    datePublished: publication.publishedAt
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mb-5 text-sm font-semibold text-primary">{publication.category}</div>
      <h1 className="text-4xl font-bold leading-tight">{publication.title}</h1>
      <p className="mt-4 text-lg leading-8 text-muted-foreground">{publication.abstract}</p>
      <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <Link href={`/u/${publication.author.username}`} className="font-semibold text-slate-900">
          {publication.author.name}
        </Link>
        <span>{publication.author.university}</span>
        <span className="flex items-center gap-1"><Eye size={16} />{publication.views.toLocaleString()} views</span>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button><Download size={18} />Download PDF</Button>
        <Button variant="secondary"><Heart size={18} />Like</Button>
        <Button variant="secondary"><Bookmark size={18} />Bookmark</Button>
        <Button variant="secondary"><Share2 size={18} />Share</Button>
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="p-6">
          <h2 className="text-xl font-bold">Citation</h2>
          <p className="mt-3 rounded-md bg-muted p-4 text-sm leading-6">
            {publication.author.name}. (2026). {publication.title}. ResearchHub. https://researchhub.app/publication/{publication.slug}
          </p>
          <h2 className="mt-8 text-xl font-bold">Keywords</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {publication.tags.map((tag) => (
              <span key={tag} className="rounded-md bg-teal-50 px-2.5 py-1 text-sm font-semibold text-teal-800">{tag}</span>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="font-bold">Author profile</h2>
          <p className="mt-2 text-sm text-muted-foreground">{publication.author.name}</p>
          <p className="text-sm text-muted-foreground">{publication.author.university}</p>
          <Button className="mt-5 w-full" variant="secondary" asChild>
            <Link href={`/u/${publication.author.username}`}>View profile</Link>
          </Button>
        </Card>
      </div>
    </main>
  );
}
