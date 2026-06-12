import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Database } from "../types/db";
import { fetchWorldCup2026Matches } from "../lib/worldCupSchedule";

const envPath = resolve(process.cwd(), ".env.local");

if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const [key, ...valueParts] = trimmed.split("=");
    process.env[key] ??= valueParts.join("=");
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running the seed script.");
}

const supabase = createClient<Database>(supabaseUrl, serviceRoleKey);

async function main() {
  const matches = await fetchWorldCup2026Matches();
  const { error } = await supabase.from("matches").upsert(matches, {
    onConflict: "match_number"
  });

  if (error) {
    throw error;
  }

  console.log(`Seeded ${matches.length} FIFA World Cup 2026 matches.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
