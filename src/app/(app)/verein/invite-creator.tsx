"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Invitation = { token: string; expiresAt: string };

export function InviteCreator() {
  const [role, setRole] = useState<"admin" | "member">("member");
  const [loading, setLoading] = useState(false);
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [copied, setCopied] = useState(false);

  const createInvite = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/invitations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const body = await res.json();
      if (!res.ok) {
        toast.error(body.error ?? "Fehler beim Erstellen");
        return;
      }
      setInvitation({ token: body.token, expiresAt: body.expiresAt });
    } finally {
      setLoading(false);
    }
  };

  const link =
    invitation &&
    (typeof window !== "undefined"
      ? `${window.location.origin}/einladung/${invitation.token}`
      : "");

  const copy = async () => {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mitglied einladen</CardTitle>
        <CardDescription>
          Erzeuge einen Einladungs-Link mit 14 Tagen Gültigkeit.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <Select value={role} onValueChange={(v) => setRole(v as "admin" | "member")}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="member">Mitglied</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={createInvite} disabled={loading}>
            {loading ? "Erstelle…" : "Einladung erstellen"}
          </Button>
        </div>

        {invitation && link && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">
              Einladungs-Link
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate rounded border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700">
                {link}
              </code>
              <Button size="sm" variant="outline" onClick={copy}>
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Gültig bis{" "}
              {new Date(invitation.expiresAt).toLocaleDateString("de-DE")}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
