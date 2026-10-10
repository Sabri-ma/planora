"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth";
import {
  ArrowLeft,
  LockKeyhole,
  UserRound,
} from "lucide-react";

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
    <main className="relative min-h-screen overflow-hidden bg-[#08172F] px-4 py-6 sm:px-6 sm:py-8">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-35"
        style={{
          backgroundImage:
            "url('/images/event-hero.jpg')",
        }}
      />

      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(5,17,38,0.96)_0%,rgba(8,23,47,0.88)_52%,rgba(15,43,91,0.80)_100%)]" />

      <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-[#D4A646]/15 blur-3xl" />
      <div className="absolute -left-20 bottom-16 h-72 w-72 rounded-full bg-[#1D4ED8]/18 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1400px] flex-col">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold !text-white/80 backdrop-blur-md transition hover:bg-white/10 hover:!text-white"
          >
            <ArrowLeft size={16} />
            Back to Planora
          </Link>

          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md">
              <img
                src="/brand/planora-mark.png"
                alt="Planora"
                className="h-8 w-8 object-contain"
              />
            </div>

            <span className="hidden text-lg font-bold tracking-[-0.03em] !text-white sm:inline">
              Planora
            </span>
          </Link>
        </div>

        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:py-12">
          <section className="hidden lg:block">
            <p className="text-xs font-bold uppercase tracking-[0.2em] !text-[#E7C875]">
              Welcome back
            </p>

            <h1 className="mt-4 max-w-xl text-5xl font-bold tracking-[-0.06em] !text-white xl:text-6xl">
              Pick up where you left off.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 !text-white/65">
              Your events, guests, budget, vendors, invitations, seating and team are waiting in one place.
            </p>

            <div className="mt-8 grid max-w-xl gap-4 sm:grid-cols-2">
              <FeatureCard
                title="Stay organized"
                text="Keep every planning detail connected."
              />

              <FeatureCard
                title="Move faster"
                text="Jump straight back into your event workspace."
              />
            </div>
          </section>

          <section className="mx-auto w-full max-w-md">
            <div className="rounded-[30px] border border-white/10 bg-white p-7 shadow-[0_30px_90px_rgba(0,0,0,0.30)] sm:p-8">
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#08172F]">
                  <img
                    src="/brand/planora-mark.png"
                    alt="Planora"
                    className="h-10 w-10 object-contain"
                  />
                </div>

                <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-[#b8862f]">
                  Planora
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#08172F]">
                  Sign in
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#667085]">
                  Continue planning your event from your workspace.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#344054]">
                    Username
                  </label>

                  <div className="relative">
                    <UserRound
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#98A2B3]"
                    />

                    <input
                      type="text"
                      value={username}
                      onChange={(event) =>
                        setUsername(event.target.value)
                      }
                      placeholder="Enter your username"
                      required
                      autoComplete="username"
                      className="w-full rounded-xl border border-[#dce3ee] bg-white py-3 pl-11 pr-4 text-[#111827] outline-none transition placeholder:text-[#B1B7C5] focus:border-[#D4A646] focus:ring-2 focus:ring-[#D4A646]/15"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#344054]">
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#98A2B3]"
                    />

                    <input
                      type="password"
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
                      className="w-full rounded-xl border border-[#dce3ee] bg-white py-3 pl-11 pr-4 text-[#111827] outline-none transition placeholder:text-[#B1B7C5] focus:border-[#D4A646] focus:ring-2 focus:ring-[#D4A646]/15"
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#0F2B5B] px-5 py-3.5 font-semibold !text-white shadow-[0_10px_24px_rgba(15,43,91,0.18)] transition hover:bg-[#173B78] hover:!text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Signing in..."
                    : "Sign in"}
                </button>
              </form>

              <div className="mt-6 border-t border-[#edf0f5] pt-6">
                <p className="text-center text-sm text-[#667085]">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="font-semibold text-[#0F2B5B] transition hover:text-[#1D4ED8]"
                  >
                    Create one
                  </Link>
                </p>
              </div>
            </div>

            <p className="mt-5 text-center text-xs font-medium !text-white/45">
              Plan beautiful moments with Planora.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

function FeatureCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/5 p-5 backdrop-blur-md">
      <p className="font-semibold !text-white">
        {title}
      </p>

      <p className="mt-2 text-sm leading-6 !text-white/55">
        {text}
      </p>
    </div>
  );
}
