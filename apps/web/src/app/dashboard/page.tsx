import { BarChart3, Download, FileText, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export const metadata = { title: "Dashboard" };

export default function DashboardPage() {
  const metrics: Array<[LucideIcon, string, string]> = [
    [BarChart3, "Views", "42,180"],
    [Download, "Downloads", "8,204"],
    [FileText, "Published", "18"],
    [TrendingUp, "Trending rank", "#12"]
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <div className="mt-8 grid gap-5 md:grid-cols-4">
        {metrics.map(([Icon, label, value]) => (
          <Card key={String(label)} className="p-5">
            <Icon className="text-primary" />
            <div className="mt-4 text-3xl font-bold">{value}</div>
            <div className="text-sm text-muted-foreground">{label}</div>
          </Card>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-bold">Publication management</h2>
          <div className="mt-4 divide-y divide-border text-sm">
            {["Published papers", "Drafts", "Under review", "Featured publications"].map((item) => (
              <div key={item} className="flex items-center justify-between py-4">
                <span>{item}</span>
                <button className="font-semibold text-primary">Manage</button>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-bold">Analytics</h2>
          <div className="mt-5 h-64 rounded-md border border-border bg-muted" />
        </Card>
      </div>
    </main>
  );
}
