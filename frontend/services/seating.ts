import api from "./api";

export interface SeatAssignment {
  id: number;
  table: number;
  guest: number;
  guest_name: string;
  seat_number: number | null;
  created_at: string;
  updated_at: string;
}

export interface SeatingTable {
  id: number;
  event: number;
  name: string;
  capacity: number;
  notes: string;
  occupied_seats: number;
  assignments: SeatAssignment[];
  created_at: string;
  updated_at: string;
}

export interface CreateSeatingTableData {
  event: number;
  name: string;
  capacity: number;
  notes?: string;
}

export interface UpdateSeatingTableData {
  name?: string;
  capacity?: number;
  notes?: string;
}

export interface CreateSeatAssignmentData {
  table: number;
  guest: number;
  seat_number?: number | null;
}

export interface UpdateSeatAssignmentData {
  table?: number;
  guest?: number;
  seat_number?: number | null;
}

export async function getSeatingTables(
  eventId: number
): Promise<SeatingTable[]> {
  const response = await api.get(
    `/seating/tables/?event=${eventId}`
  );

  return response.data;
}

export async function createSeatingTable(
  data: CreateSeatingTableData
): Promise<SeatingTable> {
  const response = await api.post(
    "/seating/tables/",
    data
  );

  return response.data;
}

export async function updateSeatingTable(
  tableId: number,
  data: UpdateSeatingTableData
): Promise<SeatingTable> {
  const response = await api.patch(
    `/seating/tables/${tableId}/`,
    data
  );

  return response.data;
}

export async function deleteSeatingTable(
  tableId: number
): Promise<void> {
  await api.delete(
    `/seating/tables/${tableId}/`
  );
}

export async function getSeatAssignments(
  eventId: number
): Promise<SeatAssignment[]> {
  const response = await api.get(
    `/seating/assignments/?event=${eventId}`
  );

  return response.data;
}

export async function createSeatAssignment(
  data: CreateSeatAssignmentData
): Promise<SeatAssignment> {
  const response = await api.post(
    "/seating/assignments/",
    data
  );

  return response.data;
}

export async function updateSeatAssignment(
  assignmentId: number,
  data: UpdateSeatAssignmentData
): Promise<SeatAssignment> {
  const response = await api.patch(
    `/seating/assignments/${assignmentId}/`,
    data
  );

  return response.data;
}

export async function deleteSeatAssignment(
  assignmentId: number
): Promise<void> {
  await api.delete(
    `/seating/assignments/${assignmentId}/`
  );
}