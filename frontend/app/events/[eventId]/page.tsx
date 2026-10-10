"use client";

import Link from "next/link";

import { useParams } from "next/navigation";

import { useEffect, useMemo, useState } from "react";

import {

  ArrowRight,

  CalendarDays,

  CheckCircle2,

  CircleDollarSign,

  Clock3,

  Heart,
  Mail,

  MapPin,

  PartyPopper,

  Settings,

  Sparkles,

  Store,
  Users,

  ListTodo,

} from "lucide-react";

import {

  EventDashboardData,

  getEventDashboard,

} from "@/services/dashboard";

function numberValue(value: string | number | undefined | null) {

  const parsed = Number(value ?? 0);

  return Number.isFinite(parsed) ? parsed : 0;

}

function percentage(value: number, total: number) {

  if (total <= 0) return 0;

  return Math.min(Math.round((value / total) * 100), 100);

}

function formatMoney(value: number, currency: string) {

  return new Intl.NumberFormat("en-US", {

    maximumFractionDigits: 0,

  }).format(value) + ` ${currency}`;

}

function formatDate(value: string) {

  if (!value) return "Date not set";

  return new Intl.DateTimeFormat("en-US", {

    weekday: "short",

    month: "long",

    day: "numeric",

    year: "numeric",

  }).format(new Date(value));

}

function daysUntil(date: string) {

  if (!date) return 0;

  const now = new Date();

  const eventDate = new Date(date);

  const difference = eventDate.getTime() - now.getTime();

  return Math.max(

    0,

    Math.ceil(difference / (1000 * 60 * 60 * 24))

  );

}

