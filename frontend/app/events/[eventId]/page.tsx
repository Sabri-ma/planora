"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/services/api";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";

interface EventData {
  id: number;
  owner: string;
  name: string;
  slug: string;
  event_type: string;
  description: string;
  start_date: string;
  location: string;
  currency: string;
  budget_target: string;
  guest_target: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function EventPage() {
  const params = useParams();
  const router = useRouter();

  const eventId = params.eventId as string;

  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const response = await api.get(`/events/${eventId}/`);
        setEvent(response.data);
      } catch {
        setError("Could not load this event.");
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [eventId]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f5ef]">
        <p className="text-[#746f67]">Loading event...</p>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f5ef] px-6">
        <div className="text-center">
          <p className="text-red-700">
            {error || "Event not found."}
          </p>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="mt-5 rounded-full bg-[#1f1d1a] px-6 py-3 font-medium !text-white"
          >
            Back to dashboard
          </button>
        </div>
      </main>
    );
  }

  const menuItems = [
    "Overview",
    "Tasks",
    "Guests",
    "Budget",
    "Vendors",
    "Invitations",
    "Seating",
    "Settings",
  ];

  const handleMenuClick = (item: string) => {
    if (item === "Overview") {
    router.push(`/events/${event.id}`);
    return;
    }

    if (item === "Tasks") {
    router.push(`/events/${event.id}/tasks`);
    return;
    }

    if (item === "Guests") {
    router.push(`/events/${event.id}/guests`);
    return;
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f5ef]">
      <header className="border-b border-[#e5ded3] bg-[#fffdf9]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-sm text-[#746f67] transition hover:text-black"
          >
            <ArrowLeft size={16} />
            Back to events
          </button>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1f1d1a] text-white">
              <Sparkles size={17} />
            </div>

            <span className="text-xl font-semibold">
              Planora
            </span>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm capitalize text-[#9a7b4c]">
              {event.event_type.replace("_", " ")}
            </p>

            <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
              {event.name}
            </h1>

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-[#746f67]">
              <span className="flex items-center gap-2">
                <MapPin size={16} />
                {event.location || "No location"}
              </span>

              <span className="flex items-center gap-2">
                <CalendarDays size={16} />
                {new Date(event.start_date).toLocaleDateString()}
              </span>
            </div>

            {event.description && (
              <p className="mt-5 max-w-2xl leading-7 text-[#746f67]">
                {event.description}
              </p>
            )}
          </div>

          <span className="w-fit rounded-full bg-[#eee5d9] px-4 py-2 text-sm font-medium capitalize">
            {event.status}
          </span>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <div className="rounded-[24px] border border-[#e5ded3] bg-white p-6">
            <Wallet size={20} />

            <p className="mt-4 text-sm text-[#817b72]">
              Budget target
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {Number(event.budget_target).toLocaleString()}{" "}
              {event.currency}
            </p>
          </div>

          <div className="rounded-[24px] border border-[#e5ded3] bg-white p-6">
            <Users size={20} />

            <p className="mt-4 text-sm text-[#817b72]">
              Guest target
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {event.guest_target}
            </p>
          </div>

          <div className="rounded-[24px] border border-[#e5ded3] bg-white p-6">
            <CalendarDays size={20} />

            <p className="mt-4 text-sm text-[#817b72]">
              Event date
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {new Date(event.start_date).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="rounded-[24px] border border-[#e5ded3] bg-white p-4">
            <p className="px-3 pb-3 text-xs font-medium uppercase tracking-[0.15em] text-[#9a7b4c]">
              Event menu
            </p>

            {menuItems.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleMenuClick(item)}
                className={`block w-full rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                  item === "Overview"
                    ? "bg-[#f3ede4]"
                    : "hover:bg-[#f8f5ef]"
                }`}
              >
                {item}
              </button>
            ))}
          </aside>

          <div className="rounded-[24px] border border-[#e5ded3] bg-white p-7">
            <p className="text-sm text-[#817b72]">
              Overview
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Your event workspace
            </h2>

            <p className="mt-3 text-[#746f67]">
              Tasks, guests, budget, vendors and invitations will all live here.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() =>
                  router.push(`/events/${event.id}/tasks`)
                }
                className="rounded-2xl border border-[#e5ded3] p-5 text-left transition hover:bg-[#f8f5ef]"
              >
                <p className="text-sm text-[#817b72]">
                  Tasks
                </p>

                <p className="mt-2 font-semibold">
                  Manage your planning tasks
                </p>
              </button>

              <div className="rounded-2xl border border-[#e5ded3] p-5">
                <p className="text-sm text-[#817b72]">
                  Guests
                </p>

                <p className="mt-2 font-semibold">
                  Guest management coming next
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}