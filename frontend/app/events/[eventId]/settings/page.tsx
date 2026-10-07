"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
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
  const router = useRouter();

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
      <main className="flex min-h-screen items-center justify-center bg-[#f8f5ef]">
        <p className="text-[#746f67]">
          Loading team...
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
            className="flex items-center gap-2 text-sm text-[#746f67] hover:text-black"
          >
            <ArrowLeft size={16} />
            Back to event
          </button>

          <button
            type="button"
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-full bg-[#1f1d1a] px-5 py-2.5 text-sm font-medium !text-white"
          >
            <Plus size={16} />
            Add member
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-sm uppercase tracking-[0.16em] text-[#9a7b4c]">
          Collaboration
        </p>

        <h1 className="mt-2 text-4xl font-semibold tracking-tight">
          Team & permissions
        </h1>

        <p className="mt-3 max-w-2xl text-[#746f67]">
          Invite other Planora users and control
          their access to this event.
        </p>

        {error && (
          <div className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

        <div className="mt-8 overflow-hidden rounded-[24px] border border-[#e5ded3] bg-white">
          <div className="border-b border-[#eee7dd] px-6 py-5">
            <h2 className="text-xl font-semibold">
              Event members
            </h2>

            <p className="mt-1 text-sm text-[#746f67]">
              Users must already have a Planora account
              before they can be added.
            </p>
          </div>

          <div className="divide-y divide-[#eee7dd]">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex flex-col gap-5 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
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

                  <p className="mt-1 text-sm text-[#746f67]">
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
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ddd5ca] hover:bg-[#f8f5ef]"
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
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ddd5ca] text-red-600 hover:bg-red-50 disabled:opacity-50"
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

        <div className="mt-8 rounded-[24px] border border-[#e5ded3] bg-white p-6">
          <div className="flex items-start gap-4">
            <Shield size={22} />

            <div>
              <h2 className="font-semibold">
                Role overview
              </h2>

              <div className="mt-4 space-y-3 text-sm text-[#746f67]">
                <p>
                  <strong className="text-black">
                    Owner:
                  </strong>{" "}
                  full control over the event.
                </p>

                <p>
                  <strong className="text-black">
                    Admin:
                  </strong>{" "}
                  can manage team members and event data.
                </p>

                <p>
                  <strong className="text-black">
                    Editor:
                  </strong>{" "}
                  can manage event content.
                </p>

                <p>
                  <strong className="text-black">
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-lg rounded-[28px] bg-[#fffdf9] p-7 shadow-xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#817b72]">
                  Collaboration
                </p>

                <h2 className="mt-1 text-2xl font-semibold">
                  {editingMember
                    ? "Change member role"
                    : "Add member"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f1ebe2]"
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
                    className="w-full rounded-2xl border border-[#ddd5ca] bg-white px-4 py-3 outline-none"
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
                  className="w-full rounded-2xl border border-[#ddd5ca] bg-white px-4 py-3 outline-none"
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
                  className="rounded-full border border-[#ddd5ca] px-5 py-3"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-[#1f1d1a] px-6 py-3 font-medium !text-white disabled:opacity-50"
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
      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${styles[role]}`}
    >
      {role}
    </span>
  );
}