export default function EventOverviewPage() {

  const params = useParams();

  const eventId = Number(params.eventId);

  const [data, setData] = useState<EventDashboardData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {

    async function loadDashboard() {

      try {

        setLoading(true);

        setError("");

        const dashboard = await getEventDashboard(eventId);

        setData(dashboard);

      } catch (err) {

        console.error(err);

        setError("Could not load the event dashboard.");

      } finally {

        setLoading(false);

      }

    }

    if (eventId) {

      loadDashboard();

    }

  }, [eventId]);

  const stats = useMemo(() => {

    if (!data) {

      return null;

    }

    const completedTasks = data.tasks.filter(

      (task) => task.status === "completed"

    ).length;

    const confirmedGuests = data.guests.filter(

      (guest) => guest.rsvp_status === "confirmed"

    ).length;

    const pendingGuests = data.guests.filter(

      (guest) => guest.rsvp_status === "pending"

    ).length;

    const declinedGuests = data.guests.filter(

      (guest) => guest.rsvp_status === "declined"

    ).length;

    const bookedVendors = data.vendors.filter(

      (vendor) => vendor.status === "booked"

    ).length;

    const estimatedBudget = data.budgets.reduce(

      (total, item) =>

        total + numberValue(item.estimated_amount),

      0

    );

    const actualBudget = data.budgets.reduce(

      (total, item) => total + numberValue(item.actual_amount),

      0

    );

    const amountPaid = data.budgets.reduce(

      (total, item) => total + numberValue(item.amount_paid),

      0

    );

    const eventBudget = numberValue(data.event.budget_target);

    return {

      completedTasks,

      confirmedGuests,

      pendingGuests,

      declinedGuests,

      bookedVendors,

      estimatedBudget,

      actualBudget,

      amountPaid,

      eventBudget,

    };

  }, [data]);

  if (loading) {

    return (

      <main className="min-h-screen bg-[#f6f8fc]">

        <div className="flex min-h-screen items-center justify-center">

          <div className="text-center">

            <div className="mx-auto flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl bg-[#08172F] text-white">

              <Sparkles size={22} />

            </div>

            <p className="mt-5 text-sm text-[#787168]">

              Setting the stage for your event...

            </p>

          </div>

        </div>

      </main>

    );

  }

  if (error || !data || !stats) {

    return (

      <main className="min-h-screen bg-[#f6f8fc] p-8">

        <div className="mx-auto max-w-2xl rounded-3xl border border-red-100 bg-white p-8">

          <p className="font-medium text-red-700">

            {error || "Event not found."}

          </p>

        </div>

      </main>

    );

  }

  const { event } = data;

  const remainingDays = daysUntil(event.start_date);

  const taskProgress = percentage(

    stats.completedTasks,

    data.tasks.length

  );

  const guestProgress = percentage(

    stats.confirmedGuests,

    event.guest_target || data.guests.length

  );

  const budgetProgress = percentage(

    stats.actualBudget,

    stats.eventBudget

  );

  const vendorProgress = percentage(

    stats.bookedVendors,

    data.vendors.length

  );

  const upcomingTasks = [...data.tasks]

    .filter((task) => task.status !== "completed")

    .sort((a, b) => {

      if (!a.due_date) return 1;

      if (!b.due_date) return -1;

      return (

        new Date(a.due_date).getTime() -

        new Date(b.due_date).getTime()

      );

    })

    .slice(0, 4);

  const statCards = [

    {

      title: "Tasks",

      value: `${stats.completedTasks}/${data.tasks.length}`,

      label: `${taskProgress}% completed`,

      progress: taskProgress,

      icon: CheckCircle2,

      href: `/events/${eventId}/tasks`,

    },

    {

      title: "Guests",

      value: stats.confirmedGuests,

      label: `${stats.pendingGuests} awaiting RSVP`,

      progress: guestProgress,

      icon: Users,

      href: `/events/${eventId}/guests`,

    },

    {

      title: "Budget",

      value: formatMoney(

        stats.actualBudget,

        event.currency

      ),

      label: `${budgetProgress}% of target`,

      progress: budgetProgress,

      icon: CircleDollarSign,

      href: `/events/${eventId}/budget`,

    },

    {

      title: "Vendors",

      value: `${stats.bookedVendors}/${data.vendors.length}`,

      label: "booked",

      progress: vendorProgress,

      icon: Store,

      href: `/events/${eventId}/vendors`,

    },

  ];

  return (

    <main className="min-h-screen bg-[#f6f8fc] text-[#211f1c]">
      <section className="min-w-0 flex-1">

          <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-7 lg:px-10">

            {/* MOBILE HEADER */}

            <div className="mb-5 flex items-center justify-between lg:hidden">

              <Link

                href="/dashboard"

                className="flex items-center gap-2 font-semibold"

              >

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#08172F] text-white">

                  <Sparkles size={16} />

                </div>

                Planora

              </Link>

              <Link

                href={`/events/${eventId}/settings`}

                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#ddd3c6] bg-white"

              >

                <Settings size={18} />

              </Link>

            </div>

            {/* HERO */}

            <section

                className="relative overflow-hidden rounded-[34px] bg-cover bg-center px-6 py-7 text-white shadow-[0_30px_90px_rgba(8,23,47,0.28)] sm:px-9 sm:py-9 lg:px-12 lg:py-11"

                style={{

                  backgroundImage:

                    "linear-gradient(90deg, rgba(5,17,38,0.90) 0%, rgba(6,24,55,0.72) 55%, rgba(6,24,55,0.42) 100%), url('/images/event-hero.jpg')",

                }}

              >

              <div className="absolute -right-14 -top-20 h-72 w-72 rounded-full bg-[#D4A646]/16 blur-3xl" />

              <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-[#1D4ED8]/16 blur-3xl" />

              <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">

                <div>

                  <div className="flex flex-wrap items-center gap-2">

                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-[#E7C875] backdrop-blur">

                      <PartyPopper size={14} />

                      {event.event_type || "Event"}

                    </span>

                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs capitalize text-white/70">

                      {event.status}

                    </span>

                  </div>

                  <h1 className="mt-5 max-w-4xl text-3xl font-bold leading-[1.05] tracking-[-0.05em] !text-white sm:text-4xl lg:text-5xl">

                    {event.name}

                  </h1>

                  {event.description && (

                    <p className="mt-4 max-w-2xl text-sm leading-6 text-white/60 sm:text-base">

                      {event.description}

                    </p>

                  )}

                  <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/70">

                    <span className="flex items-center gap-2">

                      <CalendarDays

                        size={17}

                        className="text-[#E7C875]"

                      />

                      {formatDate(event.start_date)}

                    </span>

                    <span className="flex items-center gap-2">

                      <MapPin

                        size={17}

                        className="text-[#E7C875]"

                      />

                      {event.location || "Location not set"}

                    </span>

                  </div>

                </div>

                <div className="min-w-[180px] rounded-[26px] border border-white/10 bg-white/10 px-6 py-6 text-center backdrop-blur-xl">

                  <p className="text-xs uppercase tracking-[0.18em] text-white/50">

                    The countdown

                  </p>

                  <p className="mt-2 text-5xl font-semibold tracking-tight !text-[#E7C875]">

                    {remainingDays}

                  </p>

                  <p className="mt-1 text-sm text-white/60">

                    days until the moment

                  </p>

                  <div className="mx-auto mt-5 h-px w-12 bg-white/10" />

                  <Heart

                    size={17}

                    className="mx-auto mt-4 fill-[#cfae7c] text-[#cfae7c]"

                  />

                </div>

              </div>

            </section>

            {/* QUICK ACTIONS */}

            <section className="mt-5 flex gap-3 overflow-x-auto pb-1">

              <Link

                href={`/events/${eventId}/tasks`}

                className="flex shrink-0 items-center gap-2 rounded-xl bg-[#0F2B5B] px-4 py-2.5 text-sm font-semibold !text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#173B78] hover:!text-white"

              >

                <ListTodo size={16} />

                Tasks

              </Link>

              <Link

                href={`/events/${eventId}/guests`}

                className="flex shrink-0 items-center gap-2 rounded-xl border border-[#dce3ee] bg-white px-4 py-2.5 text-sm font-semibold !text-[#243047] transition hover:-translate-y-0.5 hover:border-[#9fb3d1] hover:bg-[#eef4ff] hover:!text-[#1D4ED8]"

              >

                <Users size={16} />

                Guests

              </Link>

              <Link

                href={`/events/${eventId}/budget`}

                className="flex shrink-0 items-center gap-2 rounded-xl border border-[#dce3ee] bg-white px-4 py-2.5 text-sm font-semibold !text-[#243047] transition hover:-translate-y-0.5 hover:border-[#9fb3d1] hover:bg-[#eef4ff] hover:!text-[#1D4ED8]"

              >

                <CircleDollarSign size={16} />

                Budget

              </Link>

              <Link

                href={`/events/${eventId}/vendors`}

                className="flex shrink-0 items-center gap-2 rounded-xl border border-[#dce3ee] bg-white px-4 py-2.5 text-sm font-semibold !text-[#243047] transition hover:-translate-y-0.5 hover:border-[#9fb3d1] hover:bg-[#eef4ff] hover:!text-[#1D4ED8]"

              >

                <Store size={16} />

                Vendors

              </Link>

              <Link

                href={`/events/${eventId}/invitations`}

                className="flex shrink-0 items-center gap-2 rounded-xl border border-[#dce3ee] bg-white px-4 py-2.5 text-sm font-semibold !text-[#243047] transition hover:-translate-y-0.5 hover:border-[#9fb3d1] hover:bg-[#eef4ff] hover:!text-[#1D4ED8]"

              >

                <Mail size={16} />

                Invitations

              </Link>

            </section>

            {/* STAT CARDS */}

            <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

              {statCards.map((card) => {

                const Icon = card.icon;

                return (

                  <Link

                    key={card.title}

                    href={card.href}

                    className="group rounded-[24px] border border-[#e2e7ef] bg-white p-5 shadow-[0_8px_30px_rgba(15,43,91,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,43,91,0.10)]"

                  >

                    <div className="flex items-start justify-between">

                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef3fb] text-[#0F2B5B]">

                        <Icon size={19} />

                      </div>

                      <ArrowRight

                        size={17}

                        className="text-[#9ba5b7] transition group-hover:translate-x-1 group-hover:text-[#1D4ED8]"

                      />

                    </div>

                    <p className="mt-5 text-sm text-[#667085]">

                      {card.title}

                    </p>

                    <p className="mt-1 text-2xl font-bold tracking-[-0.035em] text-[#111827]">

                      {card.value}

                    </p>

                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#e9eef6]">

                      <div

                        className="h-full rounded-full bg-[#D4A646] transition-all duration-700"

                        style={{

                          width: `${card.progress}%`,

                        }}

                      />

                    </div>

                    <p className="mt-2 text-xs text-[#8a93a6]">

                      {card.label}

                    </p>

                  </Link>

                );

              })}

            </section>

            {/* LOWER CONTENT */}

            <section className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">

              {/* UPCOMING TASKS */}

              <div className="rounded-[26px] border border-[#e2e7ef] bg-white p-6 shadow-[0_8px_30px_rgba(15,43,91,0.04)]">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b8862f]">

                      What needs your attention

                    </p>

                    <h2 className="mt-1 text-xl font-bold tracking-[-0.025em] text-[#111827]">

                      Next on your plan

                    </h2>

                  </div>

                  <Link

                    href={`/events/${eventId}/tasks`}

                    className="flex items-center gap-1.5 text-sm font-semibold !text-[#0F2B5B] transition hover:!text-[#1D4ED8]"

                  >

                    See all tasks

                    <ArrowRight size={15} />

                  </Link>

                </div>

                <div className="mt-6 space-y-3">

                  {upcomingTasks.length === 0 ? (

                    <div className="rounded-2xl bg-[#f8faff] p-6 text-center">

                      <CheckCircle2

                        size={26}

                        className="mx-auto text-[#9b7954]"

                      />

                      <p className="mt-3 font-medium">

                        You’re beautifully on track.

                      </p>

                      <p className="mt-1 text-sm text-[#8b8378]">

                        Nothing urgent is waiting for you.

                      </p>

                    </div>

                  ) : (

                    upcomingTasks.map((task) => (

                      <div

                        key={task.id}

                        className="flex items-center gap-4 rounded-2xl border border-[#e7ebf2] p-4 transition hover:bg-[#f8faff]"

                      >

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eef3fb] text-[#0F2B5B]">

                          <Clock3 size={17} />

                        </div>

                        <div className="min-w-0 flex-1">

                          <p className="truncate text-sm font-medium">

                            {task.title}

                          </p>

                          <div className="mt-1 flex items-center gap-2 text-xs text-[#8b94a8]">

                            <span className="capitalize">

                              {task.priority}

                            </span>

                            {task.due_date && (

                              <>

                                <span>•</span>

                                <span>

                                  {new Intl.DateTimeFormat(

                                    "en-US",

                                    {

                                      month: "short",

                                      day: "numeric",

                                    }

                                  ).format(

                                    new Date(task.due_date)

                                  )}

                                </span>

                              </>

                            )}

                          </div>

                        </div>

                        <span className="rounded-full bg-[#eef2f8] px-2.5 py-1 text-[11px] capitalize text-[#667085]">

                          {task.status.replace("_", " ")}

                        </span>

                      </div>

                    ))

                  )}

                </div>

              </div>

              {/* EVENT PULSE */}

              <div className="rounded-[26px] bg-white border border-[#e2e7ef] shadow-[0_8px_30px_rgba(15,43,91,0.05)] p-6">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef3fb] text-[#D4A646]">

                  <Sparkles size={19} />

                </div>

                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-[#b8862f]">

                  Planning pulse

                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight">

                  Everything is moving forward.

                </h2>

                <p className="mt-3 text-sm leading-6 text-[#667085]">

                  Keep an eye on your guests, payments,

                  vendors and deadlines as the big day

                  gets closer.

                </p>

                <div className="mt-7 space-y-5">

                  <div>

                    <div className="flex justify-between text-sm text-[#44506a]">

                      <span>RSVP confirmed</span>

                      <span className="font-semibold">

                        {stats.confirmedGuests}

                      </span>

                    </div>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e9eef6]">

                      <div

                        className="h-full rounded-full bg-[#D4A646]"

                        style={{

                          width: `${guestProgress}%`,

                        }}

                      />

                    </div>

                  </div>

                  <div>

                    <div className="flex justify-between text-sm text-[#44506a]">

                      <span>Tasks completed</span>

                      <span className="font-semibold">

                        {stats.completedTasks}

                      </span>

                    </div>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e9eef6]">

                      <div

                        className="h-full rounded-full bg-[#D4A646]"

                        style={{

                          width: `${taskProgress}%`,

                        }}

                      />

                    </div>

                  </div>

                  <div>

                    <div className="flex justify-between text-sm text-[#44506a]">

                      <span>Vendors booked</span>

                      <span className="font-semibold">

                        {stats.bookedVendors}

                      </span>

                    </div>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e9eef6]">

                      <div

                        className="h-full rounded-full bg-[#D4A646]"

                        style={{

                          width: `${vendorProgress}%`,

                        }}

                      />

                    </div>

                  </div>

                </div>

              </div>

            </section>

            {/* BOTTOM INFO */}

            <section className="mt-6 grid gap-4 md:grid-cols-3">

              <div className="rounded-[22px] border border-[#e2e7ef] bg-white p-5">

                <p className="text-sm text-[#6f7890]">

                  Guests confirmed

                </p>

                <p className="mt-2 text-3xl font-semibold">

                  {stats.confirmedGuests}

                </p>

                <p className="mt-1 text-xs text-[#929bad]">

                  {stats.pendingGuests} pending ·{" "}

                  {stats.declinedGuests} declined

                </p>

              </div>

              <div className="rounded-[22px] border border-[#e2e7ef] bg-white p-5">

                <p className="text-sm text-[#6f7890]">

                  Budget paid

                </p>

                <p className="mt-2 text-3xl font-semibold">

                  {formatMoney(

                    stats.amountPaid,

                    event.currency

                  )}

                </p>

                <p className="mt-1 text-xs text-[#929bad]">

                  Across {data.budgets.length} budget items

                </p>

              </div>

              <div className="rounded-[22px] border border-[#e2e7ef] bg-white p-5">

                <p className="text-sm text-[#6f7890]">

                  Seating

                </p>

                <p className="mt-2 text-3xl font-semibold">

                  {data.tables.length}

                </p>

                <p className="mt-1 text-xs text-[#929bad]">

                  tables ready for your seating plan

                </p>

              </div>

            </section>

          </div>

      </section>
    </main>

  );

}