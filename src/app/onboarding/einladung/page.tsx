"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RedeemInvitationPage() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/invitations/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token.trim() }),
      });
      const body = await res.json();
      if (!res.ok) {
        toast.error(body.error ?? "Einladung ungültig");
        return;
      }
      toast.success("Willkommen im Team");
      window.location.href = "/dashboard";
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Einladungscode"
      subtitle="Füge den Code aus deiner Einladungs-E-Mail ein"
      footer={
        <Link href="/onboarding" className="text-slate-600 hover:text-slate-900">
          ← Zurück
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="token">Einladungscode</Label>
          <Input
            id="token"
            required
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading || !token}>
          {loading ? "Wird eingelöst…" : "Beitreten"}
        </Button>
      </form>
    </AuthShell>
  );
}
