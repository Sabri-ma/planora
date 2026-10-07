"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Armchair,
  Pencil,
  Plus,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";

import {
  createSeatAssignment,
  createSeatingTable,
  deleteSeatAssignment,
  deleteSeatingTable,
  getSeatingTables,
  SeatingTable,
  updateSeatingTable,
} from "@/services/seating";

import {
  getGuests,
  Guest,
} from "@/services/guests";

export default function SeatingPage() {
  const params = useParams();
  const router = useRouter();

  const eventId = Number(params.eventId);

  const [tables, setTables] = useState<SeatingTable[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [tableModalOpen, setTableModalOpen] =
    useState(false);

  const [assignmentModalOpen, setAssignmentModalOpen] =
    useState(false);

  const [editingTable, setEditingTable] =
    useState<SeatingTable | null>(null);

  const [selectedTable, setSelectedTable] =
    useState<SeatingTable | null>(null);

  const [saving, setSaving] = useState(false);

  const [tableForm, setTableForm] = useState({
    name: "",
    capacity: "8",
    notes: "",
  });

  const [assignmentForm, setAssignmentForm] =
    useState({
      guest: "",
      seat_number: "",
    });

  const loadData = async () => {
    try {
      setError("");

      const [tableData, guestData] =
        await Promise.all([
          getSeatingTables(eventId),
          getGuests(eventId),
        ]);

      setTables(tableData);
      setGuests(guestData);
    } catch {
      setError("Could not load seating plan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [eventId]);

  const assignedGuestIds = useMemo(() => {
    const ids = new Set<number>();

    tables.forEach((table) => {
      table.assignments.forEach((assignment) => {
        ids.add(assignment.guest);
      });
    });

    return ids;
  }, [tables]);

  const unassignedGuests = useMemo(() => {
    return guests.filter(
      (guest) => !assignedGuestIds.has(guest.id)
    );
  }, [guests, assignedGuestIds]);

  const stats = useMemo(() => {
    const totalSeats = tables.reduce(
      (total, table) =>
        total + table.capacity,
      0
    );

    const occupied = tables.reduce(
      (total, table) =>
        total + table.occupied_seats,
      0
    );

    return {
      tables: tables.length,
      totalSeats,
      occupied,
      unassigned: unassignedGuests.length,
    };
  }, [tables, unassignedGuests]);

  const openCreateTableModal = () => {
    setEditingTable(null);

    setTableForm({
      name: "",
      capacity: "8",
      notes: "",
    });

    setTableModalOpen(true);
  };

  const openEditTableModal = (
    table: SeatingTable
  ) => {
    setEditingTable(table);

    setTableForm({
      name: table.name,
      capacity: String(table.capacity),
      notes: table.notes,
    });

    setTableModalOpen(true);
  };

  const handleTableSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      if (editingTable) {
        await updateSeatingTable(
          editingTable.id,
          {
            name: tableForm.name,
            capacity: Number(
              tableForm.capacity
            ),
            notes: tableForm.notes,
          }
        );
      } else {
        await createSeatingTable({
          event: eventId,
          name: tableForm.name,
          capacity: Number(
            tableForm.capacity
          ),
          notes: tableForm.notes,
        });
      }

      setTableModalOpen(false);
      setEditingTable(null);

      await loadData();
    } catch {
      setError(
        editingTable
          ? "Could not update table."
          : "Could not create table."
      );
    } finally {
      setSaving(false);
    }
  };

  const openAssignmentModal = (
    table: SeatingTable
  ) => {
    setSelectedTable(table);

    setAssignmentForm({
      guest: "",
      seat_number: "",
    });

    setAssignmentModalOpen(true);
  };

  const handleAssignmentSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (
      !selectedTable ||
      !assignmentForm.guest
    ) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      await createSeatAssignment({
        table: selectedTable.id,
        guest: Number(
          assignmentForm.guest
        ),
        seat_number:
          assignmentForm.seat_number
            ? Number(
                assignmentForm.seat_number
              )
            : null,
      });

      setAssignmentModalOpen(false);
      setSelectedTable(null);

      await loadData();
    } catch {
      setError(
        "Could not assign guest to table."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveAssignment = async (
    assignmentId: number
  ) => {
    try {
      await deleteSeatAssignment(
        assignmentId
      );

      await loadData();
    } catch {
      setError(
        "Could not remove guest from table."
      );
    }
  };

  const handleDeleteTable = async (
    tableId: number
  ) => {
    const confirmed = window.confirm(
      "Delete this table and its seat assignments?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteSeatingTable(tableId);

      await loadData();
    } catch {
      setError("Could not delete table.");
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f5ef]">
        <p className="text-[#746f67]">
          Loading seating plan...
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
            onClick={openCreateTableModal}
            className="flex items-center gap-2 rounded-full bg-[#1f1d1a] px-5 py-2.5 text-sm font-medium !text-white"
          >
            <Plus size={16} />
            Add table
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-sm uppercase tracking-[0.16em] text-[#9a7b4c]">
          Seating planner
        </p>

        <h1 className="mt-2 text-4xl font-semibold tracking-tight">
          Seating
        </h1>

        <p className="mt-3 text-[#746f67]">
          Create tables and organize your
          guests for the event.
        </p>

        {error && (
          <div className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Tables"
            value={stats.tables}
          />

          <StatCard
            title="Total seats"
            value={stats.totalSeats}
          />

          <StatCard
            title="Assigned"
            value={stats.occupied}
          />

          <StatCard
            title="Unassigned guests"
            value={stats.unassigned}
          />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            {tables.length === 0 ? (
              <div className="rounded-[24px] border border-[#e5ded3] bg-white p-8">
                <Armchair size={30} />

                <h2 className="mt-4 text-xl font-semibold">
                  No tables yet
                </h2>

                <p className="mt-2 text-[#746f67]">
                  Create your first table to
                  start assigning guests.
                </p>
              </div>
            ) : (
              tables.map((table) => (
                <div
                  key={table.id}
                  className="rounded-[24px] border border-[#e5ded3] bg-white p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl font-semibold">
                          {table.name}
                        </h2>

                        <span className="rounded-full bg-[#f3ede4] px-3 py-1 text-xs font-medium">
                          {
                            table.occupied_seats
                          }{" "}
                          / {table.capacity}
                        </span>
                      </div>

                      {table.notes && (
                        <p className="mt-2 text-sm text-[#746f67]">
                          {table.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          openAssignmentModal(
                            table
                          )
                        }
                        disabled={
                          table.occupied_seats >=
                            table.capacity ||
                          unassignedGuests.length ===
                            0
                        }
                        className="flex items-center gap-2 rounded-full border border-[#ddd5ca] px-4 py-2 text-sm font-medium disabled:opacity-40"
                      >
                        <UserPlus
                          size={15}
                        />
                        Assign guest
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          openEditTableModal(
                            table
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ddd5ca]"
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteTable(
                            table.id
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ddd5ca] text-red-600"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {table.assignments.length ===
                    0 ? (
                      <p className="text-sm text-[#817b72]">
                        No guests assigned.
                      </p>
                    ) : (
                      table.assignments.map(
                        (assignment) => (
                          <div
                            key={
                              assignment.id
                            }
                            className="flex items-center justify-between rounded-2xl bg-[#f8f5ef] px-4 py-3"
                          >
                            <div>
                              <p className="font-medium">
                                {
                                  assignment.guest_name
                                }
                              </p>

                              {assignment.seat_number && (
                                <p className="mt-1 text-xs text-[#817b72]">
                                  Seat{" "}
                                  {
                                    assignment.seat_number
                                  }
                                </p>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveAssignment(
                                  assignment.id
                                )
                              }
                              className="text-red-500"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        )
                      )
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <aside className="h-fit rounded-[24px] border border-[#e5ded3] bg-white p-6">
            <div className="flex items-center gap-2">
              <Users size={19} />

              <h2 className="text-lg font-semibold">
                Unassigned guests
              </h2>
            </div>

            <p className="mt-2 text-sm text-[#746f67]">
              Guests who are not assigned to
              any table yet.
            </p>

            <div className="mt-5 space-y-2">
              {unassignedGuests.length ===
              0 ? (
                <p className="text-sm text-[#817b72]">
                  Everyone is assigned.
                </p>
              ) : (
                unassignedGuests.map(
                  (guest) => (
                    <div
                      key={guest.id}
                      className="rounded-2xl bg-[#f8f5ef] px-4 py-3"
                    >
                      <p className="font-medium">
                        {guest.first_name}{" "}
                        {guest.last_name}
                      </p>

                      <p className="mt-1 text-xs capitalize text-[#817b72]">
                        {guest.group} ·{" "}
                        {guest.rsvp_status}
                      </p>
                    </div>
                  )
                )
              )}
            </div>
          </aside>
        </div>
      </section>

      {tableModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() =>
            setTableModalOpen(false)
          }
        >
          <div
            className="w-full max-w-lg rounded-[28px] bg-[#fffdf9] p-7"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <h2 className="text-2xl font-semibold">
              {editingTable
                ? "Edit table"
                : "Add table"}
            </h2>

            <form
              onSubmit={handleTableSubmit}
              className="mt-6 space-y-5"
            >
              <InputField
                label="Table name"
                value={tableForm.name}
                onChange={(value) =>
                  setTableForm(
                    (current) => ({
                      ...current,
                      name: value,
                    })
                  )
                }
              />

              <InputField
                label="Capacity"
                value={tableForm.capacity}
                type="number"
                onChange={(value) =>
                  setTableForm(
                    (current) => ({
                      ...current,
                      capacity: value,
                    })
                  )
                }
              />

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Notes
                </label>

                <textarea
                  value={tableForm.notes}
                  onChange={(event) =>
                    setTableForm(
                      (current) => ({
                        ...current,
                        notes:
                          event.target.value,
                      })
                    )
                  }
                  rows={3}
                  className="w-full rounded-2xl border border-[#ddd5ca] px-4 py-3"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setTableModalOpen(false)
                  }
                  className="rounded-full border border-[#ddd5ca] px-5 py-3"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-[#1f1d1a] px-6 py-3 font-medium !text-white"
                >
                  {saving
                    ? "Saving..."
                    : editingTable
                      ? "Save changes"
                      : "Add table"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {assignmentModalOpen &&
        selectedTable && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            onClick={() =>
              setAssignmentModalOpen(false)
            }
          >
            <div
              className="w-full max-w-lg rounded-[28px] bg-[#fffdf9] p-7"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <h2 className="text-2xl font-semibold">
                Assign guest
              </h2>

              <p className="mt-2 text-sm text-[#746f67]">
                {selectedTable.name}
              </p>

              <form
                onSubmit={
                  handleAssignmentSubmit
                }
                className="mt-6 space-y-5"
              >
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Guest
                  </label>

                  <select
                    value={
                      assignmentForm.guest
                    }
                    onChange={(event) =>
                      setAssignmentForm(
                        (current) => ({
                          ...current,
                          guest:
                            event.target
                              .value,
                        })
                      )
                    }
                    required
                    className="w-full rounded-2xl border border-[#ddd5ca] bg-white px-4 py-3"
                  >
                    <option value="">
                      Select guest
                    </option>

                    {unassignedGuests.map(
                      (guest) => (
                        <option
                          key={guest.id}
                          value={guest.id}
                        >
                          {
                            guest.first_name
                          }{" "}
                          {
                            guest.last_name
                          }
                        </option>
                      )
                    )}
                  </select>
                </div>

                <InputField
                  label="Seat number"
                  type="number"
                  value={
                    assignmentForm.seat_number
                  }
                  onChange={(value) =>
                    setAssignmentForm(
                      (current) => ({
                        ...current,
                        seat_number:
                          value,
                      })
                    )
                  }
                />

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setAssignmentModalOpen(
                        false
                      )
                    }
                    className="rounded-full border border-[#ddd5ca] px-5 py-3"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-full bg-[#1f1d1a] px-6 py-3 font-medium !text-white"
                  >
                    {saving
                      ? "Assigning..."
                      : "Assign guest"}
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
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-[22px] border border-[#e5ded3] bg-white p-5">
      <p className="text-sm text-[#817b72]">
        {title}
      </p>

      <p className="mt-2 text-3xl font-semibold">
        {value}
      </p>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        min={
          type === "number"
            ? "1"
            : undefined
        }
        className="w-full rounded-2xl border border-[#ddd5ca] bg-white px-4 py-3"
        required
      />
    </div>
  );
}