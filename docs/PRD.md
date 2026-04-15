# Product Requirements Document

## Vision
Ein interaktiver Schutzkonzept-Generator, der Sportvereine und -verbände Schritt für Schritt durch die Entwicklung eines rechtssicheren Kinderschutzkonzeptes führt. Das Tool macht ein komplexes, sperriges Thema greifbar, umsetzbar und messbar – mit KI-gestützter Erklärung, fertigen Vorlagen, Lernelementen und einem Zertifikat als Anreiz.

## Target Users

**Primär – Vereinsverantwortliche:**
- Vorstandsmitglieder, Kinderschutzbeauftragte, Jugendwart*innen, Trainer*innen in Sportvereinen
- Pain Points: Thema ist komplex, juristisch aufgeladen, unklarer Startpunkt, fehlende Zeit, kein Fachwissen
- Bedürfnis: Klare Anleitung, Vorlagen statt leerer Seite, Fortschrittsgefühl, Nachweis für den Vorstand

**Sekundär – Verbandsadministrator*innen:**
- Landesverbände, Spitzenverbände (z. B. Sportbund Hamburg, dsj-Mitgliedsverbände)
- Pain Points: Kein Überblick, wie weit ihre Mitgliedsvereine beim Schutzkonzept sind; keine Möglichkeit, gezielt zu unterstützen
- Bedürfnis: Read-only-Übersicht mit Fortschrittsstand je Verein

## Core Features (Roadmap)

| Priority | Feature | Status |
|----------|---------|--------|
| P0 (MVP) | PROJ-1 Auth & Vereinsprofil | Planned |
| P0 (MVP) | PROJ-2 Modul-Framework & Fortschritts-Tracking | Planned |
| P0 (MVP) | PROJ-3 KI-Erklärungen (API-Route) | Planned |
| P0 (MVP) | PROJ-4 Vorlagen-Bibliothek | Planned |
| P0 (MVP) | PROJ-5 Zertifikat | Planned |
| P0 (MVP) | PROJ-6 PDF-Export Schutzkonzept-Dokument | Planned |
| P0 (MVP) | PROJ-7 Szenario-Fallbeispiele | Planned |
| P0 (MVP) | PROJ-8 Quiz pro Modul | Planned |
| P0 (MVP) | PROJ-9 Verbands-Dashboard (Read-only) | Planned |
| P1 | KI-Szenario-Videos (HeyGen/D-ID) | Geplant |
| P1 | Automatische Erinnerung zur Fortschreibung (alle 2 Jahre) | Geplant |
| P2 | White-Label pro Landesverband | Geplant |

## Success Metrics
- **Aktivierung:** ≥ 60 % der registrierten Vereine starten mindestens 1 Modul
- **Durchlauf:** ≥ 30 % der aktiven Vereine erreichen 60 % Gesamtfortschritt (Zertifikats-Schwelle)
- **Zeit bis Zertifikat:** Median < 6 Wochen vom Start bis zum ersten Zertifikat
- **Verbandsnutzung:** ≥ 3 Verbände nutzen das Dashboard mit je ≥ 10 aktiven Vereinen innerhalb von 12 Monaten
- **Qualität:** < 5 % Support-Anfragen zu unklaren Inhalten pro aktivem Verein

## Constraints
- **Rechtlich:** Fachliche Basis muss DOSB-Stufenmodell, dsj-Standards und §72a SGB VIII abbilden; keine Rechtsberatung
- **Datenschutz:** DSGVO-konform; Vereinsdaten und Fortschritt liegen in EU-Region (Supabase EU)
- **Tech-Stack:** Next.js 16 App Router, TypeScript, Tailwind + shadcn/ui, Supabase (Auth/DB/Storage), Vercel
- **KI:** Claude API serverseitig über Next.js API-Route (Key niemals im Client)
- **Team:** Einzelentwickler + KI-Unterstützung, schrittweise Auslieferung

## Non-Goals
- Keine Rechtsberatung oder verbindliche juristische Prüfung von Schutzkonzepten
- Keine vollständige Fall-Dokumentation / Case-Management für Vorfälle
- Keine Anbindung an bestehende Verbands-Mitgliederverwaltungen im MVP
- Keine nativen Mobile-Apps – Web-App (responsiv) reicht
- Keine öffentliche Community/Forum-Funktion
- Keine eigenproduzierten Videos im MVP (Szenarien zunächst als Text + Illustrationen)

---

Use `/requirements` to create detailed feature specifications for each item in the roadmap above.
