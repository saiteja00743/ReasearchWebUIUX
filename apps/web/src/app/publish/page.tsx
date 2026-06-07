import { FileUp, Image, Sparkles } from "lucide-react";
import { researchCategories } from "@researchhub/shared";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata = { title: "Publish Research" };

export default function PublishPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold">Publish research</h1>
      <p className="mt-3 text-muted-foreground">Create a permanent publication page with PDF, cover, metadata, citation, and author profile.</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <Card className="p-6">
          <form className="grid gap-5">
            <label className="grid gap-2 text-sm font-semibold">
              Title
              <input className="h-11 rounded-md border border-border px-3 font-normal" placeholder="Student Placement Prediction Using Machine Learning" />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Abstract
              <textarea className="min-h-36 rounded-md border border-border p-3 font-normal" placeholder="Summarize the problem, method, result, and impact." />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold">
                Keywords
                <input className="h-11 rounded-md border border-border px-3 font-normal" placeholder="machine learning, placement, education" />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Tags
                <input className="h-11 rounded-md border border-border px-3 font-normal" placeholder="AI, Python, Final year project" />
              </label>
            </div>
            <label className="grid gap-2 text-sm font-semibold">
              Category
              <select className="h-11 rounded-md border border-border px-3 font-normal">
                {researchCategories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <button className="flex h-36 flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border bg-background text-sm font-semibold">
                <FileUp className="text-primary" />
                Upload PDF
              </button>
              <button className="flex h-36 flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border bg-background text-sm font-semibold">
                <Image className="text-primary" />
                Upload cover image
              </button>
            </div>
            <label className="grid gap-2 text-sm font-semibold">
              Author information
              <input className="h-11 rounded-md border border-border px-3 font-normal" placeholder="Name, email, affiliation" />
            </label>
            <Button type="button">Publish</Button>
          </form>
        </Card>
        <aside className="grid gap-4">
          {["Generate abstract", "Generate keywords", "Generate summary", "Generate citation"].map((action) => (
            <Card key={action} className="flex items-center justify-between p-4">
              <span className="text-sm font-semibold">{action}</span>
              <Button variant="secondary" aria-label={action}>
                <Sparkles size={16} />
              </Button>
            </Card>
          ))}
        </aside>
      </div>
    </main>
  );
}
