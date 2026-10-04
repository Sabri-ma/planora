import api from "./api";

export interface Event {
  id: number;
  owner: string;
  name: string;
  slug: string;
  event_type: string;
  description: string;
  start_date: string;
  location: string;
  currency: string;
  budget_target: string;
  guest_target: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export async function getEvents(): Promise<Event[]> {
  const response = await api.get("/events/");
  return response.data;
}