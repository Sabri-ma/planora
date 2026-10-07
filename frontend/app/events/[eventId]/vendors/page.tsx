"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import {
  createVendor,
  deleteVendor,
  getVendors,
  updateVendor,
  Vendor,
  VendorCategory,
  VendorStatus,
} from "@/services/vendors";

export default function VendorsPage() {
  const params = useParams();
  const router = useRouter();

  const eventId = Number(params.eventId);

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] =
    useState<Vendor | null>(null);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  const [categoryFilter, setCategoryFilter] =
    useState<"all" | VendorCategory>("all");

  const [statusFilter, setStatusFilter] =
    useState<"all" | VendorStatus>("all");

  const emptyForm = {
    name: "",
    category: "other" as VendorCategory,
    contact_name: "",
    email: "",
    phone: "",
    website: "",
    location: "",
    status: "prospect" as VendorStatus,
    quoted_price: "",
    notes: "",
  };

  const [form, setForm] = useState(emptyForm);

  const loadVendors = async () => {
    try {
      setError("");

      const data = await getVendors(eventId);
      setVendors(data);
    } catch {
      setError("Could not load vendors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendors();
  }, [eventId]);

  const stats = useMemo(() => {
    return {
      total: vendors.length,
      booked: vendors.filter(
        (vendor) => vendor.status === "booked"
      ).length,
      prospect: vendors.filter(
        (vendor) => vendor.status === "prospect"
      ).length,
      negotiating: vendors.filter(
        (vendor) => vendor.status === "negotiating"
      ).length,
    };
  }, [vendors]);

  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) => {
      const categoryMatches =
        categoryFilter === "all" ||
        vendor.category === categoryFilter;

      const statusMatches =
        statusFilter === "all" ||
        vendor.status === statusFilter;

      return categoryMatches && statusMatches;
    });
  }, [vendors, categoryFilter, statusFilter]);

  const formatMoney = (value: string) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      maximumFractionDigits: 2,
    }).format(Number(value || 0));
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
    setEditingVendor(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (vendor: Vendor) => {
    setEditingVendor(vendor);

    setForm({
      name: vendor.name,
      category: vendor.category,
      contact_name: vendor.contact_name,
      email: vendor.email,
      phone: vendor.phone,
      website: vendor.website,
      location: vendor.location,
      status: vendor.status,
      quoted_price: vendor.quoted_price,
      notes: vendor.notes,
    });

    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingVendor(null);
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
        name: form.name,
        category: form.category,
        contact_name: form.contact_name,
        email: form.email,
        phone: form.phone,
        website: form.website,
        location: form.location,
        status: form.status,
        quoted_price:
          form.quoted_price || "0",
        notes: form.notes,
      };

      if (editingVendor) {
        await updateVendor(
          editingVendor.id,
          payload
        );
      } else {
        await createVendor({
          event: eventId,
          ...payload,
        });
      }

      closeModal();
      await loadVendors();
    } catch {
      setError(
        editingVendor
          ? "Could not update vendor."
          : "Could not create vendor."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (
    vendorId: number
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this vendor?"
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(vendorId);
    setError("");

    try {
      await deleteVendor(vendorId);

      setVendors((current) =>
        current.filter(
          (vendor) => vendor.id !== vendorId
        )
      );
    } catch {
      setError("Could not delete vendor.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f5ef]">
        <p className="text-[#746f67]">
          Loading vendors...
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
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-full bg-[#1f1d1a] px-5 py-2.5 text-sm font-medium !text-white"
          >
            <Plus size={16} />
            Add vendor
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-sm uppercase tracking-[0.16em] text-[#9a7b4c]">
          Vendor management
        </p>

        <h1 className="mt-2 text-4xl font-semibold tracking-tight">
          Vendors
        </h1>

        <p className="mt-3 text-[#746f67]">
          Track your event suppliers, quotes,
          contact details and booking status.
        </p>

        {error && (
          <div className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total vendors"
            value={stats.total}
            icon={<Building2 size={19} />}
          />

          <StatCard
            title="Booked"
            value={stats.booked}
            icon={
              <CheckCircle2
                size={19}
                className="text-green-600"
              />
            }
          />

          <StatCard
            title="Prospects"
            value={stats.prospect}
            icon={
              <Clock3
                size={19}
                className="text-[#9a7b4c]"
              />
            }
          />

          <StatCard
            title="Negotiating"
            value={stats.negotiating}
            icon={
              <Clock3
                size={19}
                className="text-blue-600"
              />
            }
          />
        </div>

        <div className="mt-8 grid gap-4 rounded-[22px] border border-[#e5ded3] bg-white p-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-[#817b72]">
              Category
            </label>

            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(
                  event.target.value as
                    | "all"
                    | VendorCategory
                )
              }
              className="w-full rounded-xl border border-[#ddd5ca] px-4 py-2.5 outline-none"
            >
              <option value="all">
                All categories
              </option>
              <option value="venue">Venue</option>
              <option value="catering">
                Catering
              </option>
              <option value="photography">
                Photography
              </option>
              <option value="videography">
                Videography
              </option>
              <option value="decoration">
                Decoration
              </option>
              <option value="music">Music</option>
              <option value="dj">DJ</option>
              <option value="transport">
                Transport
              </option>
              <option value="accommodation">
                Accommodation
              </option>
              <option value="beauty">Beauty</option>
              <option value="clothing">
                Clothing
              </option>
              <option value="cake">Cake</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-[#817b72]">
              Status
            </label>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as
                    | "all"
                    | VendorStatus
                )
              }
              className="w-full rounded-xl border border-[#ddd5ca] px-4 py-2.5 outline-none"
            >
              <option value="all">
                All statuses
              </option>
              <option value="prospect">
                Prospect
              </option>
              <option value="contacted">
                Contacted
              </option>
              <option value="negotiating">
                Negotiating
              </option>
              <option value="booked">
                Booked
              </option>
              <option value="rejected">
                Rejected
              </option>
            </select>
          </div>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {filteredVendors.length === 0 ? (
            <div className="col-span-full rounded-[24px] border border-[#e5ded3] bg-white p-8">
              <Building2 size={28} />

              <h2 className="mt-4 text-xl font-semibold">
                No vendors found
              </h2>

              <p className="mt-2 text-[#746f67]">
                Add your first vendor or change
                the active filters.
              </p>
            </div>
          ) : (
            filteredVendors.map((vendor) => (
              <div
                key={vendor.id}
                className="rounded-[24px] border border-[#e5ded3] bg-white p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-semibold">
                        {vendor.name}
                      </h2>

                      <span className="rounded-full bg-[#f3ede4] px-3 py-1 text-xs font-medium capitalize">
                        {vendor.category}
                      </span>

                      <VendorStatusBadge
                        status={vendor.status}
                      />
                    </div>

                    {vendor.location && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-[#746f67]">
                        <MapPin size={15} />
                        {vendor.location}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        openEditModal(vendor)
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e5ded3] hover:bg-[#f8f5ef]"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(vendor.id)
                      }
                      disabled={
                        deletingId === vendor.id
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e5ded3] text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="mt-5 space-y-2 text-sm text-[#746f67]">
                  {vendor.contact_name && (
                    <p>
                      Contact: {vendor.contact_name}
                    </p>
                  )}

                  {vendor.email && (
                    <p className="flex items-center gap-2">
                      <Mail size={14} />
                      {vendor.email}
                    </p>
                  )}

                  {vendor.phone && (
                    <p className="flex items-center gap-2">
                      <Phone size={14} />
                      {vendor.phone}
                    </p>
                  )}
                </div>

                <div className="mt-6 border-t border-[#eee7dd] pt-5">
                  <p className="text-sm text-[#817b72]">
                    Quoted price
                  </p>

                  <p className="mt-1 text-2xl font-semibold">
                    {formatMoney(
                      vendor.quoted_price
                    )}
                  </p>
                </div>

                {vendor.notes && (
                  <p className="mt-4 text-sm text-[#817b72]">
                    {vendor.notes}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {modalOpen && (
        <VendorModal
          title={
            editingVendor
              ? "Edit vendor"
              : "Add vendor"
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

function VendorStatusBadge({
  status,
}: {
  status: VendorStatus;
}) {
  const styles = {
    prospect:
      "bg-gray-100 text-gray-700",
    contacted:
      "bg-blue-50 text-blue-700",
    negotiating:
      "bg-amber-50 text-amber-700",
    booked:
      "bg-green-50 text-green-700",
    rejected:
      "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}

interface VendorModalProps {
  title: string;

  form: {
    name: string;
    category: VendorCategory;
    contact_name: string;
    email: string;
    phone: string;
    website: string;
    location: string;
    status: VendorStatus;
    quoted_price: string;
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

function VendorModal({
  title,
  form,
  onChange,
  onSubmit,
  onClose,
  saving,
}: VendorModalProps) {
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
              Vendor management
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
          <InputField
            label="Vendor name"
            name="name"
            value={form.name}
            onChange={onChange}
            required
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField
              label="Category"
              name="category"
              value={form.category}
              onChange={onChange}
              options={[
                ["venue", "Venue"],
                ["catering", "Catering"],
                ["photography", "Photography"],
                ["videography", "Videography"],
                ["decoration", "Decoration"],
                ["music", "Music"],
                ["dj", "DJ"],
                ["transport", "Transport"],
                ["accommodation", "Accommodation"],
                ["beauty", "Beauty"],
                ["clothing", "Clothing"],
                ["cake", "Cake"],
                ["other", "Other"],
              ]}
            />

            <SelectField
              label="Status"
              name="status"
              value={form.status}
              onChange={onChange}
              options={[
                ["prospect", "Prospect"],
                ["contacted", "Contacted"],
                ["negotiating", "Negotiating"],
                ["booked", "Booked"],
                ["rejected", "Rejected"],
              ]}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <InputField
              label="Contact name"
              name="contact_name"
              value={form.contact_name}
              onChange={onChange}
            />

            <InputField
              label="Location"
              name="location"
              value={form.location}
              onChange={onChange}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <InputField
              label="Email"
              name="email"
              value={form.email}
              onChange={onChange}
              type="email"
            />

            <InputField
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={onChange}
            />
          </div>

          <InputField
            label="Website"
            name="website"
            value={form.website}
            onChange={onChange}
            type="url"
          />

          <InputField
            label="Quoted price"
            name="quoted_price"
            value={form.quoted_price}
            onChange={onChange}
            type="number"
          />

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
              disabled={saving}
              className="rounded-full bg-[#1f1d1a] px-6 py-3 font-medium !text-white disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : title.startsWith("Edit")
                  ? "Save changes"
                  : "Add vendor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  type?: string;
  required?: boolean;
}) {
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
        required={required}
        min={
          type === "number"
            ? "0"
            : undefined
        }
        step={
          type === "number"
            ? "0.01"
            : undefined
        }
        className="w-full rounded-2xl border border-[#ddd5ca] bg-white px-4 py-3 outline-none"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  options: [string, string][];
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-2xl border border-[#ddd5ca] bg-white px-4 py-3 outline-none"
      >
        {options.map(
          ([value, label]) => (
            <option
              key={value}
              value={value}
            >
              {label}
            </option>
          )
        )}
      </select>
    </div>
  );
}