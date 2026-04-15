"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export default function CreateClubPage() {
  const [name, setName] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [sports, setSports] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      toast.error("Bitte Vereinsnamen eingeben");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const sportList = sports
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const { error } = await supabase.rpc("create_club_with_admin", {
        p_name: name,
        p_postal_code: postalCode || null,
        p_sports: sportList,
        p_federation_id: null,
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Verein angelegt");
      window.location.href = "/dashboard";
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Verein anlegen"
      subtitle="Nur ein paar Angaben, dann kann's losgehen"
      footer={
        <Link href="/onboarding" className="text-slate-600 hover:text-slate-900">
          ← Zurück
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Vereinsname *</Label>
          <Input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="plz">Postleitzahl</Label>
          <Input
            id="plz"
            inputMode="numeric"
            pattern="\d{5}"
            maxLength={5}
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sports">Sportarten</Label>
          <Input
            id="sports"
            placeholder="z. B. Fußball, Turnen, Schwimmen"
            value={sports}
            onChange={(e) => setSports(e.target.value)}
          />
          <p className="text-xs text-slate-500">Mit Kommas trennen.</p>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Wird erstellt…" : "Verein anlegen"}
        </Button>
      </form>
    </AuthShell>
  );
}
