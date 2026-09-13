import { createClient } from "@supabase/supabase-js";

export type InquiryRow = {
  id: string;
  display_id: string;
  created_at: string;
  type: string;
  company: string | null;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  privacy: boolean;
  status: string;
  notes: string | null;
};

export function createSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase environment variables are not configured.");
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
