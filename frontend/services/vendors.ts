import api from "./api";

export type VendorCategory =
  | "venue"
  | "catering"
  | "photography"
  | "videography"
  | "decoration"
  | "music"
  | "dj"
  | "transport"
  | "accommodation"
  | "beauty"
  | "clothing"
  | "cake"
  | "other";

export type VendorStatus =
  | "prospect"
  | "contacted"
  | "negotiating"
  | "booked"
  | "rejected";

export interface Vendor {
  id: number;
  event: number;
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
  created_at: string;
  updated_at: string;
}

export interface CreateVendorData {
  event: number;
  name: string;
  category: VendorCategory;
  contact_name?: string;
  email?: string;
  phone?: string;
  website?: string;
  location?: string;
  status?: VendorStatus;
  quoted_price?: string;
  notes?: string;
}

export interface UpdateVendorData {
  name?: string;
  category?: VendorCategory;
  contact_name?: string;
  email?: string;
  phone?: string;
  website?: string;
  location?: string;
  status?: VendorStatus;
  quoted_price?: string;
  notes?: string;
}

export async function getVendors(
  eventId: number
): Promise<Vendor[]> {
  const response = await api.get(
    `/vendors/?event=${eventId}`
  );

  return response.data;
}

export async function createVendor(
  data: CreateVendorData
): Promise<Vendor> {
  const response = await api.post(
    "/vendors/",
    data
  );

  return response.data;
}

export async function updateVendor(
  vendorId: number,
  data: UpdateVendorData
): Promise<Vendor> {
  const response = await api.patch(
    `/vendors/${vendorId}/`,
    data
  );

  return response.data;
}

export async function deleteVendor(
  vendorId: number
): Promise<void> {
  await api.delete(
    `/vendors/${vendorId}/`
  );
}