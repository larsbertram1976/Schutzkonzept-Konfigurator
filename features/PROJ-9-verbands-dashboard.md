# PROJ-9: Verbands-Dashboard (Read-only)

## Status: Planned
**Created:** 2026-04-15
**Last Updated:** 2026-04-15

## Dependencies
- Requires: PROJ-1 (Auth & Vereinsprofil) – Verbandsrolle + Club→Federation-Zuordnung
- Requires: PROJ-2 (Modul-Framework) – Fortschrittsdaten zum Anzeigen

## User Stories
- Als Verbandsadministrator*in möchte ich mich einloggen und eine Liste aller Vereine meines Verbands mit deren Gesamtfortschritt sehen, damit ich weiß, wo ich unterstützen muss.
- Als Verbandsadministrator*in möchte ich pro Verein die Fortschritte der 5 Module einzeln sehen, um Stärken und Schwächen zu erkennen.
- Als Verbandsadministrator*in möchte ich die Liste nach Fortschritt sortieren und nach Vereinsname suchen können.
- Als Verbandsadministrator*in möchte ich zusammenfassende Kennzahlen sehen: Anzahl Vereine, Durchschnittsfortschritt, Anzahl mit ≥ 60 %.
- Als Verbandsadministrator*in darf ich KEINE Vereinsdaten verändern, um die Datenhoheit der Vereine zu wahren.

## Acceptance Criteria
- [ ] Route `/verband` nur für Nutzer*innen mit Rolle `federation_admin` zugänglich (sonst 403)
- [ ] Dashboard zeigt KPI-Zeile: Anzahl Vereine, Durchschnitt %, Anzahl ≥ 60 %, Anzahl aktiv (mit mind. 1 Check)
- [ ] Tabelle: Vereinsname, Postleitzahl, Gesamt %, je 5 Modul % als kleine Balken, letzte Aktivität (Datum)
- [ ] Sortierung nach Name, Fortschritt, letzter Aktivität
- [ ] Volltextsuche nach Vereinsname
- [ ] Kein Zugriff auf einzelne Check-Details, keine Nutzernamen, keine personenbezogenen Daten der Vereine
- [ ] Row-Level-Security: Verbandsadmin sieht NUR Vereine mit passender `federation_id`
- [ ] Alle Daten-Abfragen nur lesend (keine Mutations-Endpunkte für diese Rolle)
- [ ] Leerer Zustand: „Noch keine Vereine in Ihrem Verband registriert" + Einladungshinweis

## Edge Cases
- Was passiert, wenn ein Verein aus dem Verband austritt? → Verein verschwindet aus der Liste, historische Daten bleiben im Verein selbst
- Was passiert bei sehr vielen Vereinen (> 500)? → Paginierung (50/Seite) + Suche; Server-seitige Aggregation
- Was passiert, wenn ein Vereinsname Umlaute/Sonderzeichen hat? → Suche ist case-insensitive und umlautnormiert
- Was sieht ein Verbandsadmin, wenn ein Verein auf 0 % steht und noch nie gestartet hat? → Zeile mit „Noch nicht gestartet"
- Wie verhindern wir Datenschutzprobleme? → Aggregierte Sicht, keine personenbezogenen Daten; im Impressum dokumentiert

## Technical Requirements
- Server Components mit Supabase Service Role NUR für aggregierte Views (oder DB-View mit eigener RLS)
- DB-View `federation_club_progress` liefert bereits aggregierte Daten
- shadcn `Table`, `Input` (Suche), `Select` (Sortierung), `Card` (KPIs)
- Keine Client-seitigen Mutationen, alle Fetches Server Components

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)
_To be added by /architecture_

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
