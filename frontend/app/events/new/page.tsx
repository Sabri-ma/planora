"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Users,
  Wallet,
} from "lucide-react";

export default function NewEventPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    event_type: "wedding",
    description: "",
    start_date: "",
    location: "",
    currency: "MAD",
    budget_target: "",
    guest_target: "",
    status: "planning",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/events/", {
        ...form,
        budget_target: form.budget_target || "0",
        guest_target: Number(form.guest_target || 0),
      });

      router.push(`/events/${response.data.id}`);
    } catch (err: any) {
      console.error(err.response?.data || err);

      setError("Could not create the event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f8fc] text-[#111827]">
      <header className="border-b border-[#e6eaf1] bg-white">
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
                Create a new event
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center gap-2 rounded-xl border border-[#dce3ee] bg-white px-4 py-2.5 text-sm font-semibold text-[#44506a] transition hover:border-[#9fb3d1] hover:bg-[#f8faff] hover:text-[#0F2B5B]"
          >
            <ArrowLeft size={16} />
            Dashboard
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-[1500px] px-5 py-7 sm:px-7 lg:px-10 lg:py-9">
        <div
          className="relative overflow-hidden rounded-[32px] bg-cover bg-center px-6 py-8 text-white shadow-[0_28px_80px_rgba(8,23,47,0.20)] sm:px-9 sm:py-10"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(5,17,38,0.94) 0%, rgba(6,24,55,0.78) 55%, rgba(6,24,55,0.48) 100%), url('/images/event-hero.jpg')",
          }}
        >
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#D4A646]/20 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-[#1D4ED8]/20 blur-3xl" />

          <div className="relative z-10 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] !text-[#E7C875]">
              New event
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-[-0.05em] !text-white sm:text-5xl">
              Create your event
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 !text-white/70 sm:text-base">
              Add the essentials now. You can refine every detail later from your Planora workspace.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 overflow-hidden rounded-[28px] border border-[#e2e7ef] bg-white shadow-[0_12px_38px_rgba(15,43,91,0.05)]"
        >
          <div className="border-b border-[#e9edf4] px-6 py-5 sm:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b8862f]">
              Event details
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-[#08172F]">
              Start with the basics
            </h2>

            <p className="mt-2 text-sm text-[#667085]">
              These details shape the event workspace and can be edited later.
            </p>
          </div>

          <div className="space-y-7 px-6 py-7 sm:px-8 sm:py-8">
            <div className="grid gap-6 lg:grid-cols-2">
              <Field>
                <Label>Event name</Label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Massine & Sara Wedding"
                  required
                  className={inputClass}
                />
              </Field>

              <Field>
                <Label>Event type</Label>

                <select
                  name="event_type"
                  value={form.event_type}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="wedding">Wedding</option>
                  <option value="birthday">Birthday</option>
                  <option value="engagement">Engagement</option>
                  <option value="private_party">
                    Private party
                  </option>
                  <option value="corporate">
                    Corporate event
                  </option>
                  <option value="conference">
                    Conference
                  </option>
                  <option value="other">
                    Other
                  </option>
                </select>
              </Field>
            </div>

            <Field>
              <Label>Description</Label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us a little about your event..."
                className={`${inputClass} resize-none`}
              />
            </Field>

            <div className="grid gap-6 lg:grid-cols-2">
              <Field>
                <Label icon={<CalendarDays size={15} />}>
                  Event date
                </Label>

                <input
                  type="date"
                  name="start_date"
                  value={form.start_date}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </Field>

              <Field>
                <Label icon={<MapPin size={15} />}>
                  Location
                </Label>

                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Agadir"
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Field>
                <Label icon={<Wallet size={15} />}>
                  Budget
                </Label>

                <input
                  type="number"
                  name="budget_target"
                  value={form.budget_target}
                  onChange={handleChange}
                  placeholder="120000"
                  min="0"
                  className={inputClass}
                />
              </Field>

              <Field>
                <Label>Currency</Label>

                <select
                  name="currency"
                  value={form.currency}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="MAD">MAD</option>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                </select>
              </Field>

              <Field>
                <Label icon={<Users size={15} />}>
                  Guest target
                </Label>

                <input
                  type="number"
                  name="guest_target"
                  value={form.guest_target}
                  onChange={handleChange}
                  placeholder="200"
                  min="0"
                  className={inputClass}
                />
              </Field>
            </div>

            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 border-t border-[#e9edf4] bg-[#fbfcff] px-6 py-5 sm:flex-row sm:justify-end sm:px-8">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="rounded-xl border border-[#dce3ee] bg-white px-6 py-3 font-semibold text-[#44506a] transition hover:border-[#9fb3d1] hover:bg-[#f8faff] hover:text-[#0F2B5B]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#0F2B5B] px-7 py-3 font-semibold !text-white shadow-[0_10px_24px_rgba(15,43,91,0.16)] transition hover:bg-[#173B78] hover:!text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating event..." : "Create event"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

const inputClass =
  "w-full rounded-xl border border-[#dce3ee] bg-white px-4 py-3 text-[#111827] outline-none transition placeholder:text-[#B1B7C5] focus:border-[#D4A646] focus:ring-2 focus:ring-[#D4A646]/15";

function Field({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}

function Label({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#344054]">
      {icon && (
        <span className="text-[#0F2B5B]">
          {icon}
        </span>
      )}
      {children}
    </label>
  );
}
