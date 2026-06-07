import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata = { title: "Register" };

export default function RegisterPage() {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-md place-items-center px-4">
      <Card className="w-full p-6">
        <h1 className="text-2xl font-bold">Create your ResearchHub profile</h1>
        <form className="mt-6 grid gap-4">
          <input className="h-11 rounded-md border border-border px-3" placeholder="Full name" />
          <input className="h-11 rounded-md border border-border px-3" placeholder="Username" />
          <input className="h-11 rounded-md border border-border px-3" placeholder="Email" />
          <input className="h-11 rounded-md border border-border px-3" placeholder="Password" type="password" />
          <Button type="button">Register</Button>
          <Button type="button" variant="secondary">Continue with Google</Button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          Already published? <Link href="/login" className="font-semibold text-primary">Login</Link>
        </p>
      </Card>
    </main>
  );
}
