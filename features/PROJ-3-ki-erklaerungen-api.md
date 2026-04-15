# PROJ-3: KI-Erklärungen (API-Route)

## Status: Planned
**Created:** 2026-04-15
**Last Updated:** 2026-04-15

## Dependencies
- Requires: PROJ-1 (Auth) – Endpunkt ist nur für eingeloggte Nutzer*innen
- Requires: PROJ-2 (Modul-Framework) – KI bezieht sich auf Modul-Kontexte

## User Stories
- Als Nutzer*in möchte ich in jedem Modul mit einem Klick eine verständliche, modul-spezifische KI-Erklärung laden können, damit ich das Thema schnell durchdringe.
- Als Nutzer*in möchte ich, dass die Erklärung live als Stream erscheint (wie ChatGPT), damit ich sofort etwas sehe und nicht warten muss.
- Als Nutzer*in möchte ich die Erklärung erneut öffnen können, ohne dass ein neuer API-Call entsteht (Cache im Browser).
- Als Betreiber möchte ich, dass der Claude-API-Key niemals im Client landet, damit er nicht missbraucht werden kann.
- Als Betreiber möchte ich Rate-Limits und einfache Missbrauchserkennung, damit ein einzelner Nutzer die Kosten nicht sprengt.

## Acceptance Criteria
- [ ] Next.js Route `POST /api/ai/explain` nimmt `{ moduleId }` entgegen und liefert einen SSE/Chunked-Stream zurück
- [ ] Nur eingeloggte Nutzer*innen mit gültiger Supabase-Session dürfen die Route aufrufen (401 sonst)
- [ ] Server-seitig wird der passende Prompt aus `src/lib/modules.ts` geladen – Client schickt KEINE freien Prompts
- [ ] Claude-Model: `claude-sonnet-4-6` (oder aktuelleres), `max_tokens` ≤ 1000
- [ ] System-Prompt: „Du bist Experte für Kinderschutz in Sportvereinen. Praxisnah, deutsch, kein Fachjargon-Overload."
- [ ] Rate-Limit pro User: max. 20 Anfragen / Stunde; bei Überschreitung 429 mit klarer Meldung
- [ ] Client streamt die Antwort progressiv ins UI und rendert Markdown (mind. Absätze + Listen)
- [ ] Ergebnis wird pro Session im Browser gecacht (React Query oder einfacher Map-Cache), kein erneuter Call beim Re-Open
- [ ] Fehlerfall (Claude nicht erreichbar): freundliche Fallback-Meldung + Retry-Button

## Edge Cases
- Was passiert, wenn die Verbindung während des Streams abbricht? → Bisherigen Text behalten, Retry-Button anzeigen
- Was passiert, wenn Claude einen unerwarteten Response ohne Text-Block liefert? → Fallback-Text + Log-Event
- Was passiert bei sehr langsamer Antwort? → Keep-Alive-Chunks, Timeout serverseitig bei 30 s
- Was passiert, wenn jemand das Rate-Limit hittet? → 429 + Hinweis „In X Minuten wieder verfügbar"
- Was passiert, wenn der Key ungültig / Key-Rotation? → 500 + Admin-Alert (Log), generische Meldung im UI

## Technical Requirements
- `ANTHROPIC_API_KEY` als Vercel Env Var (niemals im Client-Bundle)
- `@anthropic-ai/sdk` serverseitig, Streaming via `messages.stream()`
- Rate-Limit: Upstash Redis oder Supabase-basierter Counter (user_id + Stundenfenster)
- Prompt Caching (Anthropic `cache_control`) für den System-Prompt aktivieren, um Kosten zu senken

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)
_To be added by /architecture_

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
