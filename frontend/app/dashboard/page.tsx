"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, logout, User } from "@/services/auth";
import { Event, getEvents } from "@/services/events";
import {
  ArrowRight,
  CalendarDays,
  LogOut,
  MapPin,
  Plus,
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

  const stats = useMemo(() => {
    const totalGuests = events.reduce(
      (sum, event) => sum + Number(event.guest_target || 0),
      0
    );

    const totalBudget = events.reduce(
      (sum, event) => sum + Number(event.budget_target || 0),
      0
    );

    return {
      events: events.length,
      guests: totalGuests,
      budget: totalBudget,
    };
  }, [events]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f8fc]">
        <div className="text-center">
          <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-[#e5eaf3] border-t-[#D4A646]" />

          <p className="mt-4 text-sm font-medium text-[#667085]">
            Loading your workspace...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f8fc] text-[#111827]">
      <header className="sticky top-0 z-30 border-b border-[#e6eaf1] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 sm:px-7 lg:px-10">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#08172F]">
              <img
                src="/brand/planora-mark.png"
                alt="Planora"
                className="h-8 w-8 object-contain"
              />
            </div>

            <div className="text-left">
              <p className="text-lg font-bold tracking-[-0.03em] text-[#08172F]">
                Planora
              </p>

              <p className="text-xs text-[#8a93a7]">
                Event planning workspace
              </p>
            </div>
          </button>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-[#101828]">
                {user?.first_name || user?.username}
              </p>

              <p className="text-xs text-[#8a93a7]">
                {user?.email}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex h-10 items-center gap-2 rounded-xl border border-[#dce3ee] bg-white px-4 text-sm font-semibold text-[#44506a] transition hover:border-[#9fb3d1] hover:bg-[#f8faff] hover:text-[#0F2B5B]"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1500px] px-5 py-7 sm:px-7 lg:px-10 lg:py-9">
        <div
          className="relative overflow-hidden rounded-[32px] bg-cover bg-center px-6 py-9 text-white shadow-[0_28px_80px_rgba(8,23,47,0.20)] sm:px-9 sm:py-11 lg:px-12"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(5,17,38,0.94) 0%, rgba(6,24,55,0.78) 55%, rgba(6,24,55,0.48) 100%), url('/images/event-hero.jpg')",
          }}
        >
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#D4A646]/20 blur-3xl" />
          <div className="absolute -bottom-20 left-1/3 h-60 w-60 rounded-full bg-[#1D4ED8]/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] !text-[#E7C875]">
                Welcome back
              </p>

              <h1 className="mt-3 text-4xl font-bold tracking-[-0.05em] !text-white sm:text-5xl">
                {user?.first_name || user?.username}
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 !text-white/70 sm:text-base">
                Plan every detail, keep your team aligned, and move each event forward from one place.
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/events/new")}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#D4A646] px-5 py-3.5 text-sm font-bold !text-[#08172F] shadow-[0_12px_30px_rgba(212,166,70,0.26)] transition hover:-translate-y-0.5 hover:bg-[#E7C875] hover:!text-[#08172F]"
            >
              <Plus size={18} />
              Create event
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <StatCard
            icon={<CalendarDays size={19} />}
            label="Events"
            value={stats.events.toLocaleString()}
          />

          <StatCard
            icon={<Users size={19} />}
            label="Planned guests"
            value={stats.guests.toLocaleString()}
          />

          <StatCard
            icon={<Wallet size={19} />}
            label="Target budget"
            value={`${stats.budget.toLocaleString()} MAD`}
          />
        </div>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b8862f]">
              Your workspace
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#08172F]">
              Your events
            </h2>

            <p className="mt-2 text-sm text-[#667085]">
              {events.length} event{events.length !== 1 ? "s" : ""} in your workspace.
            </p>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="mt-6 rounded-[28px] border border-[#e2e7ef] bg-white p-9 text-center shadow-[0_10px_32px_rgba(15,43,91,0.04)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef3fb] text-[#0F2B5B]">
              <CalendarDays size={24} />
            </div>

            <h3 className="mt-5 text-2xl font-bold tracking-[-0.03em] text-[#08172F]">
              No events yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#667085]">
              Create your first event and bring tasks, guests, budget, vendors, invitations and seating together in Planora.
            </p>

            <button
              type="button"
              onClick={() => router.push("/events/new")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0F2B5B] px-5 py-3 font-semibold !text-white transition hover:bg-[#173B78] hover:!text-white"
            >
              <Plus size={17} />
              Create your first event
            </button>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            {events.map((event) => {
              const formattedDate = new Date(
                event.start_date
              ).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });

              return (
                <button
                  key={event.id}
                  type="button"
                  onClick={() =>
                    router.push(`/events/${event.id}`)
                  }
                  className="group text-left"
                >
                  <div className="h-full overflow-hidden rounded-[28px] border border-[#e2e7ef] bg-white shadow-[0_10px_34px_rgba(15,43,91,0.04)] transition duration-300 group-hover:-translate-y-1 group-hover:border-[#cbd6e6] group-hover:shadow-[0_22px_50px_rgba(15,43,91,0.10)]">
                    <div className="relative overflow-hidden border-b border-[#e8edf5] bg-[#08172F] px-6 py-6">
                      <div
                        className="absolute inset-0 bg-cover bg-center opacity-25"
                        style={{
                          backgroundImage:
                            "url('/images/event-hero.jpg')",
                        }}
                      />

                      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,23,47,0.94),rgba(15,43,91,0.72))]" />

                      <div className="relative z-10 flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.15em] !text-[#E7C875]">
                            {event.event_type.replace("_", " ")}
                          </p>

                          <h3 className="mt-2 text-2xl font-bold tracking-[-0.03em] !text-white">
                            {event.name}
                          </h3>

                          <div className="mt-3 flex items-center gap-2 text-sm !text-white/65">
                            <MapPin size={15} />
                            {event.location || "No location"}
                          </div>
                        </div>

                        <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold capitalize !text-white backdrop-blur">
                          {event.status}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="grid gap-3 sm:grid-cols-3">
                        <EventMetric
                          icon={<CalendarDays size={17} />}
                          label="Date"
                          value={formattedDate}
                        />

                        <EventMetric
                          icon={<Users size={17} />}
                          label="Guests"
                          value={Number(
                            event.guest_target
                          ).toLocaleString()}
                        />

                        <EventMetric
                          icon={<Wallet size={17} />}
                          label="Budget"
                          value={`${Number(
                            event.budget_target
                          ).toLocaleString()} ${event.currency}`}
                        />
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-[#eef1f6] pt-5">
                        <span className="text-sm font-semibold text-[#667085]">
                          Open workspace
                        </span>

                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eef3fb] text-[#0F2B5B] transition group-hover:bg-[#0F2B5B] group-hover:!text-white">
                          <ArrowRight size={17} />
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[22px] border border-[#e2e7ef] bg-white p-5 shadow-[0_8px_30px_rgba(15,43,91,0.04)]">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef3fb] text-[#0F2B5B]">
        {icon}
      </div>

      <p className="mt-4 text-sm font-medium text-[#8a93a7]">
        {label}
      </p>

      <p className="mt-1 text-3xl font-bold tracking-[-0.04em] text-[#08172F]">
        {value}
      </p>
    </div>
  );
}

function EventMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e8edf5] bg-[#f9fbff] p-4">
      <div className="text-[#0F2B5B]">
        {icon}
      </div>

      <p className="mt-3 text-xs font-medium text-[#8a93a7]">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-[#111827]">
        {value}
      </p>
    </div>
  );
}
