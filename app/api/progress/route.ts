import { NextResponse } from "next/server";

import { insertSupabaseRow } from "../../../lib/supabase-rest";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      clientId?: string;
      eventType?: string;
      payload?: Record<string, unknown>;
    };

    if (!body.clientId || !body.eventType || !body.payload) {
      return NextResponse.json({ error: "Missing progress event data", saved: false }, { status: 400 });
    }

    const result = await insertSupabaseRow("client_events", {
      client_id: body.clientId,
      event_type: body.eventType,
      payload: body.payload,
    });

    return NextResponse.json(result, { status: result.saved || !result.configured ? 200 : 502 });
  } catch {
    return NextResponse.json({ error: "Progress event could not be saved", saved: false }, { status: 500 });
  }
}
