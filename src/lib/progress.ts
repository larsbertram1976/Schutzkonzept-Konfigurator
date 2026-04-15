import { createClient } from "@/lib/supabase/server";
import { ALL_CHECK_IDS, MODULES, type SchutzkonzeptModule } from "@/lib/modules";

export type ProgressRow = {
  check_id: string;
  done: boolean;
  done_at: string | null;
  done_by: string | null;
};

export type ModuleProgressSummary = {
  module: SchutzkonzeptModule;
  doneCount: number;
  totalCount: number;
  percent: number;
};

export type OverallProgress = {
  doneCount: number;
  totalCount: number;
  percent: number;
  perModule: ModuleProgressSummary[];
};

export async function loadClubProgress(clubId: string): Promise<ProgressRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("module_progress")
    .select("check_id, done, done_at, done_by")
    .eq("club_id", clubId);
  if (error) throw error;
  return (data ?? []).filter((r) => ALL_CHECK_IDS.includes(r.check_id));
}

export function summarizeProgress(rows: ProgressRow[]): OverallProgress {
  const doneSet = new Set(rows.filter((r) => r.done).map((r) => r.check_id));

  const perModule = MODULES.map<ModuleProgressSummary>((module) => {
    const total = module.checks.length;
    const done = module.checks.filter((c) => doneSet.has(c.id)).length;
    return {
      module,
      doneCount: done,
      totalCount: total,
      percent: total === 0 ? 0 : Math.round((done / total) * 100),
    };
  });

  const totalCount = ALL_CHECK_IDS.length;
  const doneCount = ALL_CHECK_IDS.filter((id) => doneSet.has(id)).length;

  return {
    doneCount,
    totalCount,
    percent: totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100),
    perModule,
  };
}
