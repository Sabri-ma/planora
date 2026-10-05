import api from "./api";

export type RSVPStatus =
  | "pending"
  | "confirmed"
  | "declined";

export type GuestGroup =
  | "family"
  | "friends"
  | "work"
  | "vip"
  | "other";

export type GuestSide =
  | "partner_one"
  | "partner_two"
  | "both"
  | "none";

export interface Guest {
  id: number;
  event: number;
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
  created_at: string;
  updated_at: string;
}

export interface CreateGuestData {
  event: number;
  first_name: string;
  last_name?: string;
  email?: string;
  phone?: string;
  group?: GuestGroup;
  side?: GuestSide;
  plus_one_allowed?: boolean;
  plus_one_name?: string;
  rsvp_status?: RSVPStatus;
  meal_preference?: string;
  notes?: string;
  table?: string;
}

export interface UpdateGuestData {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  group?: GuestGroup;
  side?: GuestSide;
  plus_one_allowed?: boolean;
  plus_one_name?: string;
  rsvp_status?: RSVPStatus;
  meal_preference?: string;
  notes?: string;
  table?: string;
}

export async function getGuests(
  eventId: number
): Promise<Guest[]> {
  const response = await api.get(
    `/guests/?event=${eventId}`
  );

  return response.data;
}

export async function createGuest(
  data: CreateGuestData
): Promise<Guest> {
  const response = await api.post(
    "/guests/",
    data
  );

  return response.data;
}

export async function updateGuest(
  guestId: number,
  data: UpdateGuestData
): Promise<Guest> {
  const response = await api.patch(
    `/guests/${guestId}/`,
    data
  );

  return response.data;
}

export async function deleteGuest(
  guestId: number
): Promise<void> {
  await api.delete(`/guests/${guestId}/`);
}