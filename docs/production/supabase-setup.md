# Supabase Setup (PROJ-1)

Einmalige Einrichtung, damit der Schutzkonzept-Generator lokal und in Vercel läuft.

## 1. Projekt anlegen

1. Auf https://supabase.com einloggen → **New project**
2. Region: **Frankfurt (EU Central)** (DSGVO)
3. Name: `schutzkonzept-konfigurator`
4. Datenbank-Passwort sicher speichern (Password Manager)
5. Plan: Free reicht für MVP

## 2. Env-Variablen

Nach Anlegen des Projekts:
- Projekt-URL und **anon public**-Key unter *Settings → API* kopieren
- In `.env.local` eintragen (Template siehe `.env.local.example`)
- Dieselben Werte später in Vercel als Environment Variables setzen (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_APP_URL`)

## 3. Datenbankschema anwenden

1. Supabase Dashboard → **SQL Editor** → **New query**
2. Inhalt von `supabase/migrations/0001_proj1_auth.sql` einfügen
3. **Run** ausführen
4. Unter *Table Editor* sollten jetzt sichtbar sein: `profiles`, `federations`, `clubs`, `club_members`, `federation_admins`, `invitations`

## 4. Auth-Einstellungen

Unter *Authentication → Providers → Email*:
- **Enable email provider**: an
- **Confirm email**: an (Bestätigungsmail Pflicht)
- **Secure email change**: an

Unter *Authentication → URL Configuration*:
- **Site URL**: `http://localhost:3000` (für Dev) — in Prod später auf Vercel-URL umstellen
- **Redirect URLs**: `http://localhost:3000/**` und später die Vercel-URL

## 5. Deutsche E-Mail-Templates

Unter *Authentication → Email Templates* jedes Template überschreiben.

### Confirm signup

**Subject:** `Bestätige deine Registrierung beim Schutzkonzept-Generator`

```html
<h2>Willkommen beim Schutzkonzept-Generator</h2>
<p>Hallo,</p>
<p>bitte bestätige deine E-Mail-Adresse, um deinen Zugang zu aktivieren:</p>
<p><a href="{{ .ConfirmationURL }}">E-Mail-Adresse bestätigen</a></p>
<p>Dieser Link ist 24 Stunden gültig. Falls du dich nicht registriert hast, kannst du diese Nachricht ignorieren.</p>
<p>Viele Grüße<br/>Dein Schutzkonzept-Team</p>
```

### Magic Link

**Subject:** `Dein Login-Link für den Schutzkonzept-Generator`

```html
<h2>Login-Link</h2>
<p>Hallo,</p>
<p>klicke auf den folgenden Link, um dich anzumelden:</p>
<p><a href="{{ .ConfirmationURL }}">Jetzt anmelden</a></p>
<p>Der Link ist einmalig nutzbar und läuft nach einer Stunde ab.</p>
```

### Reset Password

**Subject:** `Passwort zurücksetzen`

```html
<h2>Passwort zurücksetzen</h2>
<p>Hallo,</p>
<p>du hast ein neues Passwort angefordert. Klicke auf den folgenden Link, um es zu setzen:</p>
<p><a href="{{ .ConfirmationURL }}">Neues Passwort festlegen</a></p>
<p>Falls du diese Anfrage nicht ausgelöst hast, ignoriere diese E-Mail einfach.</p>
```

### Change Email Address

**Subject:** `Bestätige deine neue E-Mail-Adresse`

```html
<h2>E-Mail-Adresse ändern</h2>
<p>Hallo,</p>
<p>bitte bestätige die Änderung deiner E-Mail-Adresse:</p>
<p><a href="{{ .ConfirmationURL }}">Neue E-Mail bestätigen</a></p>
```

### Invite user (Supabase-Default-Invite, wird im MVP nicht genutzt — unser eigener Einladungs-Flow läuft über `/einladung/<token>`)

Kann auf Default bleiben oder leer lassen.

## 6. E-Mail-Versand

MVP startet mit dem **Supabase-Default-Versand** (funktioniert sofort ohne weitere Konfiguration, Zustellbarkeit ausreichend für Tests und kleine Nutzerzahlen).

Später (P1): Umstieg auf eigenen SMTP-Anbieter (z. B. Resend) unter *Settings → Auth → SMTP Settings* für bessere Zustellraten und eigene Absenderadresse.

## 7. Verbandsadmins anlegen (manuell)

Verbandsadmins werden NICHT per Self-Service erstellt. Vorgehen:

1. User registriert sich normal mit E-Mail/Passwort
2. Supabase Dashboard → *Table Editor → federations* → neuen Verband anlegen (`name`, `slug`, `short_name`)
3. *Table Editor → federation_admins* → neue Zeile: `user_id` (aus `auth.users`), `federation_id`
4. Der User hat ab sofort Lese-Zugriff auf `/verband`

## 8. Smoke-Test

- Registrierung in der App durchlaufen → Bestätigungsmail erhalten → klicken → Onboarding erscheint
- Verein anlegen → Weiterleitung auf `/dashboard`
- In `public.club_members` sollte ein Eintrag mit Rolle `admin` stehen
