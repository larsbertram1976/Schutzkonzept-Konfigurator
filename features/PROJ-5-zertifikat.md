# PROJ-5: Zertifikat

## Status: Planned
**Created:** 2026-04-15
**Last Updated:** 2026-04-15

## Dependencies
- Requires: PROJ-2 (Modul-Framework) – Fortschritt wird zur Freischaltung benötigt

## User Stories
- Als Vereinsverantwortliche*r möchte ich ab 60 % Gesamtfortschritt ein druckbares Zertifikat freischalten, damit ich einen sichtbaren Nachweis für unseren Vorstand habe.
- Als Nutzer*in möchte ich auf dem Zertifikat meinen Namen, den Vereinsnamen, das Datum und den erreichten Prozentsatz sehen, damit es eindeutig zuordenbar ist.
- Als Nutzer*in möchte ich das Zertifikat über die Browser-Druckfunktion als PDF sichern können, ohne Zusatz-Tool.
- Als Vereinsadmin möchte ich eine stabile, öffentlich nicht auffindbare URL zum Zertifikat erhalten, damit ich es intern teilen kann.
- Als Nutzer*in möchte ich einen klaren Hinweis sehen, wenn ich noch unter 60 % liege, inkl. „Wieviel fehlt noch".

## Acceptance Criteria
- [ ] Zertifikat-Seite `/zertifikat` ist nur bei ≥ 60 % Gesamtfortschritt aufrufbar; sonst Redirect zur Übersicht mit Hinweis
- [ ] Zertifikat zeigt: Vereinsname, ausstellende Person (Name), Ausstellungsdatum (lokales Datum, DE-Format), erreichten Prozentsatz
- [ ] Design: dunkler Hintergrund, goldener Akzent, „DM Serif Display"-Headline (wie im Prototyp)
- [ ] Print-Stylesheet blendet Navigation/Buttons aus, optimiert für DIN A4 Hochformat
- [ ] „Drucken / PDF"-Button triggert `window.print()`
- [ ] Footer mit Disclaimer: „Diese Bescheinigung dokumentiert die Bearbeitung des Schutzkonzept-Generators und ersetzt keine verbindliche Zertifizierung."
- [ ] URL enthält UUID, keine lesbare Club-ID; Aufruf ist nur mit Club-Membership möglich (RLS)

## Edge Cases
- Was passiert, wenn der Fortschritt nach Zertifikats-Ausstellung wieder unter 60 % fällt (Check wieder deaktiviert)? → Zertifikatsseite weiterhin erreichbar, aber mit Hinweis „Aktuell <X> % – bitte Fortschritt prüfen"
- Was passiert, wenn der Vereinsname sehr lang ist? → Auto-Resize / Wrap, Layout bleibt stabil
- Was passiert bei Umbenennung des Vereins nach Ausstellung? → Zertifikat zeigt den aktuellen Namen (live), kein Snapshot im MVP
- Was passiert in iOS Safari beim Drucken? → Getestet, Layout korrekt
- Wie verhindern wir Missbrauch („teile den Link öffentlich")? → Ausdrücklich nicht als externer Echtheits-Nachweis positioniert; Text im Zertifikat macht das klar

## Technical Requirements
- Server Component mit Daten aus Supabase, Client-Component nur für Print-Button
- Eigene `@media print`-Styles in Tailwind
- Schriften: Google Fonts (DM Serif Display, DM Sans)

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)
_To be added by /architecture_

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
