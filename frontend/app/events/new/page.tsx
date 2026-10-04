"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { ArrowLeft, Sparkles } from "lucide-react";

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
    <main className="min-h-screen bg-[#f8f5ef] px-6 py-8">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-sm text-[#746f67] transition hover:text-black"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </button>

        <div className="mt-10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1f1d1a] text-white">
              <Sparkles size={18} />
            </div>

            <div>
              <p className="text-sm text-[#817b72]">
                Planora
              </p>

              <h1 className="text-3xl font-semibold tracking-tight">
                Create your event
              </h1>
            </div>
          </div>

          <p className="mt-4 text-[#746f67]">
            Add the main details now. You can change them later.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-6 rounded-[28px] border border-[#e5ded3] bg-white p-7"
        >
          <div>
            <label className="mb-2 block text-sm font-medium">
              Event name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Massine & Sara Wedding"
              required
              className="w-full rounded-2xl border border-[#ddd5ca] px-4 py-3 outline-none transition focus:border-[#a98b5d]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Event type
            </label>

            <select
              name="event_type"
              value={form.event_type}
              onChange={handleChange}
              className="w-full rounded-2xl border border-[#ddd5ca] px-4 py-3 outline-none transition focus:border-[#a98b5d]"
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
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Tell us a little about your event..."
              className="w-full resize-none rounded-2xl border border-[#ddd5ca] px-4 py-3 outline-none transition focus:border-[#a98b5d]"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Event date
              </label>

              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-[#ddd5ca] px-4 py-3 outline-none transition focus:border-[#a98b5d]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Location
              </label>

              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Agadir"
                className="w-full rounded-2xl border border-[#ddd5ca] px-4 py-3 outline-none transition focus:border-[#a98b5d]"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Budget
              </label>

              <input
                type="number"
                name="budget_target"
                value={form.budget_target}
                onChange={handleChange}
                placeholder="120000"
                min="0"
                className="w-full rounded-2xl border border-[#ddd5ca] px-4 py-3 outline-none transition focus:border-[#a98b5d]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Currency
              </label>

              <select
                name="currency"
                value={form.currency}
                onChange={handleChange}
                className="w-full rounded-2xl border border-[#ddd5ca] px-4 py-3 outline-none transition focus:border-[#a98b5d]"
              >
                <option value="MAD">MAD</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Guest target
              </label>

              <input
                type="number"
                name="guest_target"
                value={form.guest_target}
                onChange={handleChange}
                placeholder="200"
                min="0"
                className="w-full rounded-2xl border border-[#ddd5ca] px-4 py-3 outline-none transition focus:border-[#a98b5d]"
              />
            </div>
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="rounded-full border border-[#ddd5ca] px-6 py-3 font-medium transition hover:bg-[#f8f5ef]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-[#1f1d1a] px-7 py-3 font-medium !text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating event..." : "Create event"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}