import api from "./api";

export type EventMemberRole =
  | "owner"
  | "admin"
  | "editor"
  | "viewer";

export interface EventMember {
  id: number;
  event: number;
  user: number;
  username: string;
  email: string;
  role: EventMemberRole;
  invited_by: number | null;
  joined_at: string;
}

export interface AddEventMemberData {
  email: string;
  role: Exclude<EventMemberRole, "owner">;
}

export interface UpdateEventMemberData {
  role: Exclude<EventMemberRole, "owner">;
}

export async function getEventMembers(
  eventId: number
): Promise<EventMember[]> {
  const response = await api.get(
    `/events/${eventId}/members/`
  );

  return response.data;
}

export async function addEventMember(
  eventId: number,
  data: AddEventMemberData
): Promise<EventMember> {
  const response = await api.post(
    `/events/${eventId}/members/`,
    data
  );

  return response.data;
}

export async function updateEventMember(
  eventId: number,
  membershipId: number,
  data: UpdateEventMemberData
): Promise<EventMember> {
  const response = await api.patch(
    `/events/${eventId}/members/${membershipId}/`,
    data
  );

  return response.data;
}

export async function removeEventMember(
  eventId: number,
  membershipId: number
): Promise<void> {
  await api.delete(
    `/events/${eventId}/members/${membershipId}/`
  );
}