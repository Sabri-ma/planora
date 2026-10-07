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
      <main className="flex min-h-screen items-center justify-center bg-[#f8f5ef] px-6">
        <p className="text-[#746f67]">
          Loading invitation...
        </p>
      </main>
    );
  }

  if (error && !invitation) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f5ef] px-6">
        <div className="w-full max-w-lg rounded-[28px] border border-[#e5ded3] bg-white p-8 text-center">
          <XCircle
            size={42}
            className="mx-auto text-red-500"
          />

          <h1 className="mt-5 text-2xl font-semibold">
            Invitation unavailable
          </h1>

          <p className="mt-3 text-[#746f67]">
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
      <main className="flex min-h-screen items-center justify-center bg-[#f8f5ef] px-6 py-12">
        <div className="w-full max-w-xl rounded-[32px] border border-[#e5ded3] bg-[#fffdf9] p-10 text-center shadow-sm">
          {responseStatus === "confirmed" ? (
            <CheckCircle2
              size={52}
              className="mx-auto text-green-600"
            />
          ) : (
            <XCircle
              size={52}
              className="mx-auto text-[#9a7b4c]"
            />
          )}

          <p className="mt-6 text-sm uppercase tracking-[0.16em] text-[#9a7b4c]">
            RSVP received
          </p>

          <h1 className="mt-2 text-3xl font-semibold">
            {responseStatus === "confirmed"
              ? "See you there!"
              : "Thank you for letting us know"}
          </h1>

          <p className="mt-4 text-[#746f67]">
            Your response for{" "}
            <strong>
              {invitation.event_name}
            </strong>{" "}
            has been saved.
          </p>
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
    <main className="min-h-screen bg-[#f8f5ef] px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-[#9a7b4c]">
            Planora Invitation
          </p>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
            {invitation.event_name}
          </h1>

          <p className="mt-4 text-lg text-[#746f67]">
            You&apos;re invited,{" "}
            <strong className="text-[#1f1d1a]">
              {invitation.guest_name}
            </strong>
          </p>
        </div>

        <div className="mt-10 rounded-[32px] border border-[#e5ded3] bg-[#fffdf9] p-8 shadow-sm sm:p-10">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[20px] bg-[#f4efe7] p-5">
              <CalendarDays size={20} />

              <p className="mt-3 text-xs uppercase tracking-[0.12em] text-[#817b72]">
                Date
              </p>

              <p className="mt-1 font-medium">
                {formattedDate}
              </p>
            </div>

            <div className="rounded-[20px] bg-[#f4efe7] p-5">
              <MapPin size={20} />

              <p className="mt-3 text-xs uppercase tracking-[0.12em] text-[#817b72]">
                Location
              </p>

              <p className="mt-1 font-medium">
                {invitation.event_location ||
                  "To be announced"}
              </p>
            </div>
          </div>

          {invitation.message && (
            <div className="mt-7 border-l-2 border-[#b89b6b] pl-5">
              <p className="leading-7 text-[#5f5a53]">
                {invitation.message}
              </p>
            </div>
          )}

          <div className="mt-9">
            <h2 className="text-2xl font-semibold">
              Will you attend?
            </h2>

            <p className="mt-2 text-sm text-[#746f67]">
              Please let the hosts know your
              response.
            </p>
          </div>

          <div className="mt-7 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Plus-one name
              </label>

              <input
                type="text"
                name="plus_one_name"
                value={form.plus_one_name}
                onChange={handleChange}
                placeholder="Optional"
                className="w-full rounded-2xl border border-[#ddd5ca] bg-white px-4 py-3 outline-none focus:border-[#a98b5d]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Meal preference
              </label>

              <input
                type="text"
                name="meal_preference"
                value={form.meal_preference}
                onChange={handleChange}
                placeholder="Example: Vegetarian"
                className="w-full rounded-2xl border border-[#ddd5ca] bg-white px-4 py-3 outline-none focus:border-[#a98b5d]"
              />
            </div>
          </div>

          {error && (
            <div className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
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
              className="flex items-center justify-center gap-2 rounded-full bg-[#1f1d1a] px-6 py-4 font-medium !text-white disabled:opacity-50"
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
              className="flex items-center justify-center gap-2 rounded-full border border-[#d7cec1] bg-white px-6 py-4 font-medium text-[#4f4942] disabled:opacity-50"
            >
              <XCircle size={18} />
              I can&apos;t attend
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-[#999188]">
          Invitation managed with Planora
        </p>
      </div>
    </main>
  );
}