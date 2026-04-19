// Shared finance helpers — all calculations are illustrative only.

export const fmtMoney = (n: number, opts: Intl.NumberFormatOptions = {}) =>
  new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0, ...opts }).format(isFinite(n) ? n : 0);

export const fmtMoneyDecimal = (n: number) =>
  new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 2 }).format(isFinite(n) ? n : 0);

/** Periodic payment for a fixed-rate loan. */
export const periodicPayment = (principal: number, annualRatePct: number, years: number, freq: "monthly" | "fortnightly" | "weekly" = "monthly") => {
  const periodsPerYear = freq === "weekly" ? 52 : freq === "fortnightly" ? 26 : 12;
  const n = years * periodsPerYear;
  const r = (annualRatePct / 100) / periodsPerYear;
  if (n <= 0) return 0;
  if (r === 0) return principal / n;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
};

/** Borrowing power — simple net-surplus serviceability model (illustrative). */
export const estimateBorrowingPower = ({
  grossIncome, partnerIncome = 0, monthlyExpenses, existingDebtRepayments = 0, dependents = 0, ratePct, termYears,
}: { grossIncome: number; partnerIncome?: number; monthlyExpenses: number; existingDebtRepayments?: number; dependents?: number; ratePct: number; termYears: number; }) => {
  const totalGross = grossIncome + partnerIncome;
  // Rough net after tax (blended 25%) and Medicare
  const netAnnual = totalGross * 0.74;
  const netMonthly = netAnnual / 12;
  const dependentBuffer = dependents * 350;
  const stressedRate = ratePct + 3; // APRA-style 3% buffer
  const surplus = Math.max(0, netMonthly - monthlyExpenses - existingDebtRepayments - dependentBuffer);
  // Solve for principal given monthly surplus is the max payment at stressed rate
  const r = (stressedRate / 100) / 12;
  const n = termYears * 12;
  if (r === 0) return surplus * n;
  const principal = (surplus * (1 - Math.pow(1 + r, -n))) / r;
  return Math.max(0, principal);
};

/** Stamp duty — simplified region-agnostic tiered estimate (illustrative). */
export const estimateStampDuty = (purchasePrice: number, firstHomeBuyer: boolean) => {
  if (firstHomeBuyer && purchasePrice <= 650_000) return 0;
  if (firstHomeBuyer && purchasePrice <= 800_000) return purchasePrice * 0.015;
  let duty = 0;
  const p = purchasePrice;
  if (p <= 14_000) duty = p * 0.0125;
  else if (p <= 32_000) duty = 175 + (p - 14_000) * 0.015;
  else if (p <= 85_000) duty = 445 + (p - 32_000) * 0.0175;
  else if (p <= 319_000) duty = 1_372 + (p - 85_000) * 0.035;
  else if (p <= 1_064_000) duty = 9_562 + (p - 319_000) * 0.045;
  else duty = 43_087 + (p - 1_064_000) * 0.055;
  return Math.round(duty);
};

export const otherClosingCosts = () => ({
  transferFee: 175,
  registrationFee: 187,
  conveyancing: 1_650,
  inspections: 600,
  loanFees: 600,
});

/** Loan term remaining given balance, rate, and target payment. */
export const monthsToPayoff = (balance: number, annualRatePct: number, monthlyPayment: number) => {
  const r = (annualRatePct / 100) / 12;
  if (monthlyPayment <= balance * r) return Infinity;
  if (r === 0) return balance / monthlyPayment;
  return -Math.log(1 - (balance * r) / monthlyPayment) / Math.log(1 + r);
};
