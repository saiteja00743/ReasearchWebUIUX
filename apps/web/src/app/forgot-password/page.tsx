import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata = { title: "Forgot Password" };

export default function ForgotPasswordPage() {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-md place-items-center px-4">
      <Card className="w-full p-6">
        <h1 className="text-2xl font-bold">Reset password</h1>
        <p className="mt-2 text-sm text-muted-foreground">Enter your email and ResearchHub will send a reset link.</p>
        <form className="mt-6 grid gap-4">
          <input className="h-11 rounded-md border border-border px-3" placeholder="Email" />
          <Button type="button">Send reset link</Button>
        </form>
      </Card>
    </main>
  );
}
