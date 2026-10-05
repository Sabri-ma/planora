"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Pencil,
  Plus,
  Trash2,
  UserRoundX,
  Users,
  X,
} from "lucide-react";

import {
  createGuest,
  deleteGuest,
  getGuests,
  Guest,
  GuestGroup,
  GuestSide,
  RSVPStatus,
  updateGuest,
} from "@/services/guests";

export default function EventGuestsPage() {
  const params = useParams();
  const router = useRouter();

  const eventId = Number(params.eventId);

  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [creating, setCreating] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [updatingGuestId, setUpdatingGuestId] = useState<number | null>(
    null
  );
  const [deletingGuestId, setDeletingGuestId] = useState<number | null>(
    null
  );

  const [rsvpFilter, setRsvpFilter] = useState<"all" | RSVPStatus>(
    "all"
  );

  const [groupFilter, setGroupFilter] = useState<"all" | GuestGroup>(
    "all"
  );

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    group: "other" as GuestGroup,
    side: "none" as GuestSide,
    plus_one_allowed: false,
    plus_one_name: "",
    rsvp_status: "pending" as RSVPStatus,
    meal_preference: "",
    notes: "",
    table: "",
  });

  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    group: "other" as GuestGroup,
    side: "none" as GuestSide,
    plus_one_allowed: false,
    plus_one_name: "",
    rsvp_status: "pending" as RSVPStatus,
    meal_preference: "",
    notes: "",
    table: "",
  });

  const loadGuests = async () => {
    try {
      setError("");

      const data = await getGuests(eventId);

      setGuests(data);
    } catch {
      setError("Could not load guests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGuests();
  }, [eventId]);

  const stats = useMemo(() => {
    return {
      total: guests.length,
      confirmed: guests.filter(
        (guest) => guest.rsvp_status === "confirmed"
      ).length,
      pending: guests.filter(
        (guest) => guest.rsvp_status === "pending"
      ).length,
      declined: guests.filter(
        (guest) => guest.rsvp_status === "declined"
      ).length,
    };
  }, [guests]);

  const filteredGuests = useMemo(() => {
    return guests.filter((guest) => {
      const rsvpMatches =
        rsvpFilter === "all" ||
        guest.rsvp_status === rsvpFilter;

      const groupMatches =
        groupFilter === "all" ||
        guest.group === groupFilter;

      return rsvpMatches && groupMatches;
    });
  }, [guests, rsvpFilter, groupFilter]);

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    if (
      event.target instanceof HTMLInputElement &&
      event.target.type === "checkbox"
    ) {
      setForm({
        ...form,
        [name]: event.target.checked,
      });

      return;
    }

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleEditChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    if (
      event.target instanceof HTMLInputElement &&
      event.target.type === "checkbox"
    ) {
      setEditForm({
        ...editForm,
        [name]: event.target.checked,
      });

      return;
    }

    setEditForm({
      ...editForm,
      [name]: value,
    });
  };

  const resetCreateForm = () => {
    setForm({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      group: "other",
      side: "none",
      plus_one_allowed: false,
      plus_one_name: "",
      rsvp_status: "pending",
      meal_preference: "",
      notes: "",
      table: "",
    });
  };

  const handleCreateGuest = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setCreating(true);
    setError("");

    try {
      await createGuest({
        event: eventId,
        ...form,
      });

      resetCreateForm();
      setGuestModalOpen(false);

      await loadGuests();
    } catch {
      setError("Could not create guest.");
    } finally {
      setCreating(false);
    }
  };

  const openEditModal = (guest: Guest) => {
    setEditingGuest(guest);

    setEditForm({
      first_name: guest.first_name,
      last_name: guest.last_name,
      email: guest.email,
      phone: guest.phone,
      group: guest.group,
      side: guest.side,
      plus_one_allowed: guest.plus_one_allowed,
      plus_one_name: guest.plus_one_name,
      rsvp_status: guest.rsvp_status,
      meal_preference: guest.meal_preference,
      notes: guest.notes,
      table: guest.table,
    });

    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingGuest(null);
  };

  const handleUpdateGuest = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!editingGuest) {
      return;
    }

    setUpdatingGuestId(editingGuest.id);
    setError("");

    try {
      await updateGuest(editingGuest.id, editForm);

      closeEditModal();

      await loadGuests();
    } catch {
      setError("Could not update guest.");
    } finally {
      setUpdatingGuestId(null);
    }
  };

  const handleDeleteGuest = async (
    guestId: number
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this guest?"
    );

    if (!confirmed) {
      return;
    }

    setDeletingGuestId(guestId);
    setError("");

    try {
      await deleteGuest(guestId);

      setGuests((currentGuests) =>
        currentGuests.filter(
          (guest) => guest.id !== guestId
        )
      );
    } catch {
      setError("Could not delete guest.");
    } finally {
      setDeletingGuestId(null);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f5ef]">
        <p className="text-[#746f67]">
          Loading guests...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f5ef]">
      <header className="border-b border-[#e5ded3] bg-[#fffdf9]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <button
            type="button"
            onClick={() =>
              router.push(`/events/${eventId}`)
            }
            className="flex items-center gap-2 text-sm text-[#746f67] transition hover:text-black"
          >
            <ArrowLeft size={16} />
            Back to event
          </button>

          <button
            type="button"
            onClick={() => setGuestModalOpen(true)}
            className="flex items-center gap-2 rounded-full bg-[#1f1d1a] px-5 py-2.5 text-sm font-medium !text-white transition hover:bg-black"
          >
            <Plus size={16} />
            Add guest
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-sm uppercase tracking-[0.16em] text-[#9a7b4c]">
          Guest management
        </p>

        <h1 className="mt-2 text-4xl font-semibold tracking-tight">
          Guests
        </h1>

        <p className="mt-3 text-[#746f67]">
          Manage invitations, RSVP status, plus-ones and guest details.
        </p>

        {error && (
          <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-[22px] border border-[#e5ded3] bg-white p-5">
            <Users size={19} />

            <p className="mt-4 text-sm text-[#817b72]">
              Total guests
            </p>

            <p className="mt-1 text-3xl font-semibold">
              {stats.total}
            </p>
          </div>

          <div className="rounded-[22px] border border-[#e5ded3] bg-white p-5">
            <CheckCircle2
              size={19}
              className="text-green-600"
            />

            <p className="mt-4 text-sm text-[#817b72]">
              Confirmed
            </p>

            <p className="mt-1 text-3xl font-semibold">
              {stats.confirmed}
            </p>
          </div>

          <div className="rounded-[22px] border border-[#e5ded3] bg-white p-5">
            <Clock3
              size={19}
              className="text-[#9a7b4c]"
            />

            <p className="mt-4 text-sm text-[#817b72]">
              Pending
            </p>

            <p className="mt-1 text-3xl font-semibold">
              {stats.pending}
            </p>
          </div>

          <div className="rounded-[22px] border border-[#e5ded3] bg-white p-5">
            <UserRoundX
              size={19}
              className="text-red-500"
            />

            <p className="mt-4 text-sm text-[#817b72]">
              Declined
            </p>

            <p className="mt-1 text-3xl font-semibold">
              {stats.declined}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 rounded-[22px] border border-[#e5ded3] bg-white p-5 sm:flex-row">
          <div className="flex-1">
            <label className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-[#817b72]">
              RSVP
            </label>

            <select
              value={rsvpFilter}
              onChange={(event) =>
                setRsvpFilter(
                  event.target.value as
                    | "all"
                    | RSVPStatus
                )
              }
              className="w-full rounded-xl border border-[#ddd5ca] px-4 py-2.5 outline-none"
            >
              <option value="all">
                All RSVP statuses
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="confirmed">
                Confirmed
              </option>

              <option value="declined">
                Declined
              </option>
            </select>
          </div>

          <div className="flex-1">
            <label className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-[#817b72]">
              Group
            </label>

            <select
              value={groupFilter}
              onChange={(event) =>
                setGroupFilter(
                  event.target.value as
                    | "all"
                    | GuestGroup
                )
              }
              className="w-full rounded-xl border border-[#ddd5ca] px-4 py-2.5 outline-none"
            >
              <option value="all">
                All groups
              </option>

              <option value="family">
                Family
              </option>

              <option value="friends">
                Friends
              </option>

              <option value="work">
                Work
              </option>

              <option value="vip">
                VIP
              </option>

              <option value="other">
                Other
              </option>
            </select>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-[24px] border border-[#e5ded3] bg-white">
          {filteredGuests.length === 0 ? (
            <div className="p-8">
              <h2 className="text-xl font-semibold">
                No guests found
              </h2>

              <p className="mt-2 text-[#746f67]">
                Add a guest or change your filters.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#eee7dd]">
              {filteredGuests.map((guest) => (
                <div
                  key={guest.id}
                  className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-semibold">
                        {guest.first_name}{" "}
                        {guest.last_name}
                      </h2>

                      <span className="rounded-full bg-[#f3ede4] px-3 py-1 text-xs font-medium capitalize">
                        {guest.group}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                          guest.rsvp_status ===
                          "confirmed"
                            ? "bg-green-50 text-green-700"
                            : guest.rsvp_status ===
                                "declined"
                              ? "bg-red-50 text-red-700"
                              : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {guest.rsvp_status}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#746f67]">
                      {guest.email && (
                        <span>{guest.email}</span>
                      )}

                      {guest.phone && (
                        <span>{guest.phone}</span>
                      )}

                      {guest.meal_preference && (
                        <span>
                          Meal:{" "}
                          {guest.meal_preference}
                        </span>
                      )}

                      {guest.plus_one_allowed && (
                        <span>
                          Plus-one allowed
                        </span>
                      )}

                      {guest.table && (
                        <span>
                          Table: {guest.table}
                        </span>
                      )}
                    </div>

                    {guest.notes && (
                      <p className="mt-3 text-sm text-[#817b72]">
                        {guest.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        openEditModal(guest)
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e5ded3] transition hover:bg-[#f8f5ef]"
                      aria-label="Edit guest"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteGuest(
                          guest.id
                        )
                      }
                      disabled={
                        deletingGuestId ===
                        guest.id
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e5ded3] text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      aria-label="Delete guest"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {guestModalOpen && (
        <GuestModal
          title="Add guest"
          form={form}
          onChange={handleChange}
          onSubmit={handleCreateGuest}
          onClose={() =>
            setGuestModalOpen(false)
          }
          submitting={creating}
          submitLabel="Add guest"
        />
      )}

      {editModalOpen && editingGuest && (
        <GuestModal
          title="Edit guest"
          form={editForm}
          onChange={handleEditChange}
          onSubmit={handleUpdateGuest}
          onClose={closeEditModal}
          submitting={
            updatingGuestId ===
            editingGuest.id
          }
          submitLabel="Save changes"
        />
      )}
    </main>
  );
}

interface GuestModalProps {
  title: string;
  form: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    group: GuestGroup;
    side: GuestSide;
    plus_one_allowed: boolean;
    plus_one_name: string;
    rsvp_status: RSVPStatus;
    meal_preference: string;
    notes: string;
    table: string;
  };
  onChange: (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => void;
  onSubmit: (
    event: React.FormEvent
  ) => void;
  onClose: () => void;
  submitting: boolean;
  submitLabel: string;
}

function GuestModal({
  title,
  form,
  onChange,
  onSubmit,
  onClose,
  submitting,
  submitLabel,
}: GuestModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-4 py-8"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-[28px] bg-[#fffdf9] p-7 shadow-2xl"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-[#817b72]">
              Guest management
            </p>

            <h2 className="mt-1 text-2xl font-semibold">
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f1ebe2]"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className="mt-7 space-y-5"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <GuestInput
              label="First name"
              name="first_name"
              value={form.first_name}
              onChange={onChange}
              required
            />

            <GuestInput
              label="Last name"
              name="last_name"
              value={form.last_name}
              onChange={onChange}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <GuestInput
              label="Email"
              name="email"
              value={form.email}
              onChange={onChange}
              type="email"
            />

            <GuestInput
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={onChange}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Group
              </label>

              <select
                name="group"
                value={form.group}
                onChange={onChange}
                className="w-full rounded-2xl border border-[#ddd5ca] bg-white px-4 py-3 outline-none"
              >
                <option value="family">
                  Family
                </option>

                <option value="friends">
                  Friends
                </option>

                <option value="work">
                  Work
                </option>

                <option value="vip">
                  VIP
                </option>

                <option value="other">
                  Other
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Side
              </label>

              <select
                name="side"
                value={form.side}
                onChange={onChange}
                className="w-full rounded-2xl border border-[#ddd5ca] bg-white px-4 py-3 outline-none"
              >
                <option value="none">
                  None
                </option>

                <option value="partner_one">
                  Partner one
                </option>

                <option value="partner_two">
                  Partner two
                </option>

                <option value="both">
                  Both
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                RSVP
              </label>

              <select
                name="rsvp_status"
                value={form.rsvp_status}
                onChange={onChange}
                className="w-full rounded-2xl border border-[#ddd5ca] bg-white px-4 py-3 outline-none"
              >
                <option value="pending">
                  Pending
                </option>

                <option value="confirmed">
                  Confirmed
                </option>

                <option value="declined">
                  Declined
                </option>
              </select>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e5ded3] bg-white p-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="plus_one_allowed"
                checked={
                  form.plus_one_allowed
                }
                onChange={onChange}
                className="h-4 w-4"
              />

              <span className="text-sm font-medium">
                Allow plus-one
              </span>
            </label>

            {form.plus_one_allowed && (
              <div className="mt-4">
                <GuestInput
                  label="Plus-one name"
                  name="plus_one_name"
                  value={
                    form.plus_one_name
                  }
                  onChange={onChange}
                />
              </div>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <GuestInput
              label="Meal preference"
              name="meal_preference"
              value={
                form.meal_preference
              }
              onChange={onChange}
              placeholder="Standard"
            />

            <GuestInput
              label="Table"
              name="table"
              value={form.table}
              onChange={onChange}
              placeholder="Table 4"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Notes
            </label>

            <textarea
              name="notes"
              value={form.notes}
              onChange={onChange}
              rows={3}
              className="w-full resize-none rounded-2xl border border-[#ddd5ca] bg-white px-4 py-3 outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[#ddd5ca] px-5 py-3 font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-[#1f1d1a] px-6 py-3 font-medium !text-white disabled:opacity-60"
            >
              {submitting
                ? "Saving..."
                : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface GuestInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

function GuestInput({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
}: GuestInputProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-2xl border border-[#ddd5ca] bg-white px-4 py-3 outline-none focus:border-[#a98b5d]"
      />
    </div>
  );
}