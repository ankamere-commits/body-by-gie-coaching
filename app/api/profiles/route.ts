import { NextResponse } from "next/server";

import { upsertSupabaseRow } from "../../../lib/supabase-rest";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      clientId?: string;
      insights?: Record<string, unknown>;
      onboarding?: Record<string, unknown>;
      planSummary?: Record<string, unknown>;
    };

    if (!body.clientId || !body.onboarding) {
      return NextResponse.json({ error: "Missing client profile data", saved: false }, { status: 400 });
    }

    const onboarding = body.onboarding;
    const result = await upsertSupabaseRow(
      "client_profiles",
      {
        client_id: body.clientId,
        first_name: typeof onboarding.name === "string" ? onboarding.name : null,
        insights: body.insights ?? {},
        onboarding,
        plan_summary: body.planSummary ?? {},
        updated_at: new Date().toISOString(),
      },
      "client_id",
    );

    return NextResponse.json(result, { status: result.saved || !result.configured ? 200 : 502 });
  } catch {
    return NextResponse.json({ error: "Profile could not be saved", saved: false }, { status: 500 });
  }
}
