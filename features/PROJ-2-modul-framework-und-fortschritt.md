# PROJ-2: Modul-Framework & Fortschritts-Tracking

## Status: Planned
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
_To be added by /architecture_

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
