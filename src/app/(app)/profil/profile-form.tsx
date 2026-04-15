"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function ProfileForm({
  initialName,
  initialRole,
}: {
  initialName: string;
  initialRole: string;
}) {
  const [displayName, setDisplayName] = useState(initialName);
  const [roleLabel, setRoleLabel] = useState(initialRole);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName,
          role_label: roleLabel || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Profil aktualisiert");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Anzeigename</Label>
        <Input
          id="name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Rolle im Verein</Label>
        <Input
          id="role"
          placeholder="z. B. Vorstand, Kinderschutzbeauftragte"
          value={roleLabel}
          onChange={(e) => setRoleLabel(e.target.value)}
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Wird gespeichert…" : "Speichern"}
      </Button>
    </form>
  );
}
