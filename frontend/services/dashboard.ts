import api from "./api";

export interface EventDashboardData {
  event: {
    id: number;
    name: string;
    event_type: string;
    description?: string;
    start_date: string;
    location: string;
    currency: string;
    budget_target: string | number;
    guest_target: number;
    status: string;
  };

  tasks: Array<{
    id: number;
    title: string;
    status: string;
    priority: string;
    due_date?: string | null;
  }>;

  guests: Array<{
    id: number;
    first_name: string;
    last_name: string;
    rsvp_status: string;
  }>;

  budgets: Array<{
    id: number;
    name: string;
    estimated_amount: string | number;
    actual_amount: string | number;
    amount_paid: string | number;
    payment_status: string;
  }>;

  vendors: Array<{
    id: number;
    name: string;
    status: string;
    quoted_price: string | number;
  }>;

  invitations: Array<{
    id: number;
    status: string;
  }>;

  tables: Array<{
    id: number;
    name: string;
    capacity: number;
    assignments?: Array<unknown>;
  }>;
}

export async function getEventDashboard(
  eventId: number
): Promise<EventDashboardData> {
  const [
    eventResponse,
    tasksResponse,
    guestsResponse,
    budgetsResponse,
    vendorsResponse,
    invitationsResponse,
    tablesResponse,
  ] = await Promise.all([
    api.get(`/events/${eventId}/`),
    api.get(`/tasks/?event=${eventId}`),
    api.get(`/guests/?event=${eventId}`),
    api.get(`/budgets/?event=${eventId}`),
    api.get(`/vendors/?event=${eventId}`),
    api.get(`/invitations/?event=${eventId}`),
    api.get(`/seating/tables/?event=${eventId}`),
  ]);

  return {
    event: eventResponse.data,
    tasks: tasksResponse.data,
    guests: guestsResponse.data,
    budgets: budgetsResponse.data,
    vendors: vendorsResponse.data,
    invitations: invitationsResponse.data,
    tables: tablesResponse.data,
  };
}