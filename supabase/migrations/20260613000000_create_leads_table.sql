-- Mortgage Flow Finder lead capture table
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text,
  phone text not null,
  loan_type text not null default 'home_loan',
  situation text,
  annual_income numeric(14,2),
  partner_income numeric(14,2),
  monthly_expenses numeric(14,2),
  monthly_debt_repayments numeric(14,2),
  dependents integer,
  estimated_borrowing_power numeric(14,2),
  estimated_monthly_repayment numeric(14,2),
  estimated_rate numeric(5,2),
  estimated_term_years integer,
  source_path text,
  notes text,
  consent_to_contact boolean not null default true,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_loan_type_idx on public.leads (loan_type);

alter table public.leads enable row level security;

grant insert on public.leads to anon, authenticated;

drop policy if exists "Anyone can submit mortgage leads" on public.leads;
create policy "Anyone can submit mortgage leads"
  on public.leads
  for insert
  to anon, authenticated
  with check (true);
