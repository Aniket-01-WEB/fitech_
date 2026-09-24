import type { SupabaseClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";

declare global {
  namespace Express {
    interface Request {
      supabase?: SupabaseClient;
      user?: User;
      profile?: { role: string };
    }
  }
}

export {};
