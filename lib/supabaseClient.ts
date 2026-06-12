import { cookies } from "next/headers";
import { createBrowserClient, createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/db";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

type CookieToSet = {
  name: string;
  value: string;
  options?: Parameters<ReturnType<typeof cookies>["set"]>[2];
};

function assertEnv() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }
}

export function isSupabaseConfigured() {
  return Boolean(
    supabaseUrl &&
      supabaseAnonKey &&
      !supabaseUrl.includes("your-project-ref") &&
      !supabaseAnonKey.includes("your-supabase-anon-key")
  );
}

export function createClient() {
  assertEnv();

  return createBrowserClient<Database, "public", Database["public"]>(supabaseUrl!, supabaseAnonKey!) as any;
}

export function createServerSupabaseClient() {
  assertEnv();
  const cookieStore = cookies();

  return createServerClient<Database, "public", Database["public"]>(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server components cannot set cookies; middleware and server actions can.
        }
      }
    }
  }) as any;
}

export function createServiceSupabaseClient() {
  assertEnv();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY.");
  }

  return createServerClient<Database, "public", Database["public"]>(supabaseUrl!, serviceRoleKey, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {
        return;
      }
    }
  }) as any;
}
