import Link from "next/link";
import { Check } from "lucide-react";
import { MODULES } from "@/lib/modules";

export function ModuleTabs({
  activeSlug,
  doneSet,
}: {
  activeSlug: string;
  doneSet: Set<string>;
}) {
  return (
    <nav className="flex gap-2 overflow-x-auto pb-1">
      {MODULES.map((m) => {
        const active = m.slug === activeSlug;
        const done = m.checks.filter((c) => doneSet.has(c.id)).length;
        const total = m.checks.length;
        const complete = done === total;
        return (
          <Link
            key={m.id}
            href={`/modul/${m.slug}`}
            className="flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition"
            style={{
              borderColor: active ? m.color : "#E2E8F0",
              color: active ? m.color : "#475569",
              backgroundColor: active ? m.colorLight : "#fff",
            }}
          >
            <span>{m.emoji}</span>
            <span className="hidden sm:inline">M{m.id}</span>
            <span className="sm:hidden">{m.id}</span>
            {complete ? (
              <Check className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <span className="text-xs text-slate-500">
                {done}/{total}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
