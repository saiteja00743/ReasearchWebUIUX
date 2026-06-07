import Link from "next/link";
import { ArrowRight, BadgeCheck, BarChart3, BookOpen, FileText, Search, Sparkles, Users } from "lucide-react";
import { researchCategories } from "@researchhub/shared";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PublicationCard } from "@/components/publication-card";
import { featuredPublications } from "@/lib/mock-data";

const features = [
  { icon: FileText, title: "Permanent publication links", text: "Turn final-year reports, articles, and project PDFs into resume-ready public pages." },
  { icon: Users, title: "Research profiles", text: "Show bio, skills, social links, followers, and every publication in one credible portfolio." },
  { icon: Sparkles, title: "AI writing assistant", text: "Generate abstracts, summaries, keywords, and citations before publishing." },
  { icon: BarChart3, title: "Student analytics", text: "Track views, downloads, bookmarks, and discovery signals from your dashboard." }
];

export default function HomePage() {
  return (
    <main>
      <section className="border-b border-border bg-white">
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1 text-sm font-semibold text-muted-foreground">
              <BadgeCheck size={16} className="text-primary" />
              Free publishing for student research
            </div>
            <h1 className="max-w-4xl text-5xl font-bold tracking-normal text-slate-950 sm:text-6xl">
              ResearchHub
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-8 text-muted-foreground">
              The easiest way for students to publish and showcase research, projects, and technical articles.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <Link href="/publish">
                  Publish for free
                  <ArrowRight size={18} />
                </Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/discover">
                  <Search size={18} />
                  Explore research
                </Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-4">
            {featuredPublications.slice(0, 2).map((publication) => (
              <PublicationCard key={publication.id} publication={publication} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="p-5">
              <feature.icon className="mb-4 text-primary" size={26} />
              <h2 className="text-lg font-bold">{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-slate-950 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <BookOpen className="text-accent" />
              <h2 className="mt-4 text-3xl font-bold">Research categories students already publish in</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {researchCategories.map((category) => (
                <Link key={category} href={`/discover?category=${encodeURIComponent(category)}`} className="rounded-md border border-white/10 px-4 py-3 text-sm font-semibold hover:border-accent">
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-4">
          {[
            ["52K+", "student authors"],
            ["118K+", "published works"],
            ["9.4M", "research views"],
            ["1.8M", "PDF downloads"]
          ].map(([value, label]) => (
            <div key={label} className="border-l-4 border-primary bg-white p-6 shadow-sm">
              <div className="text-4xl font-bold">{value}</div>
              <div className="mt-2 text-sm font-semibold text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Loved by students building public proof of work</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {["My project finally had a clean link for LinkedIn.", "Recruiters could read my abstract without downloading anything.", "The AI citation tool saved my team hours before submission."].map((quote, index) => (
              <Card key={quote} className="p-6">
                <p className="text-sm leading-6 text-muted-foreground">"{quote}"</p>
                <p className="mt-4 font-semibold">Student author {index + 1}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-primary p-10 text-primary-foreground">
          <h2 className="text-3xl font-bold">Publish your first paper in minutes.</h2>
          <p className="mt-3 max-w-2xl text-primary-foreground/85">Upload a PDF, add your abstract, choose a category, and get a public publication page you can put on your resume today.</p>
          <Button className="mt-6 bg-white text-slate-950 hover:bg-slate-100" asChild>
            <Link href="/publish">Start publishing</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <span>ResearchHub</span>
          <span>Free student publishing, built for proof of work.</span>
        </div>
      </footer>
    </main>
  );
}
