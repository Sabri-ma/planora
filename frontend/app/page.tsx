"use client";

import Link from "next/link";

import { useEffect } from "react";

import {

  ArrowRight,

  CalendarDays,

  CheckCircle2,

  CircleDollarSign,

  Gem,

  Mail,

  MapPin,

  ShieldCheck,

  Sparkles,

  Store,

  TableProperties,

  Users,

  WalletCards,

  WandSparkles,

} from "lucide-react";

const features = [

  {

    title: "Tasks",

    text: "Keep deadlines, priorities and responsibilities visible from day one.",

    icon: CalendarDays,

  },

  {

    title: "Guests",

    text: "Manage guest details, groups, plus-ones and RSVP status with clarity.",

    icon: Users,

  },

  {

    title: "Budget",

    text: "Track estimates, real spending, payments and what still remains.",

    icon: CircleDollarSign,

  },

  {

    title: "Vendors",

    text: "Keep supplier contacts, quotes, notes and booking status together.",

    icon: Store,

  },

  {

    title: "Invitations",

    text: "Send elegant invitations and collect guest responses from one place.",

    icon: Mail,

  },

  {

    title: "Seating",

    text: "Create tables, assign guests and keep the room organized visually.",

    icon: TableProperties,

  },

];

const eventTypes = [

  "Weddings",

  "Birthdays",

  "Engagements",

  "Private parties",

  "Corporate events",

  "Conferences",

];

const trustItems = [

  {

    title: "One polished workspace",

    text: "Everything important stays connected instead of scattered.",

    icon: Gem,

  },

  {

    title: "Built for collaboration",

    text: "Invite your team and control access with clear roles.",

    icon: Users,

  },

  {

    title: "Simple by design",

    text: "Plan without fighting a complicated interface.",

    icon: WandSparkles,

  },

  {

    title: "Private event access",

    text: "Keep planning spaces limited to the people you invite.",

    icon: ShieldCheck,

  },

];

