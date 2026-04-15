"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/passwort-neu`,
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthShell title="E-Mail versendet" subtitle="Bitte Posteingang prüfen">
        <p className="text-sm text-slate-700">
          Wir haben dir einen Link zum Zurücksetzen an <strong>{email}</strong>{" "}
          geschickt.
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Passwort vergessen"
      subtitle="Wir senden dir einen Link per E-Mail"
      footer={
        <Link href="/login" className="text-blue-600 hover:underline">
          Zurück zur Anmeldung
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-Mail</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Wird gesendet…" : "Link anfordern"}
        </Button>
      </form>
    </AuthShell>
  );
}
