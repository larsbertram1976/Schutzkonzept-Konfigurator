# PROJ-2: Modul-Framework & Fortschritts-Tracking

## Status: In Progress (Backend)
**Created:** 2026-04-15
**Last Updated:** 2026-04-15

## Dependencies
- Requires: PROJ-1 (Auth & Vereinsprofil) – Fortschritt ist an einen Verein gebunden

## User Stories
- Als Vereinsverantwortliche*r möchte ich eine Übersicht der 5 Module sehen mit Titel, Kurzbeschreibung und aktuellem Fortschritt, damit ich weiß, wo ich stehe.
- Als Nutzer*in möchte ich in ein Modul eintauchen und dort Maßnahmen einzeln als „erledigt" markieren können, damit unser Fortschritt sichtbar wird.
- Als Team-Mitglied möchte ich sehen, was Kolleg*innen aus meinem Verein bereits abgehakt haben und wer es zuletzt geändert hat, damit wir uns nicht doppeln.
- Als Nutzer*in möchte ich innerhalb eines Moduls zwischen „vor" und „zurück" navigieren können und am Ende auf eine Gesamtübersicht gelangen.
- Als Nutzer*in möchte ich, dass mein Fortschritt automatisch gespeichert wird, ohne dass ich einen „Speichern"-Button klicken muss.

## Acceptance Criteria
- [ ] 5 Module fest definiert: Positionierung & Satzung, Risiko-Potenzial-Analyse, Verhaltenskodex & Personal, Ansprechpersonen & Intervention, Schulung & Prävention
- [ ] Jedes Modul hat: Titel, Emoji, Farbe, Subtitle, Intro-Text, KI-Kontext-Prompt, Liste von Checks (id, label, help, optional Template-Referenz)
- [ ] Modulinhalte versioniert im Code (nicht in DB), damit sie über Deployments konsistent sind
- [ ] Fortschritts-Datenmodell: `progress(club_id, check_id, done, done_at, done_by)`
- [ ] Toggle eines Checks wird in unter 500 ms persistiert und für alle Team-Mitglieder des Vereins sichtbar (Supabase Realtime optional)
- [ ] Modul-Fortschritt (%) = erledigte Checks ÷ Gesamt-Checks des Moduls, gerundet
- [ ] Gesamt-Fortschritt (%) = alle erledigten Checks ÷ alle Checks
- [ ] Modul-Übersichtsseite zeigt alle 5 Module als Karten mit Fortschrittsbalken
- [ ] In jeder Modul-Detailseite: Vor/Zurück-Navigation zwischen Modulen, Link zurück zur Übersicht
- [ ] Checks behalten ein kleines Audit-Log: letzte 10 Änderungen (wer, wann, was)

## Edge Cases
- Was passiert, wenn zwei Nutzer*innen gleichzeitig denselben Check toggeln? → Letzter Schreiber gewinnt, Audit-Log zeigt beide Events
- Was passiert, wenn die Modul-Definition im Code erweitert wird (neue Checks)? → Bestehender Fortschritt bleibt gültig; neue Checks erscheinen als „offen"
- Was passiert bei Offline-Nutzung? → MVP: optimistisches UI, bei Reconnect automatisch persistieren; kein Offline-First-Mode
- Was passiert, wenn ein Check entfernt wird? → Alte `progress`-Einträge verwaisen; werden in Berechnung ignoriert (nur aktive Check-IDs zählen)
- Wie verhält sich der Fortschritt, wenn ein*e Nutzer*in ihren Verein wechselt? → Fortschritt bleibt am Verein, nicht am User

## Technical Requirements
- Persistenz: Supabase Postgres, Tabelle `module_progress` mit RLS (club_id scoping)
- Modul-Daten als TypeScript-Konstante in `src/lib/modules.ts`
- Optimistisches UI (React useState) + Mutation → Supabase
- Realtime über Supabase Channels (optional im MVP, aber Schema muss es erlauben)

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)

