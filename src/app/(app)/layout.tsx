import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: profile }, { data: membership }] = await Promise.all([
    supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("club_members")
      .select("club_id, clubs(name)")
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);

  if (!membership?.club_id) redirect("/onboarding");

  const clubsRel = membership.clubs as unknown;
  const club = Array.isArray(clubsRel)
    ? (clubsRel[0] as { name: string } | undefined) ?? null
    : (clubsRel as { name: string } | null);

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader
        clubName={club?.name ?? null}
        userName={profile?.display_name || user.email || ""}
      />
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
