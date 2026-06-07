import { Github, Linkedin, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PublicationCard } from "@/components/publication-card";
import { featuredPublications } from "@/lib/mock-data";

type Props = { params: Promise<{ username: string }> };

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Card className="p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div className="grid h-24 w-24 place-items-center rounded-md bg-primary text-3xl font-bold text-primary-foreground">
              {username.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold">@{username}</h1>
              <p className="mt-2 max-w-2xl text-muted-foreground">Student researcher building practical AI and social impact projects.</p>
              <div className="mt-3 flex gap-2 text-muted-foreground">
                <Linkedin size={18} />
                <Github size={18} />
              </div>
            </div>
          </div>
          <Button><UserPlus size={18} />Follow</Button>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {["Python", "Machine Learning", "Research Writing", "Data Visualization"].map((skill) => (
            <span key={skill} className="rounded-md bg-muted px-3 py-1 text-sm font-semibold">{skill}</span>
          ))}
        </div>
      </Card>
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {featuredPublications.map((publication) => (
          <PublicationCard key={publication.id} publication={publication} />
        ))}
      </div>
    </main>
  );
}
