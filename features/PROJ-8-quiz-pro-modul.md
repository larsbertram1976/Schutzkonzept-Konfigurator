# PROJ-8: Quiz pro Modul

## Status: Planned
**Created:** 2026-04-15
**Last Updated:** 2026-04-15

## Dependencies
- Requires: PROJ-2 (Modul-Framework) – Quiz ist Teil eines Moduls

## User Stories
- Als Nutzer*in möchte ich am Ende jedes Moduls ein kurzes Quiz (3–5 Fragen) absolvieren, damit ich überprüfen kann, ob ich die Kerninhalte verstanden habe.
- Als Nutzer*in möchte ich sofort nach jeder Frage sehen, ob meine Antwort richtig oder falsch war, inkl. kurzer Erklärung.
- Als Nutzer*in möchte ich am Ende des Quiz meine Punktzahl und eine Empfehlung sehen (z. B. „≥ 80 % = gut, darunter = nochmal lesen").
- Als Team möchten wir den Quiz-Status pro Verein sehen, aber der Quiz selbst kann von einzelnen Personen wiederholt werden.
- Als Nutzer*in möchte ich ein abgeschlossenes Quiz jederzeit wiederholen können, um mein Wissen aufzufrischen.

## Acceptance Criteria
- [ ] Jedes Modul hat 3–5 Fragen, gesamt ≥ 15 Fragen im MVP
- [ ] Fragen-Schema: `{ id, moduleId, question, options: string[], correctIndex, explanation }`
- [ ] Single-Choice im MVP (keine Multi-Choice)
- [ ] Nach Antwort: sofortiges Feedback (richtig/falsch + Erklärung)
- [ ] Abschluss-Screen: Punktzahl in %, Farbe je nach Ergebnis (grün ≥ 80, gelb 50–79, rot < 50)
- [ ] „Quiz wiederholen"-Button auf Abschluss-Screen
- [ ] Quiz-Fortschritt pro Verein gespeichert: bestes Ergebnis, letztes Ergebnis, Anzahl Versuche
- [ ] Quiz zählt NICHT in den Gesamt-Fortschritt aus PROJ-2 hinein
- [ ] Quiz-Daten als TypeScript-Konstanten in `src/lib/quizzes.ts`

## Edge Cases
- Was passiert, wenn ein*e Nutzer*in das Quiz verlässt, bevor es fertig ist? → Bisheriger Stand wird verworfen, beim nächsten Öffnen neu gestartet
- Was passiert, wenn Fragen nachträglich geändert werden? → Alte Ergebnisse bleiben erhalten, neuer Versuch mit neuen Fragen
- Was passiert, wenn alle Antwortoptionen gleich lang/unplausibel formuliert sind? → Content-Review durch Fachperson vor Release
- Was passiert auf mobilen Geräten mit langen Erklärungen? → Scrollbar innerhalb der Card
- Wie vermeiden wir „Auswendiglernen der richtigen Position"? → Antwortoptionen werden beim Laden randomisiert

## Technical Requirements
- shadcn `Card`, `RadioGroup`, `Button`, `Progress`
- Tabelle `quiz_results(club_id, module_id, user_id, score, attempts, last_taken_at)`
- Keyboard-navigierbar (Tab, Enter, Pfeiltasten)

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)
_To be added by /architecture_

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
