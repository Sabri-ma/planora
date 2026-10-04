"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Heart,
  Sparkles,
  Users,
   X,
} from "lucide-react";

const features = [
  {
    icon: CheckCircle2,
    title: "Plan every task",
    description:
      "Organize everything from booking the venue to confirming the final guest list.",
  },
  {
    icon: Users,
    title: "Manage your guests",
    description:
      "Track RSVPs, plus-ones, meal preferences, groups, and table assignments.",
  },
  {
    icon: CircleDollarSign,
    title: "Stay on budget",
    description:
      "Monitor estimated costs, actual spending, payments, and upcoming expenses.",
  },
];

export default function Home() {
  const [calendarOpen, setCalendarOpen] = useState(false);
  return (
    <main className="min-h-screen overflow-hidden">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1f1d1a] text-white">
            <Sparkles size={17} />
          </div>

          <span className="text-xl font-semibold tracking-tight">Planora</span>
        </Link>

        <div className="hidden items-center gap-8 text-sm text-[#625e57] md:flex">
          <a href="#features" className="transition hover:text-black">
            Features
          </a>

          <a href="#how-it-works" className="transition hover:text-black">
            How it works
          </a>

          <a href="#about" className="transition hover:text-black">
            About
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-[#4d4943] transition hover:bg-white sm:block"
          >
            Log in
          </Link>

          <Link
            href="/register"
            className="rounded-full bg-[#1f1d1a] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-black"
          >
            Get started
          </Link>
        </div>
      </nav>

      <section className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 pb-24 pt-16 lg:grid-cols-2 lg:px-8 lg:pb-32 lg:pt-24">
        <div className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#dfd6c9] bg-white/70 px-4 py-2 text-sm text-[#746f67] shadow-sm backdrop-blur">
            <Heart size={15} className="fill-[#b99a6b] text-[#b99a6b]" />
            Your entire event, beautifully organized
          </div>

          <h1 className="max-w-2xl text-5xl font-semibold leading-[1.05] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
            Plan the moments you&apos;ll remember forever.
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-[#6d6861]">
            Planora brings your tasks, guests, budget, vendors, invitations,
            and seating into one elegant workspace.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1f1d1a] px-6 py-3.5 font-medium !text-white transition hover:-translate-y-0.5 hover:bg-black"
            >
              Start planning
              <ArrowRight size={18} />
            </Link>

            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-full border border-[#d9d1c5] bg-white/70 px-6 py-3.5 font-medium transition hover:bg-white"
            >
              Explore features
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-[#746f67]">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} />
              No credit card
            </span>

            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} />
              Built for collaboration
            </span>

            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} />
              Easy to use
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-10 -top-10 h-64 w-64 rounded-full bg-[#e6d7c2] blur-3xl" />
          <div className="absolute -bottom-16 right-0 h-72 w-72 rounded-full bg-[#efe5d8] blur-3xl" />

          <div className="relative rounded-[32px] border border-white/80 bg-white/80 p-4 shadow-[0_40px_100px_rgba(61,48,31,0.14)] backdrop-blur">
            <div className="rounded-[26px] border border-[#ebe5dc] bg-[#fffdfa] p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#817b72]">Your event</p>
                  <h2 className="mt-1 text-2xl font-semibold">
                    Massine & Sara
                  </h2>
                  <p className="mt-1 text-sm text-[#817b72]">
                    Wedding · Agadir
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setCalendarOpen(true)}
                  className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-2xl bg-[#f3ede4] transition hover:scale-105 hover:bg-[#e9dfd1]"
                  >
                  <CalendarDays size={21} />
                </button>
              </div>

              <div className="mt-8 rounded-2xl bg-[#1f1d1a] p-5 text-white">
                <p className="text-sm text-white/60">Until the big day</p>

                <div className="mt-2 flex items-end justify-between">
                  <div>
                    <span className="text-4xl font-semibold">248</span>
                    <span className="ml-2 text-sm text-white/60">days</span>
                  </div>

                  <span className="text-sm text-white/70">June 12, 2027</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-[#ebe5dc] p-4">
                  <p className="text-sm text-[#817b72]">Budget</p>
                  <p className="mt-2 text-xl font-semibold">82,300 MAD</p>

                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#ede8e1]">
                    <div className="h-full w-[68%] rounded-full bg-[#b99a6b]" />
                  </div>
                </div>

                <div className="rounded-2xl border border-[#ebe5dc] p-4">
                  <p className="text-sm text-[#817b72]">Guests</p>
                  <p className="mt-2 text-xl font-semibold">142 confirmed</p>

                  <div className="mt-4 flex -space-x-2">
                    {["M", "S", "A", "Y"].map((letter) => (
                      <div
                        key={letter}
                        className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#ede5da] text-xs font-medium"
                      >
                        {letter}
                      </div>
                    ))}

                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#1f1d1a] text-xs text-white">
                      +138
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-[#ebe5dc] p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#817b72]">Planning progress</p>
                    <p className="mt-1 font-medium">18 of 25 tasks completed</p>
                  </div>

                  <span className="text-lg font-semibold">72%</span>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#ede8e1]">
                  <div className="h-full w-[72%] rounded-full bg-[#1f1d1a]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="border-y border-[#e4ddd2] bg-[#fffdf9] py-24"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#9a7b4c]">
              Everything in one place
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight">
              Less chaos. More celebrating.
            </h2>

            <p className="mt-4 text-lg leading-8 text-[#746f67]">
              Planora keeps the important details connected so you always know
              what&apos;s done, what&apos;s next, and where your event stands.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-[26px] border border-[#e8e0d5] bg-white p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0e9df]">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-6 text-xl font-semibold">
                    {feature.title}
                  </h3>

                  <p className="mt-3 leading-7 text-[#746f67]">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-[36px] bg-[#1f1d1a] px-7 py-16 text-white sm:px-12 lg:px-16">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-[#cdb48f]">
                  Start in minutes
                </p>

                <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                  From idea to organized event.
                </h2>
              </div>

              <div className="space-y-7">
                {[
                  ["01", "Create your event"],
                  ["02", "Add your guests, tasks, and budget"],
                  ["03", "Plan together and track everything"],
                ].map(([number, title]) => (
                  <div
                    key={number}
                    className="flex items-center gap-5 border-b border-white/10 pb-6 last:border-0 last:pb-0"
                  >
                    <span className="text-sm text-white/40">{number}</span>
                    <span className="text-lg">{title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer
        id="about"
        className="border-t border-[#e4ddd2] px-6 py-10 lg:px-8"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-5 text-sm text-[#746f67] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 font-medium text-[#1f1d1a]">
            <Sparkles size={16} />
            Planora
          </div>

          <p>Plan beautifully. Celebrate fully.</p>
        </div>
      </footer>
      {calendarOpen && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
    onClick={() => setCalendarOpen(false)}
  >
    <div
      className="w-full max-w-md rounded-[28px] bg-[#fffdf9] p-6 shadow-2xl"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[#817b72]">Event calendar</p>
          <h2 className="mt-1 text-2xl font-semibold">June 2027</h2>
        </div>

        <button
          type="button"
          onClick={() => setCalendarOpen(false)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f1ebe2]"
        >
          <X size={18} />
        </button>
      </div>

      <div className="mt-6 grid grid-cols-7 gap-2 text-center text-sm">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div key={day} className="text-xs text-[#918a81]">
            {day}
          </div>
        ))}

        <div />

        {Array.from({ length: 30 }).map((_, index) => {
          const day = index + 1;

          return (
            <div
              key={day}
              className={`flex aspect-square items-center justify-center rounded-full ${
                day === 12
                  ? "bg-[#1f1d1a] font-semibold !text-white"
                  : ""
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl bg-[#1f1d1a] p-4 !text-white">
        <p className="font-medium">Wedding day 💍</p>
        <p className="mt-1 text-sm text-white/60">June 12, 2027</p>
      </div>
    </div>
  </div>
)}
    </main>
  );
}