import { ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";

export const metadata = { title: "Admin" };

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <ShieldCheck className="text-primary" />
        <h1 className="text-4xl font-bold">Admin panel</h1>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {["Manage users", "Review publications", "Remove spam"].map((item) => (
          <Card key={item} className="p-6">
            <h2 className="text-xl font-bold">{item}</h2>
            <p className="mt-2 text-sm text-muted-foreground">Operational workflow with role-based access and audit visibility.</p>
          </Card>
        ))}
      </div>
    </main>
  );
}