### A) Seiten- & Komponentenstruktur

```
/dashboard                         Modul-Übersicht (ersetzt Placeholder)
└── ModuleOverview
    ├── ProgressSummary            Gesamt-% + Mini-Balken pro Modul
    └── ModuleCard × 5             Emoji, Titel, Subtitle, Fortschrittsbalken, „Öffnen"

/modul/[id]                        Detailseite eines Moduls
└── ModuleDetail
    ├── ModuleHeader               Emoji, Titel, Fortschrittsbalken, Modul-Tabs (1–5)
    ├── ModuleIntro                Intro-Text + Platz für AIExplainer (PROJ-3)
    ├── CheckList
    │   └── CheckItem × n          Checkbox, Label, Help-Text, „Wer hat zuletzt geändert"
    ├── ModuleNav                  ← Zurück / Weiter →
    └── BackToOverviewLink

Geteilte Bausteine
├── lib/modules.ts                 5 Module + Checks als TypeScript-Konstante (versioniert)
├── lib/progress-store.ts          Hook + Server-Loader für Fortschritt eines Vereins
└── components/check-toggle.tsx    Optimistisches UI + Persist via Supabase Client
```

### B) Datenmodell (Klartext)

**module_progress** – speichert pro Verein, welche Checks erledigt sind
- Felder: `club_id`, `check_id`, `done`, `done_at`, `done_by` (User)
- Primary Key: Verein + Check (genau ein Eintrag pro Kombination)
- Einträge ohne aktive Check-ID werden in der Berechnung ignoriert

**module_progress_log** – Audit-Log
- Felder: `id`, `club_id`, `check_id`, `done`, `changed_by`, `changed_at`
- Append-only, kein Update
- Pro Check zeigt das UI nur die letzte Änderung; Tabelle ist trotzdem komplett historisch

**Modul-Definition (KEIN DB-Eintrag)**
- TypeScript-Konstante `src/lib/modules.ts`
- Pro Modul: ID, Emoji, Farbe, Titel, Subtitle, Intro, KI-Prompt, Checks
- Pro Check: stabile String-ID (`m1.satzung` etc.), Label, Help, optional Template-Referenz

### C) Sichtbarkeit (RLS)

| Wer | Darf sehen | Darf ändern |
|---|---|---|
| Vereinsmitglied | Fortschritt des eigenen Vereins | Checks des eigenen Vereins toggeln |
| Vereinsadmin | dasselbe wie Mitglied | dasselbe |
| Verbandsadmin | aggregierte Werte (PROJ-9), keine Check-Details | nichts |
| Andere | nichts | nichts |

### D) Kern-Abläufe

**Modul-Übersicht öffnen**
1. Server lädt `club_id` aus Session
2. Holt alle Fortschritts-Einträge in einem Query
3. Pro Modul: erledigte ÷ aktive Checks (aus `lib/modules.ts`)
4. Statisches Rendering, kein Loading-Spinner

**Check toggeln**
1. UI schaltet sofort um (optimistisch)
2. Hintergrund: Upsert `module_progress` + Insert `module_progress_log`
3. Bei Fehler: Rollback + Toast
4. Andere Tabs sehen Änderung beim nächsten Refresh (Realtime = Phase 2)

**Modul-Navigation**
- Vor/Zurück direkt zwischen Modulen
- Tab-Leiste oben (M1–M5) mit Fortschritts-Indikator je Tab

### E) Tech-Entscheidungen

- **Modul-Inhalte im Code, nicht in DB:** Texte ändern sich oft; im Code sind sie versioniert und peer-reviewable. Trade-off: kein Inhalts-CMS – ok im MVP.
- **Stabile String-Check-IDs (`m1.satzung`):** Mensch-lesbar, refactoring-stabil.
- **Optimistisches UI ohne State-Library:** React `useState` reicht im MVP. React Query erst, wenn nötig.
- **Audit-Log als separate Tabelle:** Hauptfortschritt bleibt schlank, Historie für spätere Auswertungen erhalten.
- **Realtime erst Phase 2:** Schema unterstützt es, MVP nutzt es nicht.
- **Server Components für Übersicht:** Schneller First Paint.

