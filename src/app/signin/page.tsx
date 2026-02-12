"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await signIn("credentials", {
      email,
      redirect: false,
    });
    if (result?.ok) {
      setSubmitted(true);
      // Redirect to dashboard after short delay
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold">
              AF
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">
            Sign in to AI Finance Brief
          </h1>
          <p className="text-gray-400">
            Enter your email to sign in
          </p>
        </div>

        {submitted ? (
          <div className="rounded-xl bg-white/5 border border-white/10 p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-brand-500/20 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-brand-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-medium text-white mb-2">
              Welcome!
            </h2>
            <p className="text-gray-400 text-sm">
              Signed in as{" "}
              <span className="text-white">{email}</span>. Redirecting to your
              dashboard...
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-xl bg-white/5 border border-white/10 p-8"
          >
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent mb-4"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        )}

        <p className="text-center mt-6 text-gray-500 text-sm">
          <Link href="/" className="text-brand-400 hover:text-brand-300">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
