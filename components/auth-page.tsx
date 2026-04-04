"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, LockKeyhole, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiSend } from "@/lib/api-client";
import type { SessionUser } from "@/lib/types";

export function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/account";
  const [submitting, setSubmitting] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleAuthChanged = () => {
    window.dispatchEvent(new Event("authChanged"));
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await apiSend<{ user: SessionUser }>("/api/auth/login", "POST", loginData);
      handleAuthChanged();
      toast.success("Signed in successfully");
      router.push(redirectTo);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to sign in");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
      await apiSend<{ user: SessionUser }>("/api/auth/register", "POST", {
        name: signupData.name,
        email: signupData.email,
        password: signupData.password,
      });
      handleAuthChanged();
      toast.success("Account created successfully");
      router.push(redirectTo);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create account");
    } finally {
      setSubmitting(false);
    }
  };

  const isLogin = mode === "login";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_#f7d8ff,_#fff_40%,_#fdf8f3_75%)] px-4 py-10">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.72),rgba(255,255,255,0.92))]" />
      <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-pink-200/50 blur-3xl" />
      <div className="absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-amber-100/70 blur-3xl" />

      <Card className="relative z-10 w-full max-w-md border-white/60 bg-white/85 p-8 shadow-2xl backdrop-blur">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-purple-700">
          <ArrowLeft className="h-4 w-4" />
          Back to store
        </Link>

        <div className="mb-8 space-y-3 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-500 text-white shadow-lg">
            {isLogin ? <LockKeyhole className="h-7 w-7" /> : <UserPlus className="h-7 w-7" />}
          </div>
          <h1 className="text-4xl font-bold text-gray-900">{isLogin ? "Welcome Back" : "Create Account"}</h1>
          <p className="text-gray-600">
            {isLogin ? "Sign in to track orders and continue checkout." : "Join MT Crystals to manage orders and shop faster."}
          </p>
        </div>

        {isLogin ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="login-email">Email</Label>
              <Input id="login-email" type="email" value={loginData.email} onChange={(event) => setLoginData((current) => ({ ...current, email: event.target.value }))} placeholder="your@email.com" required />
            </div>
            <div>
              <Label htmlFor="login-password">Password</Label>
              <Input id="login-password" type="password" value={loginData.password} onChange={(event) => setLoginData((current) => ({ ...current, password: event.target.value }))} placeholder="Enter your password" required />
            </div>
            <Button className="w-full bg-purple-600 hover:bg-purple-700" disabled={submitting}>
              {submitting ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label htmlFor="signup-name">Full Name</Label>
              <Input id="signup-name" value={signupData.name} onChange={(event) => setSignupData((current) => ({ ...current, name: event.target.value }))} placeholder="John Doe" required />
            </div>
            <div>
              <Label htmlFor="signup-email">Email</Label>
              <Input id="signup-email" type="email" value={signupData.email} onChange={(event) => setSignupData((current) => ({ ...current, email: event.target.value }))} placeholder="your@email.com" required />
            </div>
            <div>
              <Label htmlFor="signup-password">Password</Label>
              <Input id="signup-password" type="password" value={signupData.password} onChange={(event) => setSignupData((current) => ({ ...current, password: event.target.value }))} placeholder="At least 6 characters" required />
            </div>
            <div>
              <Label htmlFor="signup-confirm">Confirm Password</Label>
              <Input id="signup-confirm" type="password" value={signupData.confirmPassword} onChange={(event) => setSignupData((current) => ({ ...current, confirmPassword: event.target.value }))} placeholder="Re-enter your password" required />
            </div>
            <Button className="w-full bg-purple-600 hover:bg-purple-700" disabled={submitting}>
              {submitting ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? "New here?" : "Already have an account?"}{" "}
          <Link href={isLogin ? `/signup?redirect=${encodeURIComponent(redirectTo)}` : `/login?redirect=${encodeURIComponent(redirectTo)}`} className="font-medium text-purple-700 hover:underline">
            {isLogin ? "Create an account" : "Sign in"}
          </Link>
        </p>
      </Card>
    </div>
  );
}
