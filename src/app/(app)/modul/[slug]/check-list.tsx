"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { createClient } from "@/lib/supabase/client";
import type { ModuleCheck } from "@/lib/modules";

type CheckWithState = ModuleCheck & { done: boolean };

export function CheckList({
  checks,
  moduleColor,
  moduleColorLight,
}: {
  checks: CheckWithState[];
  moduleColor: string;
  moduleColorLight: string;
}) {
  const [items, setItems] = useState(checks);
  const [, startTransition] = useTransition();

  const toggle = (id: string, next: boolean) => {
    const previous = items;
    setItems((cur) => cur.map((c) => (c.id === id ? { ...c, done: next } : c)));

    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.rpc("toggle_check", {
        p_check_id: id,
        p_done: next,
      });
      if (error) {
        setItems(previous);
        toast.error("Speichern fehlgeschlagen: " + error.message);
      }
    });
  };

  return (
    <div className="space-y-3">
      {items.map((c) => (
        <label
          key={c.id}
          className="flex cursor-pointer items-start gap-4 rounded-xl border bg-white p-5 transition"
          style={{
            borderColor: c.done ? moduleColor : "#E2E8F0",
            backgroundColor: c.done ? moduleColorLight : "#fff",
          }}
        >
          <Checkbox
            checked={c.done}
            onCheckedChange={(v) => toggle(c.id, !!v)}
            className="mt-1"
            style={
              {
                ["--check-color" as string]: moduleColor,
                borderColor: moduleColor,
              } as React.CSSProperties
            }
          />
          <div className="flex-1">
            <div className="font-semibold text-slate-900">{c.label}</div>
            <div className="mt-1 text-sm text-slate-600">{c.help}</div>
          </div>
        </label>
      ))}
    </div>
  );
}
