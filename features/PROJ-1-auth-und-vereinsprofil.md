# PROJ-1: Auth & Vereinsprofil

## Status: In Progress (Backend)
**Created:** 2026-04-15
**Last Updated:** 2026-04-15

## Dependencies
- None (Grundlage für alle weiteren Features)

## User Stories
- Als Vereinsvorstand möchte ich mich per E-Mail/Passwort registrieren und einen Verein anlegen, damit ich den Schutzkonzept-Prozess für meinen Verein starten kann.
- Als Vereinsvorstand möchte ich weitere Personen (z. B. Kinderschutzbeauftragte, Trainer*innen) per Einladungs-Link zu meinem Verein hinzufügen, damit wir gemeinsam am Schutzkonzept arbeiten.
- Als eingeladene Person möchte ich mich über den Link registrieren und automatisch dem richtigen Verein zugeordnet werden, ohne dass der Admin etwas manuell freischalten muss.
- Als Verbandsadministrator*in möchte ich eine separate Rolle haben, die mir Zugriff auf das Verbands-Dashboard (PROJ-9) gibt, ohne dass ich Vereinsdaten ändern kann.
- Als Nutzer*in möchte ich mein Profil (Name, Rolle) nachträglich bearbeiten und mich sicher abmelden können.

## Acceptance Criteria
- [ ] Registrierung mit E-Mail + Passwort über Supabase Auth; E-Mail-Bestätigung aktiviert
- [ ] Beim ersten Login ohne Verein erscheint ein Onboarding-Flow: „Verein anlegen" oder „Einladungscode einlösen"
- [ ] Verein anlegen erfasst: Vereinsname (Pflicht), Sportart(en), Postleitzahl, optional Verband-Zuordnung
- [ ] Rollen pro Verein: `admin` (volle Rechte, kann einladen) und `member` (bearbeitet Module)
- [ ] Einladungs-Link enthält signiertes Token, läuft nach 14 Tagen ab, ist einmalig nutzbar
- [ ] Rolle `federation_admin` existiert global und ist nicht selbst-registrierbar (nur per manuelle Zuweisung durch System-Admin)
- [ ] Row-Level-Security: Nutzer*innen sehen nur Daten ihres eigenen Vereins; Verbandsadmins sehen nur Vereine ihres Verbands (read-only)
- [ ] Profil-Seite zum Bearbeiten von Name/Rolle + Logout
- [ ] Passwort-Reset per E-Mail funktioniert

## Edge Cases
- Was passiert, wenn ein*e Nutzer*in bereits in Verein A ist und eine Einladung für Verein B einlöst? → Wechsel oder Fehler? (Entscheidung: MVP = ein*e Nutzer*in ist einem Verein zugeordnet; zweiter Beitritt zeigt Warnung und lehnt ab.)
- Was passiert bei abgelaufenem Einladungs-Link? → Klare Fehlermeldung „Link abgelaufen, bitte Admin um neuen Link bitten"
- Was passiert, wenn der letzte Admin eines Vereins austritt? → Verhindern, solange kein zweiter Admin existiert
- Was passiert, wenn die E-Mail-Bestätigung nicht ankommt? → „Erneut senden"-Button auf Login-Seite
- Wie gehen wir mit gelöschten Vereinen um? → Soft-Delete; Daten bleiben 30 Tage erhalten, dann harter Delete

## Technical Requirements
- Authentifizierung: Supabase Auth (EU-Region)
- Tabellen (mind.): `profiles`, `clubs`, `club_members (user_id, club_id, role)`, `invitations`, `federations`
- Alle sensiblen Endpunkte über Supabase RLS abgesichert
- Session-Handling über Next.js Server Components / Middleware

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)

### A) Seiten- & Komponentenstruktur

