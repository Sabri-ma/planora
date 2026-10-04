"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, logout, User } from "@/services/auth";
import { Event, getEvents } from "@/services/events";
import {
  CalendarDays,
  LogOut,
  MapPin,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [currentUser, userEvents] = await Promise.all([
          getCurrentUser(),
          getEvents(),
        ]);

        setUser(currentUser);
        setEvents(userEvents);
      } catch {
        logout();
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
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

            <span className="text-xl font-semibold">Planora</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">
                {user?.first_name || user?.username}
              </p>

              <p className="text-xs text-[#817b72]">
                {user?.email}
              </p>
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
          Manage your events and keep everything organized in one place.
        </p>

        <div className="mt-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">
              Your events
            </h2>

            <p className="mt-1 text-sm text-[#817b72]">
              {events.length} event{events.length !== 1 ? "s" : ""}
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/events/new")}
            className="rounded-full bg-[#1f1d1a] px-5 py-3 text-sm font-medium !text-white transition hover:bg-black"
          >
            Create event
          </button>
        </div>

        {events.length === 0 ? (
          <div className="mt-6 rounded-[28px] border border-[#e5ded3] bg-white p-8">
            <h3 className="text-xl font-semibold">
              No events yet
            </h3>

            <p className="mt-2 text-[#746f67]">
              Create your first event and start planning with Planora.
            </p>

            <button
              type="button"
              onClick={() => router.push("/events/new")}
              className="mt-6 rounded-full bg-[#1f1d1a] px-6 py-3 font-medium !text-white transition hover:bg-black"
            >
              Create your first event
            </button>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {events.map((event) => (
              <button
                key={event.id}
                type="button"
                onClick={() => router.push(`/events/${event.id}`)}
                className="text-left"
              >
                <div className="rounded-[28px] border border-[#e5ded3] bg-white p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm capitalize text-[#9a7b4c]">
                        {event.event_type.replace("_", " ")}
                      </p>

                      <h3 className="mt-2 text-2xl font-semibold">
                        {event.name}
                      </h3>

                      <div className="mt-3 flex items-center gap-2 text-sm text-[#746f67]">
                        <MapPin size={15} />

                        {event.location || "No location"}
                      </div>
                    </div>

                    <span className="rounded-full bg-[#f3ede4] px-3 py-1 text-xs font-medium capitalize">
                      {event.status}
                    </span>
                  </div>

                  <div className="mt-7 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl bg-[#f8f5ef] p-4">
                      <CalendarDays size={18} />

                      <p className="mt-3 text-xs text-[#817b72]">
                        Date
                      </p>

                      <p className="mt-1 text-sm font-medium">
                        {new Date(
                          event.start_date
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#f8f5ef] p-4">
                      <Users size={18} />

                      <p className="mt-3 text-xs text-[#817b72]">
                        Guests
                      </p>

                      <p className="mt-1 text-sm font-medium">
                        {event.guest_target}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#f8f5ef] p-4">
                      <Wallet size={18} />

                      <p className="mt-3 text-xs text-[#817b72]">
                        Budget
                      </p>

                      <p className="mt-1 text-sm font-medium">
                        {Number(
                          event.budget_target
                        ).toLocaleString()}{" "}
                        {event.currency}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}