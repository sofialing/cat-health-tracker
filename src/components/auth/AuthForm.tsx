"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AuthFormProps {
  mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const supabase = createClient();
      if (mode === "register") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: name } },
        });
        if (signUpError) throw new Error(signUpError.message);
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw new Error(signInError.message);
      }
      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An error occurred. Try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader>
        <CardTitle>
          {mode === "login" ? "Welcome back 👋" : "Create account"}
        </CardTitle>
        <CardDescription>
          {mode === "login"
            ? "Sign in to track your cats' health"
            : "Start tracking your cats' health today"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {mode === "register" && (
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? mode === "login"
                ? "Signing in…"
                : "Creating account…"
              : mode === "login"
                ? "Sign in"
                : "Create account"}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            {mode === "login" ? (
              <>
                No account?{" "}
                <Link href="/register" className="underline">
                  Register
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link href="/login" className="underline">
                  Sign in
                </Link>
              </>
            )}
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
