"use client";

import { useEffect, useMemo, useState } from "react";

import { useParams } from "next/navigation";

import {
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
      <div className="flex min-h-[70vh] items-center justify-center bg-[#f6f8fc]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#e5eaf3] border-t-[#D4A646]" />
          <p className="mt-4 text-sm font-medium text-[#6f7890]">
            Loading invitations...
          </p>
        </div>
      </div>
    );
  }

  return (

    <main className="min-h-screen bg-[#f6f8fc]">

      <section className="mx-auto max-w-[1500px] px-5 py-6 sm:px-7 lg:px-10 lg:py-8">
        <div
          className="relative overflow-hidden rounded-[30px] bg-cover bg-center px-6 py-7 text-white shadow-[0_24px_70px_rgba(8,23,47,0.22)] sm:px-8 sm:py-8"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(5,17,38,0.92) 0%, rgba(6,24,55,0.74) 58%, rgba(6,24,55,0.46) 100%), url('/images/event-hero.jpg')",
          }}
        >
          <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#D4A646]/20 blur-3xl" />
          <div className="absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-[#1D4ED8]/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] !text-[#E7C875]">
                Guest communication
              </p>

              <h1 className="mt-2 text-4xl font-bold tracking-[-0.04em] !text-white">
                Invitations
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 !text-white/70 sm:text-base">
                Create personal invitation links and follow each guest from draft to response.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#D4A646] px-5 py-3 text-sm font-bold !text-[#08172F] shadow-[0_10px_28px_rgba(212,166,70,0.24)] transition hover:-translate-y-0.5 hover:bg-[#E7C875] hover:!text-[#08172F]"
            >
              <Plus size={16} />
              Create invitation
            </button>
          </div>
        </div>

        {error && (

          <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">

            {error}

          </div>

        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

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

                className="text-[#1D4ED8]"

              />

            }

          />

        </div>

        <div className="mt-6 rounded-[22px] border border-[#e2e7ef] bg-white p-5 shadow-[0_8px_30px_rgba(15,43,91,0.04)]">

          <label className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-[#8b94a8]">

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

            className="w-full max-w-sm rounded-xl border border-[#dce3ee] bg-white px-4 py-2.5 text-[#111827] outline-none transition focus:border-[#D4A646] focus:ring-2 focus:ring-[#D4A646]/15"

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

        <div className="mt-6 overflow-hidden rounded-[24px] border border-[#e2e7ef] bg-white shadow-[0_8px_30px_rgba(15,43,91,0.04)]">

          {filteredInvitations.length ===

          0 ? (

            <div className="p-8">

              <Mail size={28} />

              <h2 className="mt-4 text-xl font-semibold">

                No invitations yet

              </h2>

              <p className="mt-2 text-[#667085]">

                Create an invitation for

                one of your guests.

              </p>

            </div>

          ) : (

            <div className="divide-y divide-[#e9edf4]">

              {filteredInvitations.map(

                (invitation) => (

                  <div

                    key={invitation.id}

                    className="flex flex-col gap-5 p-6 transition hover:bg-[#f9fbff] lg:flex-row lg:items-center lg:justify-between"

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

                        <p className="mt-3 max-w-2xl text-sm text-[#667085]">

                          {

                            invitation.message

                          }

                        </p>

                      )}

                      <p className="mt-3 text-xs text-[#98a2b3]">

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

                          className="flex items-center gap-2 rounded-full border border-[#dce3ee] px-4 py-2 text-sm font-medium hover:bg-[#f6f8fc]"

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

                        className="flex items-center gap-2 rounded-full border border-[#dce3ee] px-4 py-2 text-sm font-medium hover:bg-[#f6f8fc]"

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

                        className="flex items-center gap-2 rounded-full border border-[#dce3ee] px-4 py-2 text-sm font-medium hover:bg-[#f6f8fc]"

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

                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#f1d0d4] text-red-600 transition hover:bg-red-50 disabled:opacity-50"

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

          className="fixed inset-0 z-50 flex items-center justify-center bg-[#08172F]/55 px-4 backdrop-blur-sm"

          onClick={() =>

            setModalOpen(false)

          }

        >

          <div

            className="w-full max-w-xl rounded-[28px] border border-[#e2e7ef] bg-white p-7 shadow-[0_30px_90px_rgba(8,23,47,0.24)]"

            onClick={(event) =>

              event.stopPropagation()

            }

          >

            <div className="flex items-start justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b8862f]">

                  Invitation

                </p>

                <h2 className="mt-1 text-2xl font-bold tracking-[-0.03em] text-[#08172F]">

                  Create invitation

                </h2>

              </div>

              <button

                type="button"

                onClick={() =>

                  setModalOpen(false)

                }

                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eef3fb] text-[#0F2B5B] transition hover:bg-[#e4ecf8]"

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

                  className="w-full rounded-xl border border-[#dce3ee] bg-white px-4 py-3 text-[#111827] outline-none transition focus:border-[#D4A646] focus:ring-2 focus:ring-[#D4A646]/15"

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

                  <p className="mt-2 text-sm text-[#8b94a8]">

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

                  className="w-full resize-none rounded-xl border border-[#dce3ee] bg-white px-4 py-3 text-[#111827] outline-none transition focus:border-[#D4A646] focus:ring-2 focus:ring-[#D4A646]/15"

                />

              </div>

              <div className="flex justify-end gap-3">

                <button

                  type="button"

                  onClick={() =>

                    setModalOpen(false)

                  }

                  className="rounded-xl border border-[#dce3ee] bg-white px-5 py-3 font-semibold text-[#44506a] transition hover:border-[#9fb3d1] hover:bg-[#f8faff] hover:text-[#0F2B5B]"

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

                  className="rounded-xl bg-[#0F2B5B] px-6 py-3 font-semibold !text-white transition hover:bg-[#173B78] hover:!text-white disabled:opacity-50"

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

    <div className="rounded-[22px] border border-[#e2e7ef] bg-white p-5 shadow-[0_8px_30px_rgba(15,43,91,0.04)]">

      {icon}

      <p className="mt-4 text-sm text-[#8b94a8]">

        {title}

      </p>

      <p className="mt-1 text-3xl font-bold tracking-[-0.03em] text-[#08172F]">

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

      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${styles[status]}`}

    >

      {status}

    </span>

  );

}