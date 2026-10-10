"use client";

import { useEffect, useMemo, useState } from "react";

import { useParams } from "next/navigation";

import {
  CircleDollarSign,

  Pencil,

  Plus,

  Trash2,

  WalletCards,

  X,

} from "lucide-react";

import {

  BudgetCategory,

  BudgetItem,

  createBudgetItem,

  deleteBudgetItem,

  getBudgetItems,

  PaymentStatus,

  updateBudgetItem,

} from "@/services/budgets";

export default function BudgetPage() {

  const params = useParams();
  const eventId = Number(params.eventId);

  const [items, setItems] = useState<BudgetItem[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

  const [editingItem, setEditingItem] =

    useState<BudgetItem | null>(null);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] =

    useState<number | null>(null);

  const [categoryFilter, setCategoryFilter] =

    useState<"all" | BudgetCategory>("all");

  const [statusFilter, setStatusFilter] =

    useState<"all" | PaymentStatus>("all");

  const emptyForm = {

    category: "other" as BudgetCategory,

    name: "",

    estimated_amount: "",

    actual_amount: "",

    amount_paid: "",

    payment_status: "unpaid" as PaymentStatus,

    due_date: "",

    vendor_name: "",

    notes: "",

  };

  const [form, setForm] = useState(emptyForm);

  const loadBudget = async () => {

    try {

      setError("");

      const data = await getBudgetItems(eventId);

      setItems(data);

    } catch {

      setError("Could not load budget items.");

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadBudget();

  }, [eventId]);

  const stats = useMemo(() => {

    const estimated = items.reduce(

      (total, item) =>

        total + Number(item.estimated_amount || 0),

      0

    );

    const actual = items.reduce(

      (total, item) =>

        total + Number(item.actual_amount || 0),

      0

    );

    const paid = items.reduce(

      (total, item) =>

        total + Number(item.amount_paid || 0),

      0

    );

    const remaining = Math.max(actual - paid, 0);

    return {

      estimated,

      actual,

      paid,

      remaining,

    };

  }, [items]);

  const filteredItems = useMemo(() => {

    return items.filter((item) => {

      const categoryMatches =

        categoryFilter === "all" ||

        item.category === categoryFilter;

      const statusMatches =

        statusFilter === "all" ||

        item.payment_status === statusFilter;

      return categoryMatches && statusMatches;

    });

  }, [items, categoryFilter, statusFilter]);

  const formatMoney = (amount: number) => {

    return new Intl.NumberFormat("fr-MA", {

      style: "currency",

      currency: "MAD",

      maximumFractionDigits: 2,

    }).format(amount);

  };

  const handleChange = (

    event:

      | React.ChangeEvent<HTMLInputElement>

      | React.ChangeEvent<HTMLTextAreaElement>

      | React.ChangeEvent<HTMLSelectElement>

  ) => {

    const { name, value } = event.target;

    setForm((current) => ({

      ...current,

      [name]: value,

    }));

  };

  const openCreateModal = () => {

    setEditingItem(null);

    setForm(emptyForm);

    setModalOpen(true);

  };

  const openEditModal = (item: BudgetItem) => {

    setEditingItem(item);

    setForm({

      category: item.category,

      name: item.name,

      estimated_amount: item.estimated_amount,

      actual_amount: item.actual_amount,

      amount_paid: item.amount_paid,

      payment_status: item.payment_status,

      due_date: item.due_date ?? "",

      vendor_name: item.vendor_name,

      notes: item.notes,

    });

    setModalOpen(true);

  };

  const closeModal = () => {

    setModalOpen(false);

    setEditingItem(null);

    setForm(emptyForm);

  };

  const handleSubmit = async (

    event: React.FormEvent

  ) => {

    event.preventDefault();

    setSaving(true);

    setError("");

    try {

      const payload = {

        category: form.category,

        name: form.name,

        estimated_amount:

          form.estimated_amount || "0",

        actual_amount:

          form.actual_amount || "0",

        amount_paid: form.amount_paid || "0",

        payment_status:

          form.payment_status,

        due_date: form.due_date || null,

        vendor_name: form.vendor_name,

        notes: form.notes,

      };

      if (editingItem) {

        await updateBudgetItem(

          editingItem.id,

          payload

        );

      } else {

        await createBudgetItem({

          event: eventId,

          ...payload,

        });

      }

      closeModal();

      await loadBudget();

    } catch {

      setError(

        editingItem

          ? "Could not update budget item."

          : "Could not create budget item."

      );

    } finally {

      setSaving(false);

    }

  };

  const handleDelete = async (

    itemId: number

  ) => {

    const confirmed = window.confirm(

      "Are you sure you want to delete this budget item?"

    );

    if (!confirmed) {

      return;

    }

    setDeletingId(itemId);

    setError("");

    try {

      await deleteBudgetItem(itemId);

      setItems((current) =>

        current.filter(

          (item) => item.id !== itemId

        )

      );

    } catch {

      setError(

        "Could not delete budget item."

      );

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
            Loading budget...
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
                Financial planning
              </p>

              <h1 className="mt-2 text-4xl font-bold tracking-[-0.04em] !text-white">
                Budget
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 !text-white/70 sm:text-base">
                Track planned costs, real spending, payments and everything still outstanding.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#D4A646] px-5 py-3 text-sm font-bold !text-[#08172F] shadow-[0_10px_28px_rgba(212,166,70,0.24)] transition hover:-translate-y-0.5 hover:bg-[#E7C875] hover:!text-[#08172F]"
            >
              <Plus size={16} />
              Add expense
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

            title="Estimated"

            value={formatMoney(

              stats.estimated

            )}

          />

          <StatCard

            title="Actual cost"

            value={formatMoney(

              stats.actual

            )}

          />

          <StatCard

            title="Paid"

            value={formatMoney(stats.paid)}

          />

          <StatCard

            title="Remaining"

            value={formatMoney(

              stats.remaining

            )}

          />

        </div>

        <div className="mt-6 grid gap-4 rounded-[22px] border border-[#e2e7ef] bg-white p-5 shadow-[0_8px_30px_rgba(15,43,91,0.04)] sm:grid-cols-2">

          <div>

            <label className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-[#8b94a8]">

              Category

            </label>

            <select

              value={categoryFilter}

              onChange={(event) =>

                setCategoryFilter(

                  event.target.value as

                    | "all"

                    | BudgetCategory

                )

              }

              className="w-full rounded-xl border border-[#dce3ee] bg-white px-4 py-2.5 text-[#111827] outline-none transition focus:border-[#D4A646] focus:ring-2 focus:ring-[#D4A646]/15"

            >

              <option value="all">

                All categories

              </option>

              <option value="venue">

                Venue

              </option>

              <option value="catering">

                Catering

              </option>

              <option value="photography">

                Photography

              </option>

              <option value="decoration">

                Decoration

              </option>

              <option value="music">

                Music

              </option>

              <option value="clothing">

                Clothing

              </option>

              <option value="transport">

                Transport

              </option>

              <option value="accommodation">

                Accommodation

              </option>

              <option value="other">

                Other

              </option>

            </select>

          </div>

          <div>

            <label className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-[#8b94a8]">

              Payment status

            </label>

            <select

              value={statusFilter}

              onChange={(event) =>

                setStatusFilter(

                  event.target.value as

                    | "all"

                    | PaymentStatus

                )

              }

              className="w-full rounded-xl border border-[#dce3ee] bg-white px-4 py-2.5 text-[#111827] outline-none transition focus:border-[#D4A646] focus:ring-2 focus:ring-[#D4A646]/15"

            >

              <option value="all">

                All statuses

              </option>

              <option value="unpaid">

                Unpaid

              </option>

              <option value="partial">

                Partial

              </option>

              <option value="paid">

                Paid

              </option>

            </select>

          </div>

        </div>

        <div className="mt-6 overflow-hidden rounded-[24px] border border-[#e2e7ef] bg-white shadow-[0_8px_30px_rgba(15,43,91,0.04)]">

          {filteredItems.length === 0 ? (

            <div className="p-8">

              <WalletCards size={28} />

              <h2 className="mt-4 text-xl font-semibold">

                No budget items

              </h2>

              <p className="mt-2 text-[#667085]">

                Start by adding your first

                planned expense.

              </p>

            </div>

          ) : (

            <div className="divide-y divide-[#e9edf4]">

              {filteredItems.map(

                (item) => (

                  <div

                    key={item.id}

                    className="flex flex-col gap-5 p-6 transition hover:bg-[#f9fbff] lg:flex-row lg:items-center lg:justify-between"

                  >

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-3">

                        <h2 className="text-lg font-semibold">

                          {item.name}

                        </h2>

                        <span className="rounded-full bg-[#eef3fb] px-3 py-1 text-xs font-semibold capitalize text-[#0F2B5B]">

                          {item.category}

                        </span>

                        <PaymentBadge

                          status={

                            item.payment_status

                          }

                        />

                      </div>

                      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#667085]">

                        <span>

                          Estimated:{" "}

                          {formatMoney(

                            Number(

                              item.estimated_amount

                            )

                          )}

                        </span>

                        <span>

                          Actual:{" "}

                          {formatMoney(

                            Number(

                              item.actual_amount

                            )

                          )}

                        </span>

                        <span>

                          Paid:{" "}

                          {formatMoney(

                            Number(

                              item.amount_paid

                            )

                          )}

                        </span>

                        {item.vendor_name && (

                          <span>

                            Vendor:{" "}

                            {

                              item.vendor_name

                            }

                          </span>

                        )}

                        {item.due_date && (

                          <span>

                            Due:{" "}

                            {new Date(

                              item.due_date

                            ).toLocaleDateString()}

                          </span>

                        )}

                      </div>

                      {item.notes && (

                        <p className="mt-3 text-sm text-[#8b94a8]">

                          {item.notes}

                        </p>

                      )}

                    </div>

                    <div className="flex shrink-0 gap-2">

                      <button

                        type="button"

                        onClick={() =>

                          openEditModal(

                            item

                          )

                        }

                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#dce3ee] text-[#0F2B5B] transition hover:border-[#9fb3d1] hover:bg-[#eef4ff] hover:text-[#1D4ED8]"

                      >

                        <Pencil

                          size={16}

                        />

                      </button>

                      <button

                        type="button"

                        onClick={() =>

                          handleDelete(

                            item.id

                          )

                        }

                        disabled={

                          deletingId ===

                          item.id

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

        <BudgetModal

          title={

            editingItem

              ? "Edit expense"

              : "Add expense"

          }

          form={form}

          onChange={handleChange}

          onSubmit={handleSubmit}

          onClose={closeModal}

          saving={saving}

        />

      )}

    </main>

  );

}

function StatCard({

  title,

  value,

}: {

  title: string;

  value: string;

}) {

  return (

    <div className="rounded-[22px] border border-[#e2e7ef] bg-white p-5 shadow-[0_8px_30px_rgba(15,43,91,0.04)]">

      <CircleDollarSign

        size={19}

      />

      <p className="mt-4 text-sm text-[#8b94a8]">

        {title}

      </p>

      <p className="mt-1 text-2xl font-bold tracking-[-0.03em] text-[#08172F]">

        {value}

      </p>

    </div>

  );

}

function PaymentBadge({

  status,

}: {

  status: PaymentStatus;

}) {

  const styles = {

    unpaid:

      "bg-red-50 text-red-700",

    partial:

      "bg-amber-50 text-amber-700",

    paid:

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

interface BudgetModalProps {

  title: string;

  form: {

    category: BudgetCategory;

    name: string;

    estimated_amount: string;

    actual_amount: string;

    amount_paid: string;

    payment_status: PaymentStatus;

    due_date: string;

    vendor_name: string;

    notes: string;

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

  saving: boolean;

}

function BudgetModal({

  title,

  form,

  onChange,

  onSubmit,

  onClose,

  saving,

}: BudgetModalProps) {

  return (

    <div

      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#08172F]/55 px-4 py-8 backdrop-blur-sm"

      onClick={onClose}

    >

      <div

        className="w-full max-w-2xl rounded-[28px] border border-[#e2e7ef] bg-white p-7 shadow-[0_30px_90px_rgba(8,23,47,0.24)]"

        onClick={(event) =>

          event.stopPropagation()

        }

      >

        <div className="flex items-start justify-between">

          <div>

            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b8862f]">

              Budget management

            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-[-0.03em] text-[#08172F]">

              {title}

            </h2>

          </div>

          <button

            type="button"

            onClick={onClose}

            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eef3fb] text-[#0F2B5B] transition hover:bg-[#e4ecf8]"

          >

            <X size={18} />

          </button>

        </div>

        <form

          onSubmit={onSubmit}

          className="mt-7 space-y-5"

        >

          <div>

            <label className="mb-2 block text-sm font-medium">

              Expense name

            </label>

            <input

              name="name"

              value={form.name}

              onChange={onChange}

              required

              placeholder="Wedding venue"

              className="w-full rounded-xl border border-[#dce3ee] bg-white px-4 py-3 text-[#111827] outline-none transition focus:border-[#D4A646] focus:ring-2 focus:ring-[#D4A646]/15"

            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">

              Category

            </label>

            <select

              name="category"

              value={form.category}

              onChange={onChange}

              className="w-full rounded-xl border border-[#dce3ee] bg-white px-4 py-3 text-[#111827] outline-none transition focus:border-[#D4A646] focus:ring-2 focus:ring-[#D4A646]/15"

            >

              <option value="venue">

                Venue

              </option>

              <option value="catering">

                Catering

              </option>

              <option value="photography">

                Photography

              </option>

              <option value="decoration">

                Decoration

              </option>

              <option value="music">

                Music

              </option>

              <option value="clothing">

                Clothing

              </option>

              <option value="transport">

                Transport

              </option>

              <option value="accommodation">

                Accommodation

              </option>

              <option value="other">

                Other

              </option>

            </select>

          </div>

          <div className="grid gap-5 sm:grid-cols-3">

            <MoneyInput

              label="Estimated amount"

              name="estimated_amount"

              value={

                form.estimated_amount

              }

              onChange={onChange}

            />

            <MoneyInput

              label="Actual amount"

              name="actual_amount"

              value={form.actual_amount}

              onChange={onChange}

            />

            <MoneyInput

              label="Amount paid"

              name="amount_paid"

              value={form.amount_paid}

              onChange={onChange}

            />

          </div>

          <div className="grid gap-5 sm:grid-cols-2">

            <div>

              <label className="mb-2 block text-sm font-medium">

                Payment status

              </label>

              <select

                name="payment_status"

                value={

                  form.payment_status

                }

                onChange={onChange}

                className="w-full rounded-xl border border-[#dce3ee] bg-white px-4 py-3 text-[#111827] outline-none transition focus:border-[#D4A646] focus:ring-2 focus:ring-[#D4A646]/15"

              >

                <option value="unpaid">

                  Unpaid

                </option>

                <option value="partial">

                  Partial

                </option>

                <option value="paid">

                  Paid

                </option>

              </select>

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">

                Due date

              </label>

              <input

                type="date"

                name="due_date"

                value={form.due_date}

                onChange={onChange}

                className="w-full rounded-xl border border-[#dce3ee] bg-white px-4 py-3 text-[#111827] outline-none transition focus:border-[#D4A646] focus:ring-2 focus:ring-[#D4A646]/15"

              />

            </div>

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">

              Vendor

            </label>

            <input

              name="vendor_name"

              value={form.vendor_name}

              onChange={onChange}

              placeholder="Vendor name"

              className="w-full rounded-xl border border-[#dce3ee] bg-white px-4 py-3 text-[#111827] outline-none transition focus:border-[#D4A646] focus:ring-2 focus:ring-[#D4A646]/15"

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

              className="w-full resize-none rounded-xl border border-[#dce3ee] bg-white px-4 py-3 text-[#111827] outline-none transition focus:border-[#D4A646] focus:ring-2 focus:ring-[#D4A646]/15"

            />

          </div>

          <div className="flex justify-end gap-3 pt-2">

            <button

              type="button"

              onClick={onClose}

              className="rounded-xl border border-[#dce3ee] bg-white px-5 py-3 font-semibold text-[#44506a] transition hover:border-[#9fb3d1] hover:bg-[#f8faff] hover:text-[#0F2B5B]"

            >

              Cancel

            </button>

            <button

              type="submit"

              disabled={saving}

              className="rounded-xl bg-[#0F2B5B] px-6 py-3 font-semibold !text-white transition hover:bg-[#173B78] hover:!text-white disabled:opacity-60"

            >

              {saving

                ? "Saving..."

                : editingItemLabel(title)}

            </button>

          </div>

        </form>

      </div>

    </div>

  );

}

function MoneyInput({

  label,

  name,

  value,

  onChange,

}: {

  label: string;

  name: string;

  value: string;

  onChange: (

    event: React.ChangeEvent<HTMLInputElement>

  ) => void;

}) {

  return (

    <div>

      <label className="mb-2 block text-sm font-medium">

        {label}

      </label>

      <input

        type="number"

        min="0"

        step="0.01"

        name={name}

        value={value}

        onChange={onChange}

        placeholder="0.00"

        className="w-full rounded-xl border border-[#dce3ee] bg-white px-4 py-3 text-[#111827] outline-none transition focus:border-[#D4A646] focus:ring-2 focus:ring-[#D4A646]/15"

      />

    </div>

  );

}

function editingItemLabel(

  title: string

) {

  return title.startsWith("Edit")

    ? "Save changes"

    : "Add expense";

}