### F) Abhängigkeiten

Keine neuen Pakete. Alles vorhanden: `@supabase/ssr`, `zod`, shadcn `Card`, `Progress`, `Checkbox`, `Tabs`, `Button`.

### G) Bewusst NICHT im MVP
- KI-Erklärungen → PROJ-3
- Mustertext-Modals → PROJ-4
- Szenarien & Quiz → PROJ-7 / PROJ-8
- Realtime-Sync zwischen Tabs
- Bulk-Aktionen

## Backend Implementation Notes (2026-04-15)

**Geliefert:**
- SQL-Migration [supabase/migrations/0002_proj2_module_progress.sql](../supabase/migrations/0002_proj2_module_progress.sql) – Tabellen `module_progress` (PK `club_id+check_id`) und `module_progress_log` (append-only) inklusive RLS auf Basis der `current_club_id()`-Helper aus PROJ-1
- RPC `toggle_check(p_check_id, p_done)` (SECURITY DEFINER) – atomarer Upsert + Audit-Log-Eintrag
- Modul-Konstanten [src/lib/modules.ts](../src/lib/modules.ts) – 5 Module mit insgesamt 17 Checks aus dem ursprünglichen Prototyp, stabile String-IDs (`m1.satzung` etc.) und Template-Referenzen für PROJ-4
- Server-Loader [src/lib/progress.ts](../src/lib/progress.ts) – `loadClubProgress` + `summarizeProgress` (filtert verwaiste Check-IDs automatisch)

**Wichtig – manueller Schritt:**
Migration `0002_proj2_module_progress.sql` muss noch im Supabase SQL-Editor ausgeführt werden, bevor das Frontend funktioniert.

**Nicht geliefert (bewusst):**
- Keine API-Routen – Frontend ruft RPC `toggle_check` direkt via Supabase-Client; RLS schützt die Tabellen
- Keine Tests – kein Custom-API-Code zu testen; RPC-Verhalten wird beim Frontend-Smoke-Test verifiziert

## Frontend Implementation Notes (2026-04-15)

**Geliefert (Build grün, Typecheck sauber):**
- [/dashboard](../src/app/(app)/dashboard/page.tsx) – Modul-Übersicht mit dunkler Gesamtfortschritts-Karte (% + „X bis zum Zertifikat") und 5 Modul-Karten (Emoji, Titel, Subtitle, Fortschrittsbalken in Modul-Farbe)
- [/modul/[slug]](../src/app/(app)/modul/[slug]/page.tsx) – Detailseite mit Modul-Header (Gradient in Modul-Farbe), Intro-Text (Platzhalter für AIExplainer aus PROJ-3), Check-Liste, Vor/Zurück-Navigation und Tab-Leiste
- [CheckList](../src/app/(app)/modul/[slug]/check-list.tsx) – Client Component mit optimistischem Toggle, ruft RPC `toggle_check` direkt; Rollback bei Fehler + Toast
- [ModuleTabs](../src/app/(app)/modul/[slug]/module-tabs.tsx) – horizontale Modul-Navigation mit Fortschritts-Indikator je Tab, Check-Icon bei 100 %
- shadcn `Progress` minimal um `indicatorClassName` und `indicatorStyle` erweitert (Standard-Extension-Pattern), damit pro Modul Farben gesetzt werden können

**Entscheidungen:**
- Server Components für `/dashboard` und `/modul/[slug]` – kein Loading-Spinner bei First Paint
- Optimistisches UI über `useState` + `useTransition` + direktes Supabase-RPC ohne extra Lib
- Modul-Slug in URL (`/modul/positionierung`) statt Zahl, damit Links lesbar sind
- Tab-Leiste zeigt Modulnummer plus Emoji – kompakt und mobile-tauglich

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
