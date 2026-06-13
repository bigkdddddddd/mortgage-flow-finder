import { supabase } from "@/integrations/supabase/client";

export type LoanType =
  | "home_loan"
  | "car_loan"
  | "refinance"
  | "investment"
  | "asset_finance"
  | "personal_loan"
  | "business_finance"
  | "other";

export interface LeadSubmission {
  fullName: string;
  email?: string;
  phone: string;
  loanType?: LoanType;
  situation?: string;
  annualIncome?: number;
  partnerIncome?: number;
  monthlyExpenses?: number;
  monthlyDebtRepayments?: number;
  dependents?: number;
  estimatedBorrowingPower?: number;
  estimatedMonthlyRepayment?: number;
  estimatedRate?: number;
  estimatedTermYears?: number;
  sourcePath?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
}

export async function submitLead(input: LeadSubmission) {
  const { error } = await supabase.from("leads").insert({
    full_name: input.fullName,
    email: input.email || null,
    phone: input.phone,
    loan_type: input.loanType ?? "home_loan",
    situation: input.situation || null,
    annual_income: input.annualIncome ?? null,
    partner_income: input.partnerIncome ?? null,
    monthly_expenses: input.monthlyExpenses ?? null,
    monthly_debt_repayments: input.monthlyDebtRepayments ?? null,
    dependents: input.dependents ?? null,
    estimated_borrowing_power: input.estimatedBorrowingPower ?? null,
    estimated_monthly_repayment: input.estimatedMonthlyRepayment ?? null,
    estimated_rate: input.estimatedRate ?? null,
    estimated_term_years: input.estimatedTermYears ?? null,
    source_path: input.sourcePath ?? window.location.pathname,
    notes: input.notes ?? null,
    consent_to_contact: true,
    metadata: input.metadata ?? {},
  });

  if (error) throw error;
}
