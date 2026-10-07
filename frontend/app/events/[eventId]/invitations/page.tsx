"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Copy,
  Eye,
  Mail,
  Plus,
  Send,
  Trash2,
  X,
} from "lucide-react";

import {
  createInvitation,
  deleteInvitation,
  getInvitations,
  Invitation,
  InvitationStatus,
  updateInvitation,
} from "@/services/invitations";

import {
  getGuests,
  Guest,
} from "@/services/guests";

export default function InvitationsPage() {
  const params = useParams();
  const router = useRouter();

  const eventId = Number(params.eventId);

  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  const [statusFilter, setStatusFilter] =
    useState<"all" | InvitationStatus>("all");

  const [form, setForm] = useState({
    guest: "",
    message: "",
  });

  const loadData = async () => {
    try {
      setError("");

      const [invitationData, guestData] =
        await Promise.all([
          getInvitations(eventId),
          getGuests(eventId),
        ]);

      setInvitations(invitationData);
      setGuests(guestData);
    } catch {
      setError("Could not load invitations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [eventId]);

  const stats = useMemo(() => {
    return {
      total: invitations.length,

      sent: invitations.filter(
        (invitation) =>
          invitation.status === "sent"
      ).length,

      opened: invitations.filter(
        (invitation) =>
          invitation.status === "opened"
      ).length,

      responded: invitations.filter(
        (invitation) =>
          invitation.status === "responded"
      ).length,
    };
  }, [invitations]);

  const filteredInvitations = useMemo(() => {
    if (statusFilter === "all") {
      return invitations;
    }

    return invitations.filter(
      (invitation) =>
        invitation.status === statusFilter
    );
  }, [invitations, statusFilter]);

  const availableGuests = useMemo(() => {
    const invitedGuestIds = new Set(
      invitations.map(
        (invitation) => invitation.guest
      )
    );

    return guests.filter(
      (guest) => !invitedGuestIds.has(guest.id)
    );
  }, [guests, invitations]);

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleCreate = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!form.guest) {
      setError("Select a guest first.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await createInvitation({
        event: eventId,
        guest: Number(form.guest),
        message: form.message,
        status: "draft",
      });

      setForm({
        guest: "",
        message: "",
      });

      setModalOpen(false);

      await loadData();
    } catch {
      setError("Could not create invitation.");
    } finally {
      setSaving(false);
    }
  };

  const handleMarkAsSent = async (
    invitation: Invitation
  ) => {
    try {
      setError("");

      await updateInvitation(
        invitation.id,
        {
          status: "sent",
        }
      );

      await loadData();
    } catch {
      setError(
        "Could not update invitation."
      );
    }
  };

  const handleDelete = async (
    invitationId: number
  ) => {
    const confirmed = window.confirm(
      "Delete this invitation?"
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(invitationId);
    setError("");

    try {
      await deleteInvitation(
        invitationId
      );

      setInvitations((current) =>
        current.filter(
          (invitation) =>
            invitation.id !== invitationId
        )
      );
    } catch {
      setError(
        "Could not delete invitation."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const copyInvitationLink = async (
    token: string
  ) => {
    const url =
      `${window.location.origin}/rsvp/${token}`;

    try {
      await navigator.clipboard.writeText(
        url
      );
    } catch {
      setError(
        "Could not copy invitation link."
      );
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f5ef]">
        <p className="text-[#746f67]">
          Loading invitations...
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
              router.push(
                `/events/${eventId}`
              )
            }
            className="flex items-center gap-2 text-sm text-[#746f67] hover:text-black"
          >
            <ArrowLeft size={16} />
            Back to event
          </button>

          <button
            type="button"
            onClick={() =>
              setModalOpen(true)
            }
            className="flex items-center gap-2 rounded-full bg-[#1f1d1a] px-5 py-2.5 text-sm font-medium !text-white"
          >
            <Plus size={16} />
            Create invitation
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-sm uppercase tracking-[0.16em] text-[#9a7b4c]">
          Guest communication
        </p>

        <h1 className="mt-2 text-4xl font-semibold tracking-tight">
          Invitations
        </h1>

        <p className="mt-3 text-[#746f67]">
          Create invitation links and
          follow guest responses.
        </p>

        {error && (
          <div className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total"
            value={stats.total}
            icon={<Mail size={19} />}
          />

          <StatCard
            title="Sent"
            value={stats.sent}
            icon={<Send size={19} />}
          />

          <StatCard
            title="Opened"
            value={stats.opened}
            icon={<Eye size={19} />}
          />

          <StatCard
            title="Responded"
            value={stats.responded}
            icon={
              <CheckCircle2
                size={19}
                className="text-green-600"
              />
            }
          />
        </div>

        <div className="mt-8 rounded-[22px] border border-[#e5ded3] bg-white p-5">
          <label className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-[#817b72]">
            Status
          </label>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as
                  | "all"
                  | InvitationStatus
              )
            }
            className="w-full max-w-sm rounded-xl border border-[#ddd5ca] px-4 py-2.5 outline-none"
          >
            <option value="all">
              All statuses
            </option>

            <option value="draft">
              Draft
            </option>

            <option value="sent">
              Sent
            </option>

            <option value="opened">
              Opened
            </option>

            <option value="responded">
              Responded
            </option>
          </select>
        </div>

        <div className="mt-8 overflow-hidden rounded-[24px] border border-[#e5ded3] bg-white">
          {filteredInvitations.length ===
          0 ? (
            <div className="p-8">
              <Mail size={28} />

              <h2 className="mt-4 text-xl font-semibold">
                No invitations yet
              </h2>

              <p className="mt-2 text-[#746f67]">
                Create an invitation for
                one of your guests.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#eee7dd]">
              {filteredInvitations.map(
                (invitation) => (
                  <div
                    key={invitation.id}
                    className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-lg font-semibold">
                          {
                            invitation.guest_name
                          }
                        </h2>

                        <InvitationBadge
                          status={
                            invitation.status
                          }
                        />
                      </div>

                      {invitation.message && (
                        <p className="mt-3 max-w-2xl text-sm text-[#746f67]">
                          {
                            invitation.message
                          }
                        </p>
                      )}

                      <p className="mt-3 text-xs text-[#999188]">
                        Invitation #
                        {invitation.id}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {invitation.status ===
                        "draft" && (
                        <button
                          type="button"
                          onClick={() =>
                            handleMarkAsSent(
                              invitation
                            )
                          }
                          className="flex items-center gap-2 rounded-full border border-[#ddd5ca] px-4 py-2 text-sm font-medium hover:bg-[#f8f5ef]"
                        >
                          <Send size={15} />
                          Mark sent
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          copyInvitationLink(
                            invitation.token
                          )
                        }
                        className="flex items-center gap-2 rounded-full border border-[#ddd5ca] px-4 py-2 text-sm font-medium hover:bg-[#f8f5ef]"
                      >
                        <Copy size={15} />
                        Copy link
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          window.open(
                            `/rsvp/${invitation.token}`,
                            "_blank"
                          )
                        }
                        className="flex items-center gap-2 rounded-full border border-[#ddd5ca] px-4 py-2 text-sm font-medium hover:bg-[#f8f5ef]"
                      >
                        <Eye size={15} />
                        Preview
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            invitation.id
                          )
                        }
                        disabled={
                          deletingId ===
                          invitation.id
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e5ded3] text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        <Trash2
                          size={16}
                        />
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </section>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() =>
            setModalOpen(false)
          }
        >
          <div
            className="w-full max-w-xl rounded-[28px] bg-[#fffdf9] p-7 shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#817b72]">
                  Invitation
                </p>

                <h2 className="mt-1 text-2xl font-semibold">
                  Create invitation
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setModalOpen(false)
                }
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f1ebe2]"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleCreate}
              className="mt-7 space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Guest
                </label>

                <select
                  name="guest"
                  value={form.guest}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-[#ddd5ca] bg-white px-4 py-3 outline-none"
                >
                  <option value="">
                    Select guest
                  </option>

                  {availableGuests.map(
                    (guest) => (
                      <option
                        key={guest.id}
                        value={guest.id}
                      >
                        {guest.first_name}{" "}
                        {guest.last_name}
                      </option>
                    )
                  )}
                </select>

                {availableGuests.length ===
                  0 && (
                  <p className="mt-2 text-sm text-[#817b72]">
                    Every current guest
                    already has an invitation.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Message
                </label>

                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="We would love to celebrate this special day with you."
                  className="w-full resize-none rounded-2xl border border-[#ddd5ca] bg-white px-4 py-3 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setModalOpen(false)
                  }
                  className="rounded-full border border-[#ddd5ca] px-5 py-3 font-medium"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    saving ||
                    availableGuests.length ===
                      0
                  }
                  className="rounded-full bg-[#1f1d1a] px-6 py-3 font-medium !text-white disabled:opacity-50"
                >
                  {saving
                    ? "Creating..."
                    : "Create invitation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-[22px] border border-[#e5ded3] bg-white p-5">
      {icon}

      <p className="mt-4 text-sm text-[#817b72]">
        {title}
      </p>

      <p className="mt-1 text-3xl font-semibold">
        {value}
      </p>
    </div>
  );
}

function InvitationBadge({
  status,
}: {
  status: InvitationStatus;
}) {
  const styles = {
    draft:
      "bg-gray-100 text-gray-700",
    sent:
      "bg-blue-50 text-blue-700",
    opened:
      "bg-amber-50 text-amber-700",
    responded:
      "bg-green-50 text-green-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}