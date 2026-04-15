import Link from "next/link";
import { redirect } from "next/navigation";
import { Building2, Ticket } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";
import { getSessionUser, getCurrentClubId } from "@/lib/auth/session";

export default async function OnboardingPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const clubId = await getCurrentClubId();
  if (clubId) redirect("/dashboard");

  return (
    <AuthShell
      title="Willkommen"
      subtitle="Wie möchtest du starten?"
    >
      <div className="grid gap-4">
        <Link
          href="/onboarding/verein-anlegen"
          className="group flex items-start gap-4 rounded-xl border border-slate-200 p-5 transition hover:border-blue-500 hover:bg-blue-50"
        >
          <Building2 className="mt-1 h-6 w-6 text-blue-600" />
          <div>
            <div className="font-semibold text-slate-900 group-hover:text-blue-700">
              Verein anlegen
            </div>
            <p className="text-sm text-slate-600">
              Starte einen neuen Schutzkonzept-Prozess für deinen Verein.
            </p>
          </div>
        </Link>
        <Link
          href="/onboarding/einladung"
          className="group flex items-start gap-4 rounded-xl border border-slate-200 p-5 transition hover:border-blue-500 hover:bg-blue-50"
        >
          <Ticket className="mt-1 h-6 w-6 text-blue-600" />
          <div>
            <div className="font-semibold text-slate-900 group-hover:text-blue-700">
              Einladungscode einlösen
            </div>
            <p className="text-sm text-slate-600">
              Du wurdest von deinem Verein eingeladen? Füge deinen Code hier ein.
            </p>
          </div>
        </Link>
      </div>
    </AuthShell>
  );
}
