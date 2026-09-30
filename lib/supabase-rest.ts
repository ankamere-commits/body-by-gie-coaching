type SupabaseResult = {
  configured: boolean;
  saved: boolean;
  status?: number;
};

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function isDatabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}

export async function upsertSupabaseRow(
  table: string,
  body: Record<string, unknown>,
  onConflict: string,
): Promise<SupabaseResult> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return { configured: false, saved: false };
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?on_conflict=${onConflict}`, {
    body: JSON.stringify(body),
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    method: "POST",
  });

  return {
    configured: true,
    saved: response.ok,
    status: response.status,
  };
}

export async function insertSupabaseRow(table: string, body: Record<string, unknown>): Promise<SupabaseResult> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return { configured: false, saved: false };
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    body: JSON.stringify(body),
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    method: "POST",
  });

  return {
    configured: true,
    saved: response.ok,
    status: response.status,
  };
}
