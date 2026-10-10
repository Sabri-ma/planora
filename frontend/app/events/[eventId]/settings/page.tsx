"use client";

import { useEffect, useMemo, useState } from "react";

import { useParams } from "next/navigation";

import {
  Crown,

  Pencil,

  Plus,

  Shield,

  Trash2,

  UserRound,

  Users,

  X,

} from "lucide-react";

import {

  addEventMember,

  EventMember,

  EventMemberRole,

  getEventMembers,

  removeEventMember,

  updateEventMember,

} from "@/services/members";

export default function EventSettingsPage() {

  const params = useParams();
  const eventId = Number(params.eventId);

  const [members, setMembers] = useState<EventMember[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

  const [editingMember, setEditingMember] =

    useState<EventMember | null>(null);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] =

    useState<number | null>(null);

  const [form, setForm] = useState({

    email: "",

    role: "viewer" as Exclude<

      EventMemberRole,

      "owner"

    >,

  });

  const loadMembers = async () => {

    try {

      setError("");

      const data = await getEventMembers(eventId);

      setMembers(data);

    } catch {

      setError("Could not load event members.");

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadMembers();

  }, [eventId]);

  const stats = useMemo(() => {

    return {

      total: members.length,

      admins: members.filter(

        (member) =>

          member.role === "owner" ||

          member.role === "admin"

      ).length,

      editors: members.filter(

        (member) => member.role === "editor"

      ).length,

      viewers: members.filter(

        (member) => member.role === "viewer"

      ).length,

    };

  }, [members]);

  const openAddModal = () => {

    setEditingMember(null);

    setForm({

      email: "",

      role: "viewer",

    });

    setModalOpen(true);

  };

  const openEditModal = (

    member: EventMember

  ) => {

    if (member.role === "owner") {

      return;

    }

    setEditingMember(member);

    setForm({

      email: member.email,

      role: member.role,

    });

    setModalOpen(true);

  };

  const closeModal = () => {

    setModalOpen(false);

    setEditingMember(null);

    setForm({

      email: "",

      role: "viewer",

    });

  };

  const handleSubmit = async (

    event: React.FormEvent

  ) => {

    event.preventDefault();

    setSaving(true);

    setError("");

    try {

      if (editingMember) {

        await updateEventMember(

          eventId,

          editingMember.id,

          {

            role: form.role,

          }

        );

      } else {

        await addEventMember(

          eventId,

          {

            email: form.email,

            role: form.role,

          }

        );

      }

      closeModal();

      await loadMembers();

    } catch {

      setError(

        editingMember

          ? "Could not update member role."

          : "Could not add member. Make sure the user already has a Planora account."

      );

    } finally {

      setSaving(false);

    }

  };

  const handleRemove = async (

    member: EventMember

  ) => {

    if (member.role === "owner") {

      return;

    }

    const confirmed = window.confirm(

      `Remove ${member.username} from this event?`

    );

    if (!confirmed) {

      return;

    }

    setDeletingId(member.id);

    setError("");

    try {

      await removeEventMember(

        eventId,

        member.id

      );

      setMembers((current) =>

        current.filter(

          (item) => item.id !== member.id

        )

      );

    } catch {

      setError("Could not remove member.");

    } finally {

      setDeletingId(null);

    }

  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#f6f8fc]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#e5eaf3] border-t-[#D4A646]" />
          <p className="mt-4 text-sm font-medium text-[#6f7890]">
            Loading team...
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
                Collaboration
              </p>

              <h1 className="mt-2 text-4xl font-bold tracking-[-0.04em] !text-white">
                Team & permissions
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 !text-white/70 sm:text-base">
                Add collaborators and control exactly how they can access and manage this event.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#D4A646] px-5 py-3 text-sm font-bold !text-[#08172F] shadow-[0_10px_28px_rgba(212,166,70,0.24)] transition hover:-translate-y-0.5 hover:bg-[#E7C875] hover:!text-[#08172F]"
            >
              <Plus size={16} />
              Add member
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

            title="Members"

            value={stats.total}

            icon={<Users size={19} />}

          />

          <StatCard

            title="Owners / Admins"

            value={stats.admins}

            icon={<Crown size={19} />}

          />

          <StatCard

            title="Editors"

            value={stats.editors}

            icon={<Pencil size={19} />}

          />

          <StatCard

            title="Viewers"

            value={stats.viewers}

            icon={<UserRound size={19} />}

          />

        </div>

        <div className="mt-6 overflow-hidden rounded-[24px] border border-[#e2e7ef] bg-white shadow-[0_8px_30px_rgba(15,43,91,0.04)]">

          <div className="border-b border-[#e9edf4] px-6 py-5">

            <h2 className="text-xl font-semibold">

              Event members

            </h2>

            <p className="mt-1 text-sm text-[#667085]">

              Users must already have a Planora account

              before they can be added.

            </p>

          </div>

          <div className="divide-y divide-[#e9edf4]">

            {members.map((member) => (

              <div

                key={member.id}

                className="flex flex-col gap-5 px-6 py-5 transition hover:bg-[#f9fbff] sm:flex-row sm:items-center sm:justify-between"

              >

                <div>

                  <div className="flex flex-wrap items-center gap-3">

                    <h3 className="font-semibold">

                      {member.username}

                    </h3>

                    <RoleBadge

                      role={member.role}

                    />

                  </div>

                  <p className="mt-1 text-sm text-[#667085]">

                    {member.email}

                  </p>

                </div>

                <div className="flex gap-2">

                  {member.role !== "owner" && (

                    <>

                      <button

                        type="button"

                        onClick={() =>

                          openEditModal(member)

                        }

                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#dce3ee] hover:bg-[#f6f8fc]"

                      >

                        <Pencil size={15} />

                      </button>

                      <button

                        type="button"

                        onClick={() =>

                          handleRemove(member)

                        }

                        disabled={

                          deletingId === member.id

                        }

                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#f1d0d4] text-red-600 transition hover:bg-red-50 disabled:opacity-50"

                      >

                        <Trash2 size={15} />

                      </button>

                    </>

                  )}

                </div>

              </div>

            ))}

          </div>

        </div>

        <div className="mt-6 rounded-[24px] border border-[#e2e7ef] bg-white p-6 shadow-[0_8px_30px_rgba(15,43,91,0.04)]">

          <div className="flex items-start gap-4">

            <Shield size={22} />

            <div>

              <h2 className="font-semibold">

                Role overview

              </h2>

              <div className="mt-4 space-y-3 text-sm text-[#667085]">

                <p>

                  <strong className="text-[#08172F]">

                    Owner:

                  </strong>{" "}

                  full control over the event.

                </p>

                <p>

                  <strong className="text-[#08172F]">

                    Admin:

                  </strong>{" "}

                  can manage team members and event data.

                </p>

                <p>

                  <strong className="text-[#08172F]">

                    Editor:

                  </strong>{" "}

                  can manage event content.

                </p>

                <p>

                  <strong className="text-[#08172F]">

                    Viewer:

                  </strong>{" "}

                  read-only access once permission enforcement

                  is completed.

                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {modalOpen && (

        <div

          className="fixed inset-0 z-50 flex items-center justify-center bg-[#08172F]/55 px-4 backdrop-blur-sm"

          onClick={closeModal}

        >

          <div

            className="w-full max-w-lg rounded-[28px] border border-[#e2e7ef] bg-white p-7 shadow-[0_30px_90px_rgba(8,23,47,0.24)]"

            onClick={(event) =>

              event.stopPropagation()

            }

          >

            <div className="flex items-start justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b8862f]">

                  Collaboration

                </p>

                <h2 className="mt-1 text-2xl font-bold tracking-[-0.03em] text-[#08172F]">

                  {editingMember

                    ? "Change member role"

                    : "Add member"}

                </h2>

              </div>

              <button

                type="button"

                onClick={closeModal}

                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eef3fb] text-[#0F2B5B] transition hover:bg-[#e4ecf8]"

              >

                <X size={18} />

              </button>

            </div>

            <form

              onSubmit={handleSubmit}

              className="mt-7 space-y-5"

            >

              {!editingMember && (

                <div>

                  <label className="mb-2 block text-sm font-medium">

                    User email

                  </label>

                  <input

                    type="email"

                    value={form.email}

                    onChange={(event) =>

                      setForm((current) => ({

                        ...current,

                        email: event.target.value,

                      }))

                    }

                    required

                    placeholder="user@example.com"

                    className="w-full rounded-xl border border-[#dce3ee] bg-white px-4 py-3 text-[#111827] outline-none transition focus:border-[#D4A646] focus:ring-2 focus:ring-[#D4A646]/15"

                  />

                </div>

              )}

              <div>

                <label className="mb-2 block text-sm font-medium">

                  Role

                </label>

                <select

                  value={form.role}

                  onChange={(event) =>

                    setForm((current) => ({

                      ...current,

                      role: event.target.value as Exclude<

                        EventMemberRole,

                        "owner"

                      >,

                    }))

                  }

                  className="w-full rounded-xl border border-[#dce3ee] bg-white px-4 py-3 text-[#111827] outline-none transition focus:border-[#D4A646] focus:ring-2 focus:ring-[#D4A646]/15"

                >

                  <option value="admin">

                    Admin

                  </option>

                  <option value="editor">

                    Editor

                  </option>

                  <option value="viewer">

                    Viewer

                  </option>

                </select>

              </div>

              <div className="flex justify-end gap-3">

                <button

                  type="button"

                  onClick={closeModal}

                  className="rounded-xl border border-[#dce3ee] bg-white px-5 py-3 font-semibold text-[#44506a] transition hover:border-[#9fb3d1] hover:bg-[#f8faff] hover:text-[#0F2B5B]"

                >

                  Cancel

                </button>

                <button

                  type="submit"

                  disabled={saving}

                  className="rounded-xl bg-[#0F2B5B] px-6 py-3 font-semibold !text-white transition hover:bg-[#173B78] hover:!text-white disabled:opacity-50"

                >

                  {saving

                    ? "Saving..."

                    : editingMember

                      ? "Save role"

                      : "Add member"}

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

function RoleBadge({

  role,

}: {

  role: EventMemberRole;

}) {

  const styles = {

    owner:

      "bg-amber-50 text-amber-700",

    admin:

      "bg-purple-50 text-purple-700",

    editor:

      "bg-blue-50 text-blue-700",

    viewer:

      "bg-gray-100 text-gray-700",

  };

  return (

    <span

      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${styles[role]}`}

    >

      {role}

    </span>

  );

}