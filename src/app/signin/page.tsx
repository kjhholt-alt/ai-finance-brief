"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Mail,
  ArrowRight,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  Github,
} from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await signIn("credentials", {
      email,
      redirect: false,
    });
    if (result?.ok) {
      // Also add to waitlist so they receive email briefs
      fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }).catch(() => {});
      setSubmitted(true);
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    }
    setLoading(false);
  }

  async function handleGitHubSignIn() {
    setGithubLoading(true);
    await signIn("github", { callbackUrl: "/dashboard" });
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 mx-auto">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-foreground tracking-tight mb-2">
            Sign in to AI Finance Brief
          </h1>
          <p className="text-muted-foreground">
            Enter your email to access your dashboard
          </p>
        </div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="glass border-white/[0.06] bg-white/[0.02]">
                <CardContent className="p-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground mb-2">
                    Welcome!
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Signed in as{" "}
                    <span className="text-foreground font-medium">{email}</span>
                    . Redirecting to your dashboard...
                  </p>
                  <div className="mt-4">
                    <Loader2 className="w-5 h-5 animate-spin text-indigo-400 mx-auto" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="glass border-white/[0.06] bg-white/[0.02]">
                <CardContent className="p-8">
                  <div className="mb-5">
                    <Button
                      type="button"
                      onClick={handleGitHubSignIn}
                      disabled={githubLoading}
                      className="w-full h-12 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-foreground transition-all"
                    >
                      {githubLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Github className="w-5 h-5 mr-2" />
                          Sign in with GitHub
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="relative mb-5">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/[0.08]" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-3 bg-background text-muted-foreground">
                        or continue with email
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Email address
                    </label>
                    <div className="relative mb-5">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="h-12 pl-10 bg-white/[0.04] border-white/[0.1] text-foreground placeholder:text-muted-foreground focus-visible:ring-indigo-500/50"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        <>
                          Sign in
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center mt-6">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to home
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
