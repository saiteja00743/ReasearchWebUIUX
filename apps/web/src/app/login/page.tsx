import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-md place-items-center px-4">
      <Card className="w-full p-6">
        <h1 className="text-2xl font-bold">Login</h1>
        <form className="mt-6 grid gap-4">
          <input className="h-11 rounded-md border border-border px-3" placeholder="Email" />
          <input className="h-11 rounded-md border border-border px-3" placeholder="Password" type="password" />
          <Button type="button">Login</Button>
          <Button type="button" variant="secondary">Continue with Google</Button>
        </form>
        <div className="mt-4 flex justify-between text-sm text-muted-foreground">
          <Link href="/register">Create account</Link>
          <Link href="/forgot-password">Forgot password</Link>
        </div>
      </Card>
    </main>
  );
}
