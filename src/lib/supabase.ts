import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const supabaseStorageBucket = (import.meta.env.VITE_SUPABASE_STORAGE_BUCKET as string | undefined) ?? 'Registrations';

const configuredRegistrationsTable = ((import.meta.env.VITE_SUPABASE_REGISTRATIONS_TABLE as string | undefined) ?? 'public.registrations')
  .trim();

export const supabaseRegistrationsTable = configuredRegistrationsTable.includes('.')
  ? configuredRegistrationsTable
  : `public.${configuredRegistrationsTable.replace(/^public\./, '')}`;