```
Öffentlich (nicht eingeloggt)
├── /                       Landing (Hero + „Jetzt starten")
├── /login                  E-Mail + Passwort
├── /registrieren           E-Mail + Passwort + Name
├── /passwort-vergessen     Reset-Mail anfordern
├── /passwort-neu           Neues Passwort (Token aus Mail)
└── /einladung/[token]      Einladungs-Einlösung

Eingeloggt, noch kein Verein
└── /onboarding
    ├── Entscheidungs-Karte „Verein anlegen" | „Einladungscode einlösen"
    ├── /onboarding/verein-anlegen   (Name, Sportart, PLZ, Verband)
    └── /onboarding/einladung         (Code eingeben, falls nicht über Link)

Eingeloggt, mit Verein
├── /dashboard              Modul-Übersicht (kommt in PROJ-2)
├── /profil                 Name/Rolle bearbeiten, Logout
└── /verein
    ├── Vereinsdaten ansehen/bearbeiten (nur admin)
    ├── Team-Mitgliederliste
    └── Einladung erstellen (nur admin)

Eingeloggt als Verbandsadmin
└── /verband                Read-only Dashboard (kommt in PROJ-9)

Geteilte Bausteine
├── AppHeader               Logo, Vereinsname, Avatar-Menü
├── AuthForm                wiederverwendbar für Login/Register
├── OnboardingGuard         leitet je nach Zustand weiter
└── RoleGuard               blockt Seiten je nach Rolle
```

### B) Datenmodell (Klartext)

**profiles** – Personendaten pro registriertem User
- verknüpft mit Supabase-Auth-User
- Felder: Anzeigename, Rolle-im-Verein-als-Text (z. B. „Vorstand"), Avatar-URL (optional), Zeitstempel
- Jede*r User hat genau einen Profile-Eintrag

**federations** – Verbände
- Felder: Name, Kürzel, Slug, Kontakt-E-Mail
- Initial manuell gepflegt (kein Self-Service im MVP)

**clubs** – Vereine
- Felder: Name, PLZ, Sportarten (Liste), optional `federation_id`, `created_by`, `deleted_at` (Soft-Delete), Zeitstempel
- Ein Verein gehört zu höchstens einem Verband

**club_members** – Zuordnung User ↔ Verein
- Felder: `user_id`, `club_id`, `role` (admin/member), `joined_at`
- Regel (MVP): Ein*e User*in ist in genau einem Verein
- Regel: Pro Verein mindestens ein Admin

**federation_admins** – wer darf welchen Verband sehen
- Felder: `user_id`, `federation_id`
- Wird ausschließlich manuell vom System-Admin gesetzt

**invitations** – Einladungs-Links
- Felder: `token` (signiert), `club_id`, `role`, `created_by`, `expires_at`, `used_at`, `used_by`
- Läuft nach 14 Tagen ab, einmalig einlösbar

**Speicherort:** Supabase Postgres (EU-Region), alles mit Row-Level-Security.

### C) Sichtbarkeits-Regeln (RLS in Klartext)

| Wer | Darf sehen | Darf ändern |
|---|---|---|
| Vereinsmitglied | eigenen Verein, eigenes Profil, eigenes Team | eigenes Profil, Module (später) |
| Vereinsadmin | zusätzlich: Einladungen seines Vereins | Vereinsdaten, Einladungen erstellen/widerrufen, Member entfernen |
| Verbandsadmin | aggregierte Daten der Vereine im eigenen Verband | nichts |
| Nicht-eingeloggt | nichts außer öffentliche Seiten | nichts |

### D) Kern-Abläufe

**Registrierung + neuer Verein**
1. User registriert sich → Supabase schickt Bestätigungsmail
2. Nach Bestätigung landet User auf `/onboarding`
3. Wählt „Verein anlegen" → Formular → Verein wird erstellt, User automatisch als `admin` eingetragen
4. Weiterleitung auf `/dashboard`

**Einladung (Admin)**
1. Admin klickt „Einladung erstellen" → wählt Rolle → bekommt einen Link `/einladung/<token>` zum Kopieren
2. Token ist serverseitig signiert

**Einladung einlösen**
1. Eingeladene*r öffnet Link → wenn nicht eingeloggt: Registrierung mit Vorbelegung „Verein aus Einladung"
2. Nach Login prüft der Server: Token gültig? → User wird in `club_members` eingetragen, Token als „used" markiert
3. Fehlerfälle (abgelaufen / benutzt / falsche Person) → klare Meldung

**Verbandsadmin-Zugriff**
- Wird manuell in `federation_admins` eingetragen
- Beim Login prüft eine Middleware, ob der User Verbandsadmin ist, und schaltet `/verband` frei
- Nur aggregierte Views (PROJ-9), keine Vereins-internen Details

### E) Tech-Entscheidungen (warum so)

- **Supabase Auth statt eigene Lösung:** Fertige E-Mail-Bestätigung, Passwort-Reset, Session-Management. EU-Region erfüllt DSGVO.
- **Row-Level-Security in der Datenbank:** Sicherheit auch bei Frontend-Bugs.
- **Session über Next.js Middleware:** Serverseitige Prüfung vor HTML-Auslieferung, kein Flackern.
- **Genau ein Verein pro User im MVP:** Einfachere RLS und UI, später erweiterbar.
- **Verbandsadmins manuell anlegen:** Verhindert Missbrauch.
- **Soft-Delete für Vereine:** 30-Tage-Wiederherstellungsfenster.
- **shadcn/ui ist bereits installiert:** `Form`, `Input`, `Button`, `Card`, `Dialog`, `DropdownMenu`, `Sonner` – alles da.

### F) Abhängigkeiten

- `@supabase/supabase-js` – Auth + DB-Client
- `@supabase/ssr` – Session-Handling in Next.js App Router
- `zod` + `react-hook-form` – Formular-Validierung
- `sonner` – Toast-Nachrichten (bereits installiert)

Keine weiteren externen Dienste außer Supabase.

### G) Setup-Voraussetzungen (vor `/frontend`)

1. **Neues Supabase-Projekt anlegen** (EU-Region, z. B. Frankfurt). URL und Anon-Key landen in `.env.local`; die Service-Role-Key nur in Vercel-Serverumgebung. Dokumentiert in `docs/production/supabase-setup.md` (wird im `/backend`-Schritt ergänzt).
2. **E-Mail-Versand:** MVP startet mit Supabase-Default-Versand (funktioniert sofort, reicht für Tests). Umstieg auf eigenen SMTP-Anbieter (z. B. Resend) ist später optional – als P1-Aufgabe in der Roadmap vormerken.
3. **Auth-Templates auf Deutsch:** Im Supabase Dashboard unter *Authentication → Email Templates* werden Bestätigung, Einladung, Passwort-Reset und Magic-Link auf Deutsch überschrieben. Textvorlagen werden im `/backend`-Schritt mitgeliefert.
4. **Redirect-URLs konfigurieren:** `http://localhost:3000` für Dev, Produktions-URL (Vercel) später nachpflegen.

## Backend Implementation Notes (2026-04-15)

**Geliefert:**
- SQL-Migration [supabase/migrations/0001_proj1_auth.sql](../supabase/migrations/0001_proj1_auth.sql) – alle 6 Tabellen, RLS-Policies, Helper-Funktionen, Trigger „letzter Admin bleibt", Auto-Profile-Anlage bei Signup
- RPC-Funktionen `create_club_with_admin` und `redeem_invitation` für atomare Operationen (SECURITY DEFINER)
- Supabase SSR-Clients: [src/lib/supabase/client.ts](../src/lib/supabase/client.ts), [server.ts](../src/lib/supabase/server.ts), [middleware.ts](../src/lib/supabase/middleware.ts)
- Next.js Root-Middleware [middleware.ts](../middleware.ts) mit Route-Protection (Public: `/`, `/login`, `/registrieren`, `/passwort-*`, `/einladung/*`)
- Auth-Helper: [src/lib/auth/schemas.ts](../src/lib/auth/schemas.ts) (Zod), [session.ts](../src/lib/auth/session.ts)
- API-Routen: [POST /api/invitations/create](../src/app/api/invitations/create/route.ts), [POST /api/invitations/redeem](../src/app/api/invitations/redeem/route.ts)
- Unit-Tests für beide Routen, 9/9 grün
- Setup-Doku [docs/production/supabase-setup.md](../docs/production/supabase-setup.md) inkl. deutscher E-Mail-Templates (Confirm, Magic Link, Reset, Change Email)
- `@supabase/ssr` installiert, alte `src/lib/supabase.ts` entfernt, `.env.local.example` aktualisiert

**Entscheidungen:**
- Club-Anlage und Einladungs-Einlösung laufen über Postgres-RPCs (SECURITY DEFINER), nicht über Service-Role-Key → kein Serverseitiger Admin-Key nötig
- Ein User = ein Verein: per RPC-Check erzwungen
- Einladungs-Tokens: 32 Bytes zufällig, base64url, 14 Tage TTL, einmalig (DB-Transaction)
- Rate-Limiting für Auth-Endpunkte: TODO für `/backend` nach Frontend-Smoke-Test (MVP kann Supabase-Default-Limits nutzen)
- Verbandsadmins werden ausschließlich manuell via Supabase Dashboard angelegt

**Noch offen (nicht blockierend für `/frontend`):**
- Manuelles Smoke-Testing gegen echtes Supabase-Projekt, sobald der User es angelegt und die Migration ausgeführt hat
- Rate-Limiting (Upstash oder DB-basiert) für Login/Register später nachrüsten

## Frontend Implementation Notes (2026-04-15)

**Geliefert (alle Routen kompilieren, `next build` grün, Tests 9/9):**
- Root-Layout mit DM Serif Display / DM Sans + Sonner Toaster
- Landing `/` mit dunklem Gradient-Hero (prototype-inspiriert)
- Auth-Seiten: [/login](../src/app/login/page.tsx), [/registrieren](../src/app/registrieren/page.tsx), [/passwort-vergessen](../src/app/passwort-vergessen/page.tsx), [/passwort-neu](../src/app/passwort-neu/page.tsx)
- Auth-Callback-Route [/auth/callback](../src/app/auth/callback/route.ts) für E-Mail-Bestätigung (PKCE `exchangeCodeForSession`)
- Onboarding-Flow: [/onboarding](../src/app/onboarding/page.tsx), [/onboarding/verein-anlegen](../src/app/onboarding/verein-anlegen/page.tsx), [/onboarding/einladung](../src/app/onboarding/einladung/page.tsx)
- Einladungs-Deep-Link [/einladung/[token]](../src/app/einladung/[token]/page.tsx) löst serverseitig automatisch ein, wenn User eingeloggt und noch ohne Verein
- Geschützter Bereich als Route-Group `(app)` mit serverseitigem Layout, das Session + Club-Zuordnung prüft und bei Bedarf auf `/login` oder `/onboarding` umleitet
- [/dashboard](../src/app/(app)/dashboard/page.tsx) als Placeholder (wird in PROJ-2 befüllt)
- [/profil](../src/app/(app)/profil/page.tsx) mit Name/Rolle bearbeiten
- [/verein](../src/app/(app)/verein/page.tsx) mit Vereinsdaten, Team-Liste und (admin-only) Einladungs-Creator inkl. Copy-Link-UI
- Geteilte Komponenten: [AuthShell](../src/components/auth-shell.tsx), [AppHeader](../src/components/app-header.tsx) mit Dropdown-Menü und Logout

**Entscheidungen:**
- Client nutzt `createClient` aus `@supabase/ssr` für Auth-Operationen direkt (Login, Register, Reset, Profile-Update, Club-Anlage via RPC)
- Einladungs-Einlösung läuft über die bereits existierenden API-Routen (wegen atomarer RPC + Session-Check)
- Onboarding-Guard ist serverseitig im `(app)` Layout – verhindert Flicker und schützt auch bei JS-Aus
- Clubs-Insert + Admin-Eintrag über `create_club_with_admin` RPC statt direktem Insert, damit die RLS-Logik nicht gelockert werden muss

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
