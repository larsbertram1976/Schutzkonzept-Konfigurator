import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MODULES, getModuleBySlug } from "@/lib/modules";
import { getCurrentClubId } from "@/lib/auth/session";
import { loadClubProgress } from "@/lib/progress";
import { CheckList } from "./check-list";
import { ModuleTabs } from "./module-tabs";

export default async function ModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const module = getModuleBySlug(slug);
  if (!module) notFound();

  const clubId = await getCurrentClubId();
  const rows = clubId ? await loadClubProgress(clubId) : [];
  const doneSet = new Set(rows.filter((r) => r.done).map((r) => r.check_id));

  const moduleChecks = module.checks.map((c) => ({
    ...c,
    done: doneSet.has(c.id),
  }));
  const doneCount = moduleChecks.filter((c) => c.done).length;
  const percent = Math.round((doneCount / module.checks.length) * 100);

  const idx = MODULES.findIndex((m) => m.id === module.id);
  const prev = idx > 0 ? MODULES[idx - 1] : null;
  const next = idx < MODULES.length - 1 ? MODULES[idx + 1] : null;

  return (
    <div className="space-y-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
      >
        <LayoutGrid className="h-4 w-4" /> Übersicht
      </Link>

      <ModuleTabs activeSlug={module.slug} doneSet={doneSet} />

      <header
        className="overflow-hidden rounded-2xl p-8 text-white"
        style={{
          background: `linear-gradient(135deg, ${module.color}, ${module.color}cc)`,
        }}
      >
        <div className="text-5xl">{module.emoji}</div>
        <div className="mt-3 text-xs uppercase tracking-[0.3em] text-white/70">
          Modul {module.id} von {MODULES.length}
        </div>
        <h1 className="mt-1 font-serif text-3xl md:text-4xl">{module.title}</h1>
        <p className="mt-1 text-white/80">{module.subtitle}</p>
        <div className="mt-6">
          <Progress
            value={percent}
            className="h-2 bg-white/20"
            indicatorClassName="bg-white"
          />
          <div className="mt-2 text-sm text-white/80">
            {doneCount} / {module.checks.length} Maßnahmen umgesetzt
          </div>
        </div>
      </header>

      <section
        className="rounded-xl border-l-4 bg-white p-6 shadow-sm"
        style={{ borderLeftColor: module.color }}
      >
        <p className="text-slate-700">{module.intro}</p>
      </section>

      <CheckList
        checks={moduleChecks}
        moduleColor={module.color}
        moduleColorLight={module.colorLight}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6">
        {prev ? (
          <Button asChild variant="outline">
            <Link href={`/modul/${prev.slug}`}>
              <ArrowLeft className="mr-2 h-4 w-4" /> {prev.title}
            </Link>
          </Button>
        ) : (
          <span />
        )}
        {next ? (
          <Button asChild>
            <Link href={`/modul/${next.slug}`}>
              {next.title} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Button asChild>
            <Link href="/dashboard">
              Zur Übersicht <LayoutGrid className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
