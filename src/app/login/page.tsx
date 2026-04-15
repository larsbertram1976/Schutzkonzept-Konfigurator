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

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  );
}

function LoginPageInner() {
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("invite");
  const nextPath = inviteToken ? `/einladung/${inviteToken}` : "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      if (data.session) {
        window.location.href = nextPath;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Anmelden"
      subtitle="Willkommen zurück"
      footer={
        <>
          Noch kein Konto?{" "}
          <Link
            href={inviteToken ? `/registrieren?invite=${inviteToken}` : "/registrieren"}
            className="text-blue-600 hover:underline"
          >
            Jetzt registrieren
          </Link>
        </>
      }
    >
      {inviteToken && (
        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
          Du wurdest in einen Verein eingeladen. Nach dem Login trittst du
          automatisch bei.
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-Mail</Label>
          <Input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Passwort</Label>
            <Link
              href="/passwort-vergessen"
              className="text-xs text-slate-600 hover:text-slate-900"
            >
              Vergessen?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Wird angemeldet…" : "Anmelden"}
        </Button>
      </form>
    </AuthShell>
  );
}
