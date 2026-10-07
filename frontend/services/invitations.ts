import api from "./api";

export type InvitationStatus =
  | "draft"
  | "sent"
  | "opened"
  | "responded";

export interface Invitation {
  id: number;
  event: number;
  guest: number;
  guest_name: string;
  token: string;
  status: InvitationStatus;
  message: string;
  sent_at: string | null;
  responded_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateInvitationData {
  event: number;
  guest: number;
  message?: string;
  status?: InvitationStatus;
}

export interface UpdateInvitationData {
  guest?: number;
  message?: string;
  status?: InvitationStatus;
}

export interface PublicInvitation {
  event_name: string;
  event_date: string;
  event_location: string;
  guest_name: string;
  message: string;
  status: InvitationStatus;
}

export interface RSVPData {
  rsvp_status: "confirmed" | "declined";
  plus_one_name?: string;
  meal_preference?: string;
}

export async function getInvitations(
  eventId: number
): Promise<Invitation[]> {
  const response = await api.get(
    `/invitations/?event=${eventId}`
  );

  return response.data;
}

export async function createInvitation(
  data: CreateInvitationData
): Promise<Invitation> {
  const response = await api.post(
    "/invitations/",
    data
  );

  return response.data;
}

export async function updateInvitation(
  invitationId: number,
  data: UpdateInvitationData
): Promise<Invitation> {
  const response = await api.patch(
    `/invitations/${invitationId}/`,
    data
  );

  return response.data;
}

export async function deleteInvitation(
  invitationId: number
): Promise<void> {
  await api.delete(
    `/invitations/${invitationId}/`
  );
}

export async function getPublicInvitation(
  token: string
): Promise<PublicInvitation> {
  const response = await api.get(
    `/invitations/public/${token}/`
  );

  return response.data;
}

export async function submitRSVP(
  token: string,
  data: RSVPData
): Promise<{
  detail: string;
  rsvp_status: string;
}> {
  const response = await api.post(
    `/invitations/public/${token}/rsvp/`,
    data
  );

  return response.data;
}