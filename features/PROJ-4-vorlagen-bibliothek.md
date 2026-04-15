# PROJ-4: Vorlagen-Bibliothek

## Status: Planned
**Created:** 2026-04-15
**Last Updated:** 2026-04-15

## Dependencies
- Requires: PROJ-2 (Modul-Framework) – Vorlagen sind an Checks gebunden

## User Stories
- Als Nutzer*in möchte ich zu jedem Check, der eine Vorlage anbietet, einen Mustertext öffnen können, damit ich nicht bei Null anfangen muss.
- Als Nutzer*in möchte ich die Vorlage mit einem Klick in die Zwischenablage kopieren, damit ich sie in mein Word-Dokument einfügen kann.
- Als Nutzer*in möchte ich Platzhalter wie `[Vereinsname]` automatisch durch meinen Vereinsnamen ersetzt bekommen, damit die Vorlage sofort passt.
- Als Nutzer*in möchte ich alle Vorlagen eines Moduls gebündelt auf einer Seite sehen, um sie offline einsetzen zu können.
- Als Redakteur*in (später) möchte ich Vorlagen zentral im Code pflegen, damit sich Änderungen konsistent ausrollen.

## Acceptance Criteria
- [ ] Jeder Check mit Vorlage zeigt einen Button „📄 Vorlage anzeigen"
- [ ] Klick öffnet ein Modal (shadcn Dialog) mit dem Mustertext in monospacer Ansicht
- [ ] Copy-Button kopiert den vollständigen Text ins Clipboard und zeigt 2 s lang „✓ Kopiert"
- [ ] Platzhalter `[Vereinsname]`, `[Name]`, `[Kontakt]` werden automatisch mit Daten aus dem Vereinsprofil ersetzt, falls vorhanden
- [ ] Vorlagen-Sammlung pro Modul als eigene Seite `/module/[id]/vorlagen` erreichbar
- [ ] Im MVP mindestens 6 Vorlagen: Satzungsparagraph, Vorstandsbeschluss, Verhaltenskodex, Checkliste Risikosituationen, Interventionsplan, Hinweis eFZ
- [ ] Vorlagen sind als TypeScript-Konstanten in `src/lib/templates.ts` gepflegt
- [ ] Markdown-Rendering für Vorlagen mit Überschriften und Listen

## Edge Cases
- Was passiert, wenn der Browser kein Clipboard-API unterstützt? → Textfeld als Fallback mit Auto-Select
- Was passiert, wenn das Vereinsprofil leer ist? → Platzhalter bleiben sichtbar und werden im Modal farblich hervorgehoben
- Was passiert, wenn eine Vorlage sehr lang ist? → Modal scrollbar, Copy kopiert trotzdem alles
- Was passiert auf mobilen Geräten? → Modal nimmt 100 % Breite, Copy-Button gut erreichbar
- Wie verhindern wir falsche Rechtsannahmen? → Jedes Modal enthält einen kurzen Disclaimer „Keine Rechtsberatung"

## Technical Requirements
- shadcn `Dialog` + `Button` + `ScrollArea`
- Clipboard via `navigator.clipboard.writeText` mit Fallback
- Vorlagen-Schema: `{ id, checkId, title, body, placeholders: string[] }`

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)
_To be added by /architecture_

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
