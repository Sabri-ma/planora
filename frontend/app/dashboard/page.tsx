"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, logout, User } from "@/services/auth";
import { LogOut, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch {
        logout();
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f5ef]">
        <p className="text-[#746f67]">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f5ef]">
      <header className="border-b border-[#e5ded3] bg-[#fffdf9]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1f1d1a] text-white">
              <Sparkles size={17} />
            </div>

            <span className="text-xl font-semibold">
              Planora
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-full border border-[#ddd5ca] bg-white px-4 py-2 text-sm font-medium transition hover:bg-[#f4eee5]"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-sm text-[#817b72]">
          Welcome back
        </p>

        <h1 className="mt-2 text-4xl font-semibold tracking-tight">
          {user?.first_name || user?.username}
        </h1>

        <p className="mt-3 text-[#746f67]">
          {user?.email}
        </p>

        <div className="mt-10 rounded-[28px] border border-[#e5ded3] bg-white p-8">
          <h2 className="text-2xl font-semibold">
            Your events
          </h2>

          <p className="mt-3 text-[#746f67]">
            You don&apos;t have any events yet.
          </p>

          <button
            type="button"
            className="mt-6 rounded-full bg-[#1f1d1a] px-6 py-3 font-medium !text-white"
          >
            Create your first event
          </button>
        </div>
      </section>
    </main>
  );
}