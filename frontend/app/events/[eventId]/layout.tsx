"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  CircleDollarSign,
  LayoutDashboard,
  ListTodo,
  Mail,
  Settings,
  Store,
  TableProperties,
  Users,
} from "lucide-react";

export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();

  const eventId = Number(params.eventId);

  const navItems = [
    {
      label: "Overview",
      href: `/events/${eventId}`,
      icon: LayoutDashboard,
    },
    {
      label: "Tasks",
      href: `/events/${eventId}/tasks`,
      icon: ListTodo,
    },
    {
      label: "Guests",
      href: `/events/${eventId}/guests`,
      icon: Users,
    },
    {
      label: "Budget",
      href: `/events/${eventId}/budget`,
      icon: CircleDollarSign,
    },
    {
      label: "Vendors",
      href: `/events/${eventId}/vendors`,
      icon: Store,
    },
    {
      label: "Invitations",
      href: `/events/${eventId}/invitations`,
      icon: Mail,
    },
    {
      label: "Seating",
      href: `/events/${eventId}/seating`,
      icon: TableProperties,
    },
    {
      label: "Settings",
      href: `/events/${eventId}/settings`,
      icon: Settings,
    },
  ];

  return (
    <main className="min-h-screen bg-[#f6f8fc] text-[#111827]">
      <div className="flex min-h-screen">
        <aside className="hidden w-[260px] shrink-0 border-r border-[#e5e9f2] bg-white lg:flex lg:flex-col">
          <div className="border-b border-[#e9edf4] px-6 py-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#08172F]">
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

                <p className="text-xs text-[#7c8498]">
                  Your event workspace
                </p>
              </div>
            </Link>
          </div>

          <div className="px-4 py-6">
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;

                const active =
                  item.href === `/events/${eventId}`
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition ${
                      active
                        ? "bg-[#0F2B5B] !text-white hover:!text-white"
                        : "!text-[#667085] hover:bg-[#eef3fb] hover:!text-[#1D4ED8]"
                    }`}
                  >
                    <Icon
                      size={18}
                      className={
                        active ? "!text-white" : ""
                      }
                    />

                    <span
                      className={
                        active ? "!text-white" : ""
                      }
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto p-4">
            <Link
              href="/dashboard"
              className="block rounded-xl border border-[#e1e7f0] bg-[#fbfcff] px-4 py-3 text-sm font-semibold !text-[#0F2B5B] transition hover:bg-[#eef3fb]"
            >
              Back to all events
            </Link>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          {children}
        </section>
      </div>
    </main>
  );
}