import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { createInvitationSchema } from "@/lib/auth/schemas";
import { getCurrentClubId } from "@/lib/auth/session";

const INVITATION_TTL_DAYS = 14;

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

  const parsed = createInvitationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validierungsfehler", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const clubId = await getCurrentClubId();
  if (!clubId) {
    return NextResponse.json({ error: "Kein Verein zugeordnet" }, { status: 403 });
  }

  const { data: membership } = await supabase
    .from("club_members")
    .select("role")
    .eq("user_id", user.id)
    .eq("club_id", clubId)
    .maybeSingle();

  if (membership?.role !== "admin") {
    return NextResponse.json(
      { error: "Nur Admins dürfen einladen" },
      { status: 403 },
    );
  }

  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + INVITATION_TTL_DAYS * 86400_000);

  const { data, error } = await supabase
    .from("invitations")
    .insert({
      token,
      club_id: clubId,
      role: parsed.data.role,
      created_by: user.id,
      expires_at: expiresAt.toISOString(),
    })
    .select("id, token, expires_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    id: data.id,
    token: data.token,
    expiresAt: data.expires_at,
  });
}
