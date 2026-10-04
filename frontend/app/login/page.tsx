"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login({
        username,
        password,
      });

      router.push("/dashboard");
    } catch {
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f5ef] px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#746f67] transition hover:text-black"
        >
          <ArrowLeft size={16} />
          Back to Planora
        </Link>

        <div className="mx-auto mt-14 max-w-md">
          <div className="mb-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#1f1d1a] text-white">
              <Sparkles size={20} />
            </div>

            <h1 className="mt-6 text-3xl font-semibold tracking-tight">
              Welcome back
            </h1>

            <p className="mt-2 text-[#746f67]">
              Sign in to continue planning your event.
            </p>
          </div>

          <div className="rounded-[28px] border border-[#e5ded3] bg-white p-7 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Username
                </label>

                <input
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Enter your username"
                  required
                  className="w-full rounded-2xl border border-[#ddd5ca] bg-[#fffdfa] px-4 py-3 outline-none transition focus:border-[#a98b5d]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-2xl border border-[#ddd5ca] bg-[#fffdfa] px-4 py-3 outline-none transition focus:border-[#a98b5d]"
                />
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#1f1d1a] px-5 py-3 font-medium !text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#746f67]">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-[#1f1d1a] underline underline-offset-4"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}