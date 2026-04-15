# PROJ-7: Szenario-Fallbeispiele

## Status: Planned
**Created:** 2026-04-15
**Last Updated:** 2026-04-15

## Dependencies
- Requires: PROJ-2 (Modul-Framework) – Szenarien sind Modulen zugeordnet

## User Stories
- Als Nutzer*in möchte ich in jedem Modul mindestens ein realistisches Fallbeispiel sehen („Ein Trainer chattet abends mit einer 14-Jährigen privat auf Instagram …"), damit das abstrakte Thema greifbar wird.
- Als Nutzer*in möchte ich bei jedem Szenario mehrere Handlungsoptionen bekommen und eine auswählen, damit ich aktiv mitdenke.
- Als Nutzer*in möchte ich direktes Feedback zu meiner Wahl: Warum ist das richtig / falsch / risikoreich?
- Als Nutzer*in möchte ich nach Abschluss eines Szenarios eine kurze fachliche Einordnung lesen, damit ich den Lerninhalt festige.
- Als Nutzer*in möchte ich sehen können, welche Szenarien ich bereits durchgespielt habe.

## Acceptance Criteria
- [ ] Mindestens 1 Szenario pro Modul (gesamt ≥ 5 im MVP)
- [ ] Szenario-Schema: `{ id, moduleId, title, situation, options: [{ label, verdict: "gut"|"riskant"|"falsch", feedback }], summary }`
- [ ] Anzeige als Karte unterhalb der Checks im Modul
- [ ] Nutzer*in wählt eine Option → Feedback wird eingeblendet mit Farbcodierung (grün/gelb/rot)
- [ ] Nach Feedback-Anzeige erscheint die fachliche Einordnung (summary)
- [ ] Status „bearbeitet" wird pro Verein gespeichert (nicht pro User), damit das Team nicht doppelt durchgeht
- [ ] Szenarien-Daten als TypeScript-Konstanten in `src/lib/scenarios.ts`
- [ ] Keine Punkte-/Score-Mechanik im MVP – nur Lerneffekt
- [ ] Szenarien sind barrierearm: Keyboard-navigierbar, ausreichend Kontrast

## Edge Cases
- Was passiert, wenn ein*e Nutzer*in zuerst die falsche Option wählt? → Feedback, dann Möglichkeit eine andere Option zu versuchen; nur die letzte Wahl wird gespeichert
- Was passiert, wenn ein Szenario nachträglich geändert wird? → Bestehender Status bleibt „bearbeitet", aber mit Hinweis „aktualisiert – erneut ansehen empfohlen"
- Wie verhindern wir, dass Szenarien traumatisierend wirken? → Inhaltliche Prüfung durch Fachperson, Trigger-Warning am Szenario-Start
- Was passiert, wenn in einem Modul kein Szenario existiert? → Bereich wird ausgeblendet, keine leere Karte
- Wie messen wir Lerneffekt? → Nicht im MVP – später A/B mit Pre/Post-Quiz

## Technical Requirements
- shadcn `Card`, `RadioGroup`, `Alert` für Feedback
- Persistenz in Tabelle `scenario_progress(club_id, scenario_id, chosen_option, completed_at)`
- Trigger-Warning als optionales Feld im Szenario-Schema

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)
_To be added by /architecture_

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
