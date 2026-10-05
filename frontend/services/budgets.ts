import api from "./api";

export type BudgetCategory =
  | "venue"
  | "catering"
  | "photography"
  | "decoration"
  | "music"
  | "clothing"
  | "transport"
  | "accommodation"
  | "other";

export type PaymentStatus =
  | "unpaid"
  | "partial"
  | "paid";

export interface BudgetItem {
  id: number;
  event: number;
  category: BudgetCategory;
  name: string;
  estimated_amount: string;
  actual_amount: string;
  amount_paid: string;
  payment_status: PaymentStatus;
  due_date: string | null;
  vendor_name: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBudgetItemData {
  event: number;
  category: BudgetCategory;
  name: string;
  estimated_amount: string;
  actual_amount?: string;
  amount_paid?: string;
  payment_status?: PaymentStatus;
  due_date?: string | null;
  vendor_name?: string;
  notes?: string;
}

export interface UpdateBudgetItemData {
  category?: BudgetCategory;
  name?: string;
  estimated_amount?: string;
  actual_amount?: string;
  amount_paid?: string;
  payment_status?: PaymentStatus;
  due_date?: string | null;
  vendor_name?: string;
  notes?: string;
}

export async function getBudgetItems(
  eventId: number
): Promise<BudgetItem[]> {
  const response = await api.get(
    `/budgets/?event=${eventId}`
  );

  return response.data;
}

export async function createBudgetItem(
  data: CreateBudgetItemData
): Promise<BudgetItem> {
  const response = await api.post(
    "/budgets/",
    data
  );

  return response.data;
}

export async function updateBudgetItem(
  budgetItemId: number,
  data: UpdateBudgetItemData
): Promise<BudgetItem> {
  const response = await api.patch(
    `/budgets/${budgetItemId}/`,
    data
  );

  return response.data;
}

export async function deleteBudgetItem(
  budgetItemId: number
): Promise<void> {
  await api.delete(
    `/budgets/${budgetItemId}/`
  );
}