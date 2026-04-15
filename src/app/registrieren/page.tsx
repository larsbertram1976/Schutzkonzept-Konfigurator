"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { registerSchema } from "@/lib/auth/schemas";

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterPageInner />
    </Suspense>
  );
}

function RegisterPageInner() {
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("invite");
  const nextPath = inviteToken ? `/einladung/${inviteToken}` : "/dashboard";
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = registerSchema.safeParse({ email, password, displayName });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Ungültige Eingabe");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
        },
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      setDone(true);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <AuthShell
        title="Fast geschafft"
        subtitle="Wir haben dir eine Bestätigungs-E-Mail geschickt"
      >
        <div className="space-y-3 text-sm text-slate-700">
          <p>
            Bitte öffne den Link in der E-Mail an <strong>{email}</strong>, um
            dein Konto zu aktivieren.
          </p>
          <p className="text-slate-500">
            Keine Mail erhalten? Schau im Spam-Ordner nach oder starte die
            Registrierung erneut.
          </p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Registrieren"
      subtitle="Leg los mit dem Schutzkonzept-Generator"
      footer={
        <>
          Schon registriert?{" "}
          <Link
            href={inviteToken ? `/login?invite=${inviteToken}` : "/login"}
            className="text-blue-600 hover:underline"
          >
            Anmelden
          </Link>
        </>
      }
    >
      {inviteToken && (
        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
          Du wurdest in einen Verein eingeladen. Nach der Registrierung wirst du
          automatisch beigetreten.
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Dein Name</Label>
          <Input
            id="name"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            autoComplete="name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-Mail</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Passwort</Label>
          <Input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <p className="text-xs text-slate-500">Mindestens 8 Zeichen.</p>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Wird erstellt…" : "Konto erstellen"}
        </Button>
      </form>
    </AuthShell>
  );
}