export default function HomePage() {

  useEffect(() => {

    const elements = Array.from(

      document.querySelectorAll<HTMLElement>("[data-reveal]")

    );

    const observer = new IntersectionObserver(

      (entries) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) return;

          const element = entry.target as HTMLElement;

          element.classList.add("is-visible");

          observer.unobserve(element);

        });

      },

      {

        threshold: 0.12,

        rootMargin: "0px 0px -70px 0px",

      }

    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();

  }, []);

  return (

    <main className="min-h-screen overflow-hidden bg-[#f6f8fc] text-[#111827]">

      <style jsx global>{`

        html {

          scroll-behavior: smooth;

        }

        [data-reveal] {

          opacity: 0;

          transform: translateY(34px);

          transition:

            opacity 850ms cubic-bezier(0.22, 1, 0.36, 1),

            transform 850ms cubic-bezier(0.22, 1, 0.36, 1);

          will-change: opacity, transform;

        }

        [data-reveal="left"] {

          transform: translateX(-36px);

        }

        [data-reveal="right"] {

          transform: translateX(36px);

        }

        [data-reveal="scale"] {

          transform: translateY(24px) scale(0.96);

        }

        [data-reveal].is-visible {

          opacity: 1;

          transform: translate(0, 0) scale(1);

        }

        @media (prefers-reduced-motion: reduce) {

          html {

            scroll-behavior: auto;

          }

          [data-reveal] {

            opacity: 1 !important;

            transform: none !important;

            transition: none !important;

          }

        }

      `}</style>

      <header className="sticky top-0 z-50 border-b border-[#e5e9f2]/80 bg-white/82 backdrop-blur-2xl">

        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 sm:px-7 lg:px-10">

          <Link href="/" className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#08172F] shadow-[0_8px_24px_rgba(8,23,47,0.16)]">

              <img

                src="/brand/planora-mark.png"

                alt="Planora"

                className="h-8 w-8 object-contain"

              />

            </div>

            <div>

              <p className="text-lg font-bold tracking-[-0.03em] text-[#08172F]">

                Planora

              </p>

              <p className="text-xs text-[#8a93a7]">

                Plan beautiful moments

              </p>

            </div>

          </Link>

          <nav className="hidden items-center gap-8 md:flex">

            <a

              href="#features"

              className="text-sm font-semibold text-[#667085] transition hover:text-[#0F2B5B]"

            >

              Features

            </a>

            <a

              href="#experience"

              className="text-sm font-semibold text-[#667085] transition hover:text-[#0F2B5B]"

            >

              Experience

            </a>

            <a

              href="#how-it-works"

              className="text-sm font-semibold text-[#667085] transition hover:text-[#0F2B5B]"

            >

              How it works

            </a>

            <a

              href="#events"

              className="text-sm font-semibold text-[#667085] transition hover:text-[#0F2B5B]"

            >

              Event types

            </a>

          </nav>

          <div className="flex items-center gap-2">

            <Link

              href="/login"

              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#0F2B5B] transition hover:bg-[#eef3fb]"

            >

              Sign in

            </Link>

            <Link

              href="/register"

              className="rounded-xl bg-[#0F2B5B] px-4 py-2.5 text-sm font-semibold !text-white shadow-[0_8px_20px_rgba(15,43,91,0.14)] transition hover:-translate-y-0.5 hover:bg-[#173B78] hover:!text-white"

            >

              Start planning

            </Link>

          </div>

        </div>

      </header>

      <section className="mx-auto max-w-[1500px] px-5 pt-7 sm:px-7 lg:px-10 lg:pt-10">

        <div

          className="relative overflow-hidden rounded-[38px] bg-cover bg-center px-6 py-14 text-white shadow-[0_30px_80px_rgba(8,23,47,0.22)] sm:px-10 sm:py-16 lg:px-14 lg:py-20"

          style={{

            backgroundImage:

              "linear-gradient(90deg, rgba(4,14,32,0.97) 0%, rgba(7,28,66,0.90) 58%, rgba(7,28,66,0.66) 100%), url('/images/event-hero.jpg')",

          }}

        >

          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#D4A646]/12 blur-3xl" />

          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-[#1D4ED8]/12 blur-3xl" />

          <div className="absolute inset-0 opacity-[0.03]">

            <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[size:26px_26px]" />

          </div>

          <div className="relative z-10 grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">

            <div data-reveal="left">

              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.16em] !text-[#E7C875] backdrop-blur">

                <Sparkles size={14} />

                One elegant workspace for every detail

              </div>

              <h1 className="mt-6 max-w-3xl text-5xl font-bold tracking-[-0.06em] !text-white sm:text-6xl lg:text-[64px] lg:leading-[1.02]">

                Plan every detail.

                <span className="block !text-[#E7C875]">

                  Enjoy every moment.

                </span>

              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 !text-white/70 sm:text-lg">

                Planora brings tasks, guests, budget, vendors, invitations,

                seating and collaborators together in one refined event

                planning experience.

              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                <Link

                  href="/register"

                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4A646] px-6 py-3.5 font-bold !text-[#08172F] shadow-[0_14px_34px_rgba(212,166,70,0.25)] transition hover:-translate-y-0.5 hover:bg-[#E7C875] hover:!text-[#08172F]"

                >

                  Start planning

                  <ArrowRight size={18} />

                </Link>

                <a

                  href="#features"

                  className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/10 px-6 py-3.5 font-semibold !text-white backdrop-blur transition hover:bg-white/15 hover:!text-white"

                >

                  Explore Planora

                </a>

              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm !text-white/60">

                <span className="inline-flex items-center gap-2">

                  <CheckCircle2 size={16} className="text-[#E7C875]" />

                  Everything in one place

                </span>

                <span className="inline-flex items-center gap-2">

                  <CheckCircle2 size={16} className="text-[#E7C875]" />

                  Built for hosts and teams

                </span>

                <span className="inline-flex items-center gap-2">

                  <CheckCircle2 size={16} className="text-[#E7C875]" />

                  Beautiful by default

                </span>

              </div>

            </div>

            <div className="relative" data-reveal="right">

              <div className="mx-auto max-w-xl rounded-[30px] border border-white/10 bg-white/5 p-3 backdrop-blur-md">

                <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_22px_58px_rgba(0,0,0,0.22)]">

                  <div className="border-b border-[#e8edf5] bg-[#08172F] px-5 py-4">

                    <div className="flex items-center justify-between">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">

                          <img

                            src="/brand/planora-mark.png"

                            alt=""

                            className="h-7 w-7 object-contain"

                          />

                        </div>

                        <div>

                          <p className="text-sm font-bold !text-white">

                            Event workspace

                          </p>

                          <p className="text-xs !text-white/45">

                            Everything connected

                          </p>

                        </div>

                      </div>

                      <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold !text-white">

                        Planning

                      </span>

                    </div>

                  </div>

                  <div className="p-5">

                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#b8862f]">

                      Wedding

                    </p>

                    <h3 className="mt-2 text-2xl font-bold tracking-[-0.035em] text-[#08172F]">

                      Massine & Sara Wedding

                    </h3>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">

                      <MiniMetric

                        label="Guests"

                        value="200"

                        icon={<Users size={16} />}

                      />

                      <MiniMetric

                        label="Budget"

                        value="120k MAD"

                        icon={<CircleDollarSign size={16} />}

                      />

                      <MiniMetric

                        label="Location"

                        value="Agadir"

                        icon={<MapPin size={16} />}

                      />

                    </div>

                    <div className="mt-5 rounded-[20px] border border-[#e8edf5] bg-[#f9fbff] p-4">

                      <div className="flex items-center justify-between">

                        <p className="text-sm font-semibold text-[#08172F]">

                          Planning progress

                        </p>

                        <p className="text-sm font-bold text-[#0F2B5B]">

                          68%

                        </p>

                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e6ebf3]">

                        <div className="h-full w-[68%] rounded-full bg-[linear-gradient(90deg,#0F2B5B,#1D4ED8)]" />

                      </div>

                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <PreviewRow label="Photographer booked" />
                      <PreviewRow label="Invitation draft ready" />
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      <section className="mx-auto max-w-[1500px] px-5 py-8 sm:px-7 lg:px-10">

        <div

          data-reveal="scale"

          className="grid gap-4 rounded-[26px] border border-[#e2e7ef] bg-white p-5 shadow-[0_12px_40px_rgba(15,43,91,0.05)] md:grid-cols-4"

        >

          {trustItems.map((item) => {

            const Icon = item.icon;

            return (

              <div

                key={item.title}

                className="rounded-[20px] bg-[#f9fbff] p-5"

              >

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef3fb] text-[#0F2B5B]">

                  <Icon size={18} />

                </div>

                <p className="mt-4 font-bold text-[#08172F]">

                  {item.title}

                </p>

                <p className="mt-2 text-sm leading-6 text-[#667085]">

                  {item.text}

                </p>

              </div>

            );

          })}

        </div>

      </section>

      <section

        id="features"

        className="mx-auto max-w-[1500px] px-5 py-20 sm:px-7 lg:px-10"

      >

        <div data-reveal className="max-w-3xl">

          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b8862f]">

            Everything connected

          </p>

          <h2 className="mt-3 text-4xl font-bold tracking-[-0.055em] text-[#08172F] sm:text-5xl">

            Your entire event, organized beautifully.

          </h2>

          <p className="mt-4 text-base leading-7 text-[#667085]">

            Replace scattered notes, spreadsheets and messages with one

            focused workspace built around the way real events come together.

          </p>

        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          {features.map((feature, index) => {

            const Icon = feature.icon;

            return (

              <div

                key={feature.title}

                data-reveal

                style={{

                  transitionDelay: `${Math.min(index * 90, 360)}ms`,

                }}

                className="group rounded-[26px] border border-[#e2e7ef] bg-white p-6 shadow-[0_10px_34px_rgba(15,43,91,0.04)] transition hover:-translate-y-1.5 hover:border-[#cad5e5] hover:shadow-[0_22px_52px_rgba(15,43,91,0.10)]"

              >

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef3fb] text-[#0F2B5B] transition group-hover:bg-[#0F2B5B] group-hover:!text-white">

                  <Icon size={21} />

                </div>

                <h3 className="mt-5 text-xl font-bold text-[#08172F]">

                  {feature.title}

                </h3>

                <p className="mt-2 text-sm leading-6 text-[#667085]">

                  {feature.text}

                </p>

                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0F2B5B]">

                  Built into your workspace

                  <ArrowRight

                    size={15}

                    className="transition group-hover:translate-x-1"

                  />

                </div>

              </div>

            );

          })}

        </div>

      </section>

      <section

        id="experience"

        className="border-y border-[#e5e9f2] bg-white"

      >

        <div className="mx-auto max-w-[1500px] px-5 py-20 sm:px-7 lg:px-10">

          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

            <div data-reveal="left">

              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b8862f]">

                Designed to feel calm

              </p>

              <h2 className="mt-3 text-4xl font-bold tracking-[-0.055em] text-[#08172F] sm:text-5xl">

                Less chaos. More confidence.

              </h2>

              <p className="mt-5 max-w-xl text-base leading-8 text-[#667085]">

                Planning should feel clear even when there are dozens of moving

                parts. Planora keeps the important information visible without

                making the workspace feel heavy.

              </p>

              <div className="mt-8 space-y-4">

                <BenefitRow text="See priorities and progress at a glance." />

                <BenefitRow text="Keep guests, costs and vendors connected." />

                <BenefitRow text="Give collaborators the access they actually need." />

                <BenefitRow text="Move from planning to event day with less friction." />

              </div>

            </div>

            <div

              data-reveal="right"

              className="relative rounded-[34px] bg-[#08172F] p-5 shadow-[0_30px_80px_rgba(8,23,47,0.18)]"

            >

              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#D4A646]/20 blur-3xl" />

              <div className="relative rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur">

                <div className="grid gap-4 sm:grid-cols-2">

                  <DashboardTile

                    title="Guests confirmed"

                    value="142"

                    detail="of 200 invited"

                    icon={<Users size={18} />}

                  />

                  <DashboardTile

                    title="Budget paid"

                    value="74.5k"

                    detail="MAD settled"

                    icon={<WalletCards size={18} />}

                  />

                  <DashboardTile

                    title="Tasks complete"

                    value="68%"

                    detail="planning progress"

                    icon={<CheckCircle2 size={18} />}

                  />

                  <DashboardTile

                    title="Tables ready"

                    value="12"

                    detail="seating tables"

                    icon={<TableProperties size={18} />}

                  />

                </div>

                <div className="mt-4 rounded-[22px] bg-white p-5">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#b8862f]">

                        Next on your plan

                      </p>

                      <p className="mt-2 font-bold text-[#08172F]">

                        Finalize invitation list

                      </p>

                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff7e8] text-[#b8862f]">

                      <Mail size={18} />

                    </div>

                  </div>

                  <p className="mt-3 text-sm leading-6 text-[#667085]">

                    Review pending guests before sending the final invitation batch.

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      <section

        id="how-it-works"

        className="mx-auto max-w-[1500px] px-5 py-20 sm:px-7 lg:px-10"

      >

        <div data-reveal className="text-center">

          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b8862f]">

            How it works

          </p>

          <h2 className="mx-auto mt-3 max-w-3xl text-4xl font-bold tracking-[-0.055em] text-[#08172F] sm:text-5xl">

            From the first idea to the final guest.

          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#667085]">

            Start with the essentials, then let your workspace grow with the event.

          </p>

        </div>

        <div className="relative mt-12 grid gap-5 lg:grid-cols-4">

          <div className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-px bg-[#dfe5ef] lg:block" />

          <Step

            number="01"

            title="Create your event"

            delay={0}

          >

            Add the event type, date, location, guest target and budget.

          </Step>

          <Step

            number="02"

            title="Build your plan"

            delay={100}

          >

            Add tasks, guests, vendors, costs, invitations and seating.

          </Step>

          <Step

            number="03"

            title="Collaborate"

            delay={200}

          >

            Invite other Planora users and assign the right access level.

          </Step>

          <Step

            number="04"

            title="Enjoy the event"

            delay={300}

          >

            Keep everything organized so the final day feels effortless.

          </Step>

        </div>

      </section>

      <section

        id="events"

        className="border-y border-[#e5e9f2] bg-white"

      >

        <div className="mx-auto max-w-[1500px] px-5 py-20 sm:px-7 lg:px-10">

          <div data-reveal className="text-center">

            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b8862f]">

              Made for every occasion

            </p>

            <h2 className="mx-auto mt-3 max-w-3xl text-4xl font-bold tracking-[-0.055em] text-[#08172F] sm:text-5xl">

              Not just weddings. Every event deserves a plan.

            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#667085]">

              Planora works for celebrations, professional events and everything in between.

            </p>

          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {eventTypes.map((type, index) => (

              <div

                key={type}

                data-reveal="scale"

                style={{

                  transitionDelay: `${index * 70}ms`,

                }}

                className="group relative overflow-hidden rounded-[24px] border border-[#e2e7ef] bg-[#f9fbff] p-6 transition hover:border-[#ccd7e7] hover:bg-white hover:shadow-[0_18px_46px_rgba(15,43,91,0.08)]"

              >

                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#D4A646]/10 blur-2xl" />

                <div className="relative flex items-center justify-between">

                  <p className="text-lg font-bold text-[#08172F]">

                    {type}

                  </p>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0F2B5B] shadow-sm transition group-hover:bg-[#0F2B5B] group-hover:!text-white">

                    <Sparkles size={17} />

                  </div>

                </div>

                <p className="relative mt-3 text-sm leading-6 text-[#667085]">

                  Build a polished workspace around the details that matter for your event.

                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      <section className="mx-auto max-w-[1500px] px-5 py-20 sm:px-7 lg:px-10">

        <div

          data-reveal="scale"

          className="relative overflow-hidden rounded-[36px] bg-[#08172F] px-6 py-14 text-center shadow-[0_30px_90px_rgba(8,23,47,0.20)] sm:px-10 sm:py-16"

        >

          <div

            className="absolute inset-0 bg-cover bg-center opacity-20"

            style={{

              backgroundImage:

                "url('/images/event-hero.jpg')",

            }}

          />

          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(8,23,47,0.96),rgba(15,43,91,0.84))]" />

          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#D4A646]/20 blur-3xl" />

          <div className="absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-[#1D4ED8]/25 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-3xl">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur">

              <img

                src="/brand/planora-mark.png"

                alt=""

                className="h-10 w-10 object-contain"

              />

            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] !text-[#E7C875]">

              Bring it all together

            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-[-0.055em] !text-white sm:text-5xl">

              Your event deserves more than scattered spreadsheets.

            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 !text-white/65">

              Give every detail a home and make the planning process feel as polished as the event itself.

            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

              <Link

                href="/register"

                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4A646] px-6 py-3.5 font-bold !text-[#08172F] shadow-[0_12px_28px_rgba(212,166,70,0.22)] transition hover:-translate-y-0.5 hover:bg-[#E7C875] hover:!text-[#08172F]"

              >

                Start planning with Planora

                <ArrowRight size={18} />

              </Link>

              <Link

                href="/login"

                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/10 px-6 py-3.5 font-semibold !text-white backdrop-blur transition hover:bg-white/15 hover:!text-white"

              >

                Sign in

              </Link>

            </div>

          </div>

        </div>

      </section>

      <footer className="border-t border-[#e5e9f2] bg-white">

        <div className="mx-auto max-w-[1500px] px-5 py-10 sm:px-7 lg:px-10">

          <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]">

            <div>

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#08172F]">

                  <img

                    src="/brand/planora-mark.png"

                    alt="Planora"

                    className="h-8 w-8 object-contain"

                  />

                </div>

                <div>

                  <p className="text-lg font-bold text-[#08172F]">

                    Planora

                  </p>

                  <p className="text-xs text-[#8a93a7]">

                    Plan beautiful moments.

                  </p>

                </div>

              </div>

              <p className="mt-4 max-w-md text-sm leading-6 text-[#667085]">

                A modern event planning workspace for keeping people, costs, tasks and decisions beautifully organized.

              </p>

            </div>

            <div>

              <p className="text-sm font-bold text-[#08172F]">

                Explore

              </p>

              <div className="mt-4 space-y-3 text-sm font-medium text-[#667085]">

                <a href="#features" className="block hover:text-[#0F2B5B]">

                  Features

                </a>

                <a href="#how-it-works" className="block hover:text-[#0F2B5B]">

                  How it works

                </a>

                <a href="#events" className="block hover:text-[#0F2B5B]">

                  Event types

                </a>

              </div>

            </div>

            <div>

              <p className="text-sm font-bold text-[#08172F]">

                Get started

              </p>

              <div className="mt-4 space-y-3 text-sm font-medium text-[#667085]">

                <Link href="/login" className="block hover:text-[#0F2B5B]">

                  Sign in

                </Link>

                <Link href="/register" className="block hover:text-[#0F2B5B]">

                  Create account

                </Link>

              </div>

            </div>

          </div>

          <div className="mt-10 border-t border-[#edf0f5] pt-6 text-xs text-[#98A2B3]">

            © {new Date().getFullYear()} Planora. Plan beautiful moments.

          </div>

        </div>

      </footer>

    </main>

  );

}

