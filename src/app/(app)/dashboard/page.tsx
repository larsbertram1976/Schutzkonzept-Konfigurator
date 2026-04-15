import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentClubId } from "@/lib/auth/session";
import { loadClubProgress, summarizeProgress } from "@/lib/progress";

export default async function DashboardPage() {
  const clubId = await getCurrentClubId();
  const rows = clubId ? await loadClubProgress(clubId) : [];
  const summary = summarizeProgress(rows);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-slate-900">Dein Schutzkonzept</h1>
        <p className="mt-1 text-slate-600">
          Arbeite dich Schritt für Schritt durch alle 5 Bausteine.
        </p>
      </div>

      <Card className="overflow-hidden border-slate-200">
        <CardContent className="bg-slate-900 p-8 text-white">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-blue-300">
                Gesamtfortschritt
              </div>
              <div className="mt-2 font-serif text-5xl">{summary.percent}%</div>
              <div className="mt-1 text-sm text-slate-400">
                {summary.doneCount} von {summary.totalCount} Maßnahmen umgesetzt
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              {summary.percent >= 60 ? (
                <span className="rounded-full bg-amber-500/20 px-3 py-1 text-amber-300">
                  🏆 Zertifikat verfügbar
                </span>
              ) : (
                <span>
                  {60 - summary.percent}% bis zum Zertifikat
                </span>
              )}
            </div>
          </div>
          <div className="mt-6">
            <Progress
              value={summary.percent}
              className="h-2 bg-slate-800 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-blue-300"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {summary.perModule.map(({ module, doneCount, totalCount, percent }) => (
          <Link
            key={module.id}
            href={`/modul/${module.slug}`}
            className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-blue-300 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl"
                  style={{ backgroundColor: module.colorLight }}
                >
                  {module.emoji}
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-500">
                    Modul {module.id}
                  </div>
                  <div className="font-semibold text-slate-900 group-hover:text-blue-700">
                    {module.title}
                  </div>
                  <div className="mt-1 text-sm text-slate-500">
                    {module.subtitle}
                  </div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600" />
            </div>
            <div className="mt-5 space-y-2">
              <Progress
                value={percent}
                className="h-1.5 bg-slate-100"
                indicatorStyle={{ backgroundColor: module.color }}
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>
                  {doneCount} / {totalCount} Maßnahmen
                </span>
                <span
                  className="font-semibold"
                  style={{ color: percent === 100 ? "#10B981" : module.color }}
                >
                  {percent}%
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
