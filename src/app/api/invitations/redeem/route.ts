import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { redeemInvitationSchema } from "@/lib/auth/schemas";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültiger Request-Body" }, { status: 400 });
  }

  const parsed = redeemInvitationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validierungsfehler", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { data, error } = await supabase.rpc("redeem_invitation", {
    p_token: parsed.data.token,
  });

  if (error) {
    const msg = error.message ?? "Fehler beim Einlösen";
    const status =
      msg.includes("abgelaufen") ||
      msg.includes("eingelöst") ||
      msg.includes("nicht gefunden") ||
      msg.includes("Bereits Mitglied")
        ? 400
        : 500;
    return NextResponse.json({ error: msg }, { status });
  }

  return NextResponse.json({ clubId: data });
}