function MiniMetric({

  label,

  value,

  icon,

}: {

  label: string;

  value: string;

  icon: React.ReactNode;

}) {

  return (

    <div className="rounded-2xl border border-[#e8edf5] bg-[#f9fbff] p-4">

      <div className="text-[#0F2B5B]">

        {icon}

      </div>

      <p className="mt-3 text-xs text-[#8a93a7]">

        {label}

      </p>

      <p className="mt-1 text-sm font-semibold text-[#08172F]">

        {value}

      </p>

    </div>

  );

}

function PreviewRow({

  label,

}: {

  label: string;

}) {

  return (

    <div className="flex items-center gap-2 rounded-xl border border-[#e8edf5] bg-white px-3 py-3 text-sm font-medium text-[#44506a]">

      <CheckCircle2

        size={16}

        className="shrink-0 text-[#1D4ED8]"

      />

      {label}

    </div>

  );

}

function BenefitRow({

  text,

}: {

  text: string;

}) {

  return (

    <div className="flex items-start gap-3">

      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#eef3fb] text-[#0F2B5B]">

        <CheckCircle2 size={14} />

      </div>

      <p className="text-sm leading-6 text-[#44506a]">

        {text}

      </p>

    </div>

  );

}

function DashboardTile({

  title,

  value,

  detail,

  icon,

}: {

  title: string;

  value: string;

  detail: string;

  icon: React.ReactNode;

}) {

  return (

    <div className="rounded-[22px] border border-white/10 bg-white/10 p-5 backdrop-blur">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 !text-[#E7C875]">

        {icon}

      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] !text-white/50">

        {title}

      </p>

      <p className="mt-1 text-3xl font-bold !text-white">

        {value}

      </p>

      <p className="mt-1 text-xs !text-white/45">

        {detail}

      </p>

    </div>

  );

}

function Step({

  number,

  title,

  children,

  delay,

}: {

  number: string;

  title: string;

  children: React.ReactNode;

  delay: number;

}) {

  return (

    <div

      data-reveal

      style={{

        transitionDelay: `${delay}ms`,

      }}

      className="relative rounded-[24px] border border-[#e2e7ef] bg-white p-6 shadow-[0_10px_34px_rgba(15,43,91,0.04)]"

    >

      <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#08172F] text-sm font-bold !text-[#E7C875] shadow-[0_10px_24px_rgba(8,23,47,0.14)]">

        {number}

      </div>

      <h3 className="mt-6 text-lg font-bold text-[#08172F]">

        {title}

      </h3>

      <p className="mt-2 text-sm leading-6 text-[#667085]">

        {children}

      </p>

    </div>

  );

}
