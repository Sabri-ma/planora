"use client";

import { useEffect, useMemo, useState } from "react";

import { useParams } from "next/navigation";

import {
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
      <div className="flex min-h-[70vh] items-center justify-center bg-[#f6f8fc]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#e5eaf3] border-t-[#D4A646]" />
          <p className="mt-4 text-sm font-medium text-[#6f7890]">
            Loading vendors...
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
                Vendor management
              </p>

              <h1 className="mt-2 text-4xl font-bold tracking-[-0.04em] !text-white">
                Vendors
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 !text-white/70 sm:text-base">
                Keep suppliers, quotes, contacts and booking progress organized in one place.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#D4A646] px-5 py-3 text-sm font-bold !text-[#08172F] shadow-[0_10px_28px_rgba(212,166,70,0.24)] transition hover:-translate-y-0.5 hover:bg-[#E7C875] hover:!text-[#08172F]"
            >
              <Plus size={16} />
              Add vendor
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

                className="text-[#1D4ED8]"

              />

            }

          />

          <StatCard

            title="Prospects"

            value={stats.prospect}

            icon={

              <Clock3

                size={19}

                className="text-[#D4A646]"

              />

            }

          />

          <StatCard

            title="Negotiating"

            value={stats.negotiating}

            icon={

              <Clock3

                size={19}

                className="text-[#1D4ED8]"

              />

            }

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

                    | VendorCategory

                )

              }

              className="w-full rounded-xl border border-[#dce3ee] bg-white px-4 py-2.5 text-[#111827] outline-none transition focus:border-[#D4A646] focus:ring-2 focus:ring-[#D4A646]/15"

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

            <label className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-[#8b94a8]">

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

              className="w-full rounded-xl border border-[#dce3ee] bg-white px-4 py-2.5 text-[#111827] outline-none transition focus:border-[#D4A646] focus:ring-2 focus:ring-[#D4A646]/15"

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

        <div className="mt-6 grid gap-5 lg:grid-cols-2">

          {filteredVendors.length === 0 ? (

            <div className="col-span-full rounded-[24px] border border-[#e2e7ef] bg-white p-8 shadow-[0_8px_30px_rgba(15,43,91,0.04)]">

              <Building2 size={28} />

              <h2 className="mt-4 text-xl font-semibold">

                No vendors found

              </h2>

              <p className="mt-2 text-[#667085]">

                Add your first vendor or change

                the active filters.

              </p>

            </div>

          ) : (

            filteredVendors.map((vendor) => (

              <div

                key={vendor.id}

                className="rounded-[24px] border border-[#e2e7ef] bg-white p-6 shadow-[0_8px_30px_rgba(15,43,91,0.04)] transition hover:-translate-y-0.5 hover:border-[#cbd6e6] hover:shadow-[0_16px_42px_rgba(15,43,91,0.08)]"

              >

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <div className="flex flex-wrap items-center gap-2">

                      <h2 className="text-xl font-semibold">

                        {vendor.name}

                      </h2>

                      <span className="rounded-full bg-[#eef3fb] px-3 py-1 text-xs font-semibold capitalize text-[#0F2B5B]">

                        {vendor.category}

                      </span>

                      <VendorStatusBadge

                        status={vendor.status}

                      />

                    </div>

                    {vendor.location && (

                      <div className="mt-3 flex items-center gap-2 text-sm text-[#667085]">

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

                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#dce3ee] text-[#0F2B5B] transition hover:border-[#9fb3d1] hover:bg-[#eef4ff] hover:text-[#1D4ED8]"

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

                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#f1d0d4] text-red-600 transition hover:bg-red-50 disabled:opacity-50"

                    >

                      <Trash2 size={16} />

                    </button>

                  </div>

                </div>

                <div className="mt-5 space-y-2 text-sm text-[#667085]">

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

                <div className="mt-6 border-t border-[#e9edf4] pt-5">

                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b8862f]">

                    Quoted price

                  </p>

                  <p className="mt-1 text-2xl font-bold tracking-[-0.03em] text-[#08172F]">

                    {formatMoney(

                      vendor.quoted_price

                    )}

                  </p>

                </div>

                {vendor.notes && (

                  <p className="mt-4 text-sm text-[#8b94a8]">

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

      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${styles[status]}`}

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

              Vendor management

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

        className="w-full rounded-xl border border-[#dce3ee] bg-white px-4 py-3 text-[#111827] outline-none transition focus:border-[#D4A646] focus:ring-2 focus:ring-[#D4A646]/15"

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

        className="w-full rounded-xl border border-[#dce3ee] bg-white px-4 py-3 text-[#111827] outline-none transition focus:border-[#D4A646] focus:ring-2 focus:ring-[#D4A646]/15"

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