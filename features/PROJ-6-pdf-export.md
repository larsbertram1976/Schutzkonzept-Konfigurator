# PROJ-6: PDF-Export Schutzkonzept-Dokument

## Status: Planned
**Created:** 2026-04-15
**Last Updated:** 2026-04-15

## Dependencies
- Requires: PROJ-2 (Modul-Framework) – braucht Fortschrittsdaten
- Requires: PROJ-4 (Vorlagen-Bibliothek) – bindet Vorlagen in das Dokument ein

## User Stories
- Als Vereinsverantwortliche*r möchte ich ein einziges PDF-Dokument generieren lassen, das alle von uns umgesetzten Maßnahmen und Vorlagen bündelt, damit ich es im Vorstand einreichen kann.
- Als Nutzer*in möchte ich im PDF ein Deckblatt mit Vereinsname, Datum und Fortschritt sehen, damit es offiziell wirkt.
- Als Nutzer*in möchte ich, dass abgehakte Maßnahmen als „umgesetzt" markiert sind und offene Maßnahmen als „noch offen" (mit Vorlagen-Hinweis).
- Als Nutzer*in möchte ich das PDF direkt herunterladen, ohne dass es dauerhaft auf dem Server liegt.
- Als Nutzer*in möchte ich optional die KI-Erklärungen je Modul ins PDF einschließen können, damit ich einen Lese-Leitfaden daraus mache.

## Acceptance Criteria
- [ ] Button „PDF exportieren" auf der Übersichts-/Zertifikatsseite
- [ ] PDF enthält: Deckblatt, Inhaltsverzeichnis, 5 Modul-Abschnitte, je Modul Status aller Checks, eingebundene Vorlagentexte, Anhang mit Disclaimer
- [ ] PDF-Generierung serverseitig via `@react-pdf/renderer` oder Playwright-Print (Entscheidung in /architecture)
- [ ] Deckblatt: Vereinsname, Datum, Gesamtfortschritt %, Name der ausstellenden Person
- [ ] Umgesetzte Checks erscheinen mit ✓, offene mit ○
- [ ] Bei offenen Checks mit Vorlage wird ein Hinweis „Vorlage verfügbar – siehe Anhang" eingefügt
- [ ] Anhang listet alle relevanten Vorlagen in voller Länge
- [ ] Dateiname: `Schutzkonzept_{Vereinsname-slug}_{YYYY-MM-DD}.pdf`
- [ ] Generierung dauert im MVP ≤ 10 s für einen Standard-Verein
- [ ] KI-Erklärungen optional per Checkbox beim Export einschließen

## Edge Cases
- Was passiert, wenn 0 % Fortschritt? → Export zeigt „Noch keine Maßnahmen umgesetzt" und liefert nur Rohstruktur
- Was passiert, wenn das Vereinsprofil unvollständig ist? → Platzhalter im Deckblatt, Warnhinweis auf der UI vor Export
- Was passiert bei sehr großem Dokument (alle KI-Texte inklusive)? → Hinweis, dass es länger dauert; Lade-Spinner + Progress
- Was passiert bei Generierungsfehler? → Freundliche Meldung + Retry-Button, Fehler-Logging
- Wie gehen wir mit Umlauten in Dateinamen um? → Slug-Funktion, die Umlaute transliteriert (ä→ae etc.)

## Technical Requirements
- PDF-Generierung serverseitig in Next.js API-Route (nicht clientseitig, wegen Konsistenz und Ressourcen)
- Entweder `@react-pdf/renderer` (JSX→PDF, einfacher) oder `playwright-core` (HTML→PDF, hübscher)
- Max. Dokumentgröße 10 MB
- Keine Persistenz des PDF: Stream direkt an den Client

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)
_To be added by /architecture_

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
