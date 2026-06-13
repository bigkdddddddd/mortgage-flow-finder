# Mortgage Flow Finder

This project is a Vite React/Lovable mortgage lead-flow website with Supabase wiring.

## Supabase setup

The app uses `@supabase/supabase-js` from `src/integrations/supabase/client.ts`.

Create a local `.env` file with:

```bash
VITE_SUPABASE_URL=https://neymtndukowsluwxetgs.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key_here
```

Use a publishable/anon key only in the browser. Never place a service role key in the frontend.

## Lead capture database

A migration has been added under `supabase/migrations` for a secure `public.leads` table. It allows public lead form submissions but does not allow public reading of submitted leads.
