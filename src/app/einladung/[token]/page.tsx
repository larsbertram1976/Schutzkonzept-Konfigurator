import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/session";

export default async function InvitationDeepLinkPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const user = await getSessionUser();

  if (!user) {
    return (
      <AuthShell
        title="Du wurdest eingeladen"
        subtitle="Bitte registriere dich oder melde dich an, um beizutreten"
      >
        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href={`/registrieren?invite=${token}`}>Jetzt registrieren</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href={`/login?invite=${token}`}>Anmelden</Link>
          </Button>
        </div>
      </AuthShell>
    );
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("club_members")
    .select("club_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing?.club_id) {
    return (
      <AuthShell
        title="Bereits Mitglied"
        subtitle="Du bist bereits in einem Verein"
      >
        <p className="text-sm text-slate-700">
          Im MVP kannst du nur in einem Verein aktiv sein. Bitte wende dich an
          den Admin deines aktuellen Vereins, bevor du wechselst.
        </p>
        <Button asChild className="mt-4 w-full">
          <Link href="/dashboard">Zum Dashboard</Link>
        </Button>
      </AuthShell>
    );
  }

  const { error } = await supabase.rpc("redeem_invitation", { p_token: token });

  if (error) {
    return (
      <AuthShell title="Einladung ungültig" subtitle={error.message}>
        <Button asChild className="w-full">
          <Link href="/onboarding">Zurück</Link>
        </Button>
      </AuthShell>
    );
  }

  redirect("/dashboard");
}
