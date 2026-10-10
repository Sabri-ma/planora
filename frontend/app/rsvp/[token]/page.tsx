"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  CalendarDays,
  CheckCircle2,
  MapPin,
  XCircle,
} from "lucide-react";

import {
  getPublicInvitation,
  PublicInvitation,
  submitRSVP,
} from "@/services/invitations";

export default function PublicRSVPPage() {
  const params = useParams();

  const token = String(params.token);

  const [invitation, setInvitation] =
    useState<PublicInvitation | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);

  const [responseStatus, setResponseStatus] =
    useState<"confirmed" | "declined" | null>(
      null
    );

  const [form, setForm] = useState({
    plus_one_name: "",
    meal_preference: "",
  });

  useEffect(() => {
    const loadInvitation = async () => {
      try {
        setError("");

        const data =
          await getPublicInvitation(token);

        setInvitation(data);
      } catch {
        setError(
          "This invitation could not be found."
        );
      } finally {
        setLoading(false);
      }
    };

    loadInvitation();
  }, [token]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleRSVP = async (
    status: "confirmed" | "declined"
  ) => {
    setSubmitting(true);
    setError("");

    try {
      await submitRSVP(token, {
        rsvp_status: status,
        plus_one_name: form.plus_one_name,
        meal_preference:
          form.meal_preference,
      });

      setResponseStatus(status);
      setSubmitted(true);
    } catch {
      setError(
        "Could not save your RSVP response."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08172F] px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,166,70,0.20),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(29,78,216,0.28),transparent_32%)]" />

        <div className="relative z-10 text-center">
          <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-white/15 border-t-[#D4A646]" />

          <p className="mt-5 text-sm font-medium text-white/70">
            Loading invitation...
          </p>
        </div>
      </main>
    );
  }

  if (error && !invitation) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08172F] px-6 py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,166,70,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(29,78,216,0.25),transparent_32%)]" />

        <div className="relative z-10 w-full max-w-lg rounded-[30px] border border-white/10 bg-white p-9 text-center shadow-[0_30px_90px_rgba(0,0,0,0.28)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
            <XCircle
              size={30}
              className="text-red-500"
            />
          </div>

          <h1 className="mt-6 text-2xl font-bold tracking-[-0.03em] text-[#08172F]">
            Invitation unavailable
          </h1>

          <p className="mt-3 text-[#667085]">
            {error}
          </p>
        </div>
      </main>
    );
  }

  if (!invitation) {
    return null;
  }

  if (submitted) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08172F] px-6 py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,166,70,0.20),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(29,78,216,0.28),transparent_32%)]" />

        <div className="absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full bg-[#D4A646]/10 blur-3xl" />

        <div className="relative z-10 w-full max-w-xl rounded-[34px] border border-white/10 bg-white p-10 text-center shadow-[0_30px_90px_rgba(0,0,0,0.30)]">
          <div
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${
              responseStatus === "confirmed"
                ? "bg-[#eef4ff]"
                : "bg-[#fff7e8]"
            }`}
          >
            {responseStatus === "confirmed" ? (
              <CheckCircle2
                size={34}
                className="text-[#1D4ED8]"
              />
            ) : (
              <XCircle
                size={34}
                className="text-[#D4A646]"
              />
            )}
          </div>

          <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-[#b8862f]">
            RSVP received
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-[#08172F]">
            {responseStatus === "confirmed"
              ? "See you there!"
              : "Thank you for letting us know"}
          </h1>

          <p className="mt-4 leading-7 text-[#667085]">
            Your response for{" "}
            <strong className="text-[#0F2B5B]">
              {invitation.event_name}
            </strong>{" "}
            has been saved.
          </p>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#98A2B3]">
            <img
              src="/brand/planora-mark.png"
              alt=""
              className="h-4 w-4 object-contain"
            />
            Planora
          </div>
        </div>
      </main>
    );
  }

  const formattedDate =
    invitation.event_date
      ? new Date(
          `${invitation.event_date}T00:00:00`
        ).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08172F] px-4 py-8 sm:px-6 sm:py-12">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-35"
        style={{
          backgroundImage:
            "url('/images/event-hero.jpg')",
        }}
      />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,17,38,0.62)_0%,rgba(8,23,47,0.92)_55%,rgba(8,23,47,1)_100%)]" />

      <div className="absolute -right-20 top-10 h-80 w-80 rounded-full bg-[#D4A646]/15 blur-3xl" />
      <div className="absolute -left-24 bottom-20 h-72 w-72 rounded-full bg-[#1D4ED8]/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-3xl">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md">
            <img
              src="/brand/planora-mark.png"
              alt="Planora"
              className="h-10 w-10 object-contain"
            />
          </div>

          <p className="mt-5 text-xs font-bold uppercase tracking-[0.24em] text-[#E7C875]">
            Planora Invitation
          </p>

          <h1 className="mt-5 text-4xl font-bold tracking-[-0.05em] !text-white sm:text-5xl lg:text-6xl">
            {invitation.event_name}
          </h1>

          <p className="mt-4 text-base text-white/70 sm:text-lg">
            You&apos;re invited,{" "}
            <strong className="font-semibold !text-white">
              {invitation.guest_name}
            </strong>
          </p>
        </div>

        <section className="mt-10 overflow-hidden rounded-[34px] border border-white/10 bg-white shadow-[0_30px_90px_rgba(0,0,0,0.32)]">
          <div className="border-b border-[#e8edf5] bg-[#f9fbff] px-6 py-6 sm:px-9">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[20px] border border-[#e2e7ef] bg-white p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef3fb] text-[#0F2B5B]">
                  <CalendarDays size={19} />
                </div>

                <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-[#98A2B3]">
                  Date
                </p>

                <p className="mt-1 font-semibold text-[#08172F]">
                  {formattedDate}
                </p>
              </div>

              <div className="rounded-[20px] border border-[#e2e7ef] bg-white p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff7e8] text-[#b8862f]">
                  <MapPin size={19} />
                </div>

                <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-[#98A2B3]">
                  Location
                </p>

                <p className="mt-1 font-semibold text-[#08172F]">
                  {invitation.event_location ||
                    "To be announced"}
                </p>
              </div>
            </div>

            {invitation.message && (
              <div className="mt-6 rounded-[20px] border border-[#eadcb7] bg-[#fffaf0] p-5">
                <p className="text-sm leading-7 text-[#5d6270] sm:text-base">
                  “{invitation.message}”
                </p>
              </div>
            )}
          </div>

          <div className="px-6 py-7 sm:px-9 sm:py-9">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b8862f]">
                Your response
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-[#08172F]">
                Will you attend?
              </h2>

              <p className="mt-2 text-sm text-[#667085]">
                Please let the hosts know your response.
              </p>
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#344054]">
                  Plus-one name
                </label>

                <input
                  type="text"
                  name="plus_one_name"
                  value={form.plus_one_name}
                  onChange={handleChange}
                  placeholder="Optional"
                  className="w-full rounded-xl border border-[#dce3ee] bg-white px-4 py-3 text-[#111827] outline-none transition placeholder:text-[#B1B7C5] focus:border-[#D4A646] focus:ring-2 focus:ring-[#D4A646]/15"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#344054]">
                  Meal preference
                </label>

                <input
                  type="text"
                  name="meal_preference"
                  value={form.meal_preference}
                  onChange={handleChange}
                  placeholder="Example: Vegetarian"
                  className="w-full rounded-xl border border-[#dce3ee] bg-white px-4 py-3 text-[#111827] outline-none transition placeholder:text-[#B1B7C5] focus:border-[#D4A646] focus:ring-2 focus:ring-[#D4A646]/15"
                />
              </div>
            </div>

            {error && (
              <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                disabled={submitting}
                onClick={() =>
                  handleRSVP("confirmed")
                }
                className="flex items-center justify-center gap-2 rounded-xl bg-[#0F2B5B] px-6 py-4 font-semibold !text-white shadow-[0_10px_26px_rgba(15,43,91,0.18)] transition hover:-translate-y-0.5 hover:bg-[#173B78] hover:!text-white disabled:translate-y-0 disabled:opacity-50"
              >
                <CheckCircle2 size={18} />

                {submitting
                  ? "Saving..."
                  : "Yes, I’ll attend"}
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={() =>
                  handleRSVP("declined")
                }
                className="flex items-center justify-center gap-2 rounded-xl border border-[#dce3ee] bg-white px-6 py-4 font-semibold text-[#44506a] transition hover:border-[#9fb3d1] hover:bg-[#f8faff] hover:text-[#0F2B5B] disabled:opacity-50"
              >
                <XCircle size={18} />
                I can&apos;t attend
              </button>
            </div>
          </div>
        </section>

        <div className="mt-7 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
          <img
            src="/brand/planora-mark.png"
            alt=""
            className="h-4 w-4 object-contain"
          />
          Invitation managed with Planora
        </div>
      </div>
    </main>
  );
}
