import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InviteCreator } from "./invite-creator";

export default async function VereinPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: membership } = await supabase
    .from("club_members")
    .select("club_id, role, clubs(id, name, postal_code, sports)")
    .eq("user_id", user!.id)
    .maybeSingle();

  type ClubRow = {
    id: string;
    name: string;
    postal_code: string | null;
    sports: string[];
  };
  const clubsRel = membership?.clubs as unknown;
  const club: ClubRow | null = Array.isArray(clubsRel)
    ? (clubsRel[0] as ClubRow | undefined) ?? null
    : ((clubsRel as ClubRow | null) ?? null);
  const isAdmin = membership?.role === "admin";

  const { data: members } = await supabase
    .from("club_members")
    .select("role, user_id, joined_at, profiles(display_name)")
    .eq("club_id", club?.id ?? "");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-slate-900">Dein Verein</h1>
        <p className="mt-1 text-slate-600">
          Vereinsprofil und Team-Mitglieder.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{club?.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-700">
          {club?.postal_code && <p>PLZ: {club.postal_code}</p>}
          {club?.sports && club.sports.length > 0 && (
            <p>Sportarten: {club.sports.join(", ")}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team ({members?.length ?? 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-slate-100">
            {members?.map((m) => {
              const pRel = m.profiles as unknown;
              const p = Array.isArray(pRel)
                ? (pRel[0] as { display_name: string } | undefined) ?? null
                : ((pRel as { display_name: string } | null) ?? null);
              return (
                <li
                  key={m.user_id}
                  className="flex items-center justify-between py-3"
                >
                  <span className="text-slate-900">
                    {p?.display_name || "Unbekannt"}
                  </span>
                  <Badge variant={m.role === "admin" ? "default" : "secondary"}>
                    {m.role === "admin" ? "Admin" : "Mitglied"}
                  </Badge>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>

      {isAdmin && <InviteCreator />}
    </div>
  );
}
