# Product Requirements Document — DuoSpark

| Field | Details |
|---|---|
| **Product Name** | DuoSpark |
| **Tagline** | Date night, sorted. |
| **Version** | v0.1 — Live Beta |
| **Status** | 🟢 Live at duosprak.vercel.app |
| **Author** | — |
| **Last Updated** | September 2026 |

---

## Table of Contents

1. [Overview](#1-overview)
2. [Problem Statement](#2-problem-statement)
3. [Goals & Non-Goals](#3-goals--non-goals)
4. [Target Users](#4-target-users)
5. [User Journey](#5-user-journey)
6. [Feature Requirements](#6-feature-requirements)
7. [User Stories & Acceptance Criteria](#7-user-stories--acceptance-criteria)
8. [Technical Architecture](#8-technical-architecture)
9. [Product Design Decisions](#9-product-design-decisions)
10. [Success Metrics](#10-success-metrics)
11. [Risks & Mitigations](#11-risks--mitigations)
12. [Out of Scope](#12-out-of-scope)
13. [Experiment Plan](#13-experiment-plan)
14. [Future Roadmap](#14-future-roadmap)
15. [Glossary](#15-glossary)

---

## 1. Overview

Most couples — regardless of how long they've been together — face the same problem: they want quality time, but the gap between "we should do something" and actually doing it is never crossed. Pinterest boards fill up. Saved Reels pile up. And Saturday night becomes Netflix again.

DuoSpark is a date-night ritual platform for Indian couples. It closes the gap between intention and experience by planning, prepping, and running date nights end-to-end — together or across distances. When both partners swipe right on the same date idea, DuoSpark takes over: shopping lists, recipe videos, pre-flight routines, a synced Date Room with in-app video call, and a Memory Wall to capture what happened.

The product is live, supports full account creation and partner linking, and includes an in-app WebRTC video call feature for long-distance couples.

---

## 2. Problem Statement

Couples consistently run into the same wall, across every relationship stage:

- **Idea overload, zero execution** — hundreds of saved ideas that never become plans
- **Decision fatigue** — one partner always ends up planning; the other always feels guilty
- **LDR-specific loneliness** — video calls devolve into daily check-ins with no shared experience
- **Relationship routine** — dinner-Netflix loops that erode spontaneity over time
- **No memory-making infrastructure** — even good date nights are forgotten within weeks

Existing solutions address only parts of this:
- Pinterest and Reels give ideas but no execution
- Google Calendar gives scheduling but no experience
- WhatsApp and Facetime give connection but no shared activity

**DuoSpark is the execution layer that existing tools don't provide.**

---

## 3. Goals & Non-Goals

### Goals

- Give couples a frictionless way to discover, agree on, and execute a date night together
- Serve all four Indian couple personas: newly dating, long-distance, engaged-but-apart, living together
- Build a repeatable weekly ritual that couples return to every week
- Capture and preserve memories to build a shared relationship archive
- Launch to the first 100 founding couples and validate weekly retention

### Non-Goals (v0.1)

- AI-generated personalised date recommendations (planned for v0.2)
- Google or Apple social sign-in (deferred — email/password auth is live)
- Native mobile app (iOS / Android)
- Paid subscription tiers (founding couples are free for life)
- Multi-language support beyond English
- Group date features (3+ people)

---

## 4. Target Users

DuoSpark is built for Indian couples across four distinct relationship modes, each with different pain points and feature needs:

### Newly Dating
**Pain:** "We've done dinner-movie three times. I want something interesting but not weird."
**Needs:** Low-pressure ideas, conversation starters, privacy mode, no pressure to be "couple-y" too fast.

### Long-Distance
**Pain:** "Every video call is 'how was your day.' I miss feeling like a couple."
**Needs:** Synced activities, in-app video call, time-zone-aware scheduling, Letter Locker for async intimacy.

### Engaged but Apart
**Pain:** "Six months till the wedding. I still feel like I'm interviewing him."
**Needs:** Pre-marriage conversation prompts, family-appropriate dates, shared planning tools.

### Living Together
**Pain:** "We love each other. But we've stopped surprising each other."
**Needs:** City-specific dates, Mystery Date surprises, Memory Wall as visible proof of effort.

---

## 5. User Journey

### Primary Flow — New Couple

```
1. Partner A lands on duosprak.vercel.app
2. Completes 16-step onboarding
   └─ Name, age, gender, city, WhatsApp number
   └─ Relationship mode selection
   └─ Partner name + city
   └─ Spark profile (preferences, vibe)
   └─ Generate unique invite code
3. Shares invite code with Partner B
4. Partner B signs up using the invite code → accounts linked as a couple
5. Both receive Date Deck on Sunday (3 curated ideas)
6. Each swipes privately → match triggers auto-schedule
7. Wednesday: shopping list delivered
8. Friday: recipe video delivered
9. Saturday 8:45 PM: Pre-flight routine
10. Saturday 9:00 PM: Date Room opens
    └─ Synced timer + playlist + step-by-step guide
    └─ In-app WebRTC video call (for LDR couples)
11. Date ends → Memory Card created (2 photos + notes)
12. Memory Card saved to shared Memory Wall
```

### Secondary Flow — Partner Joining via Invite

```
1. Partner B receives invite code from Partner A
2. Opens DuoSpark → enters invite code on signup
3. Accounts auto-linked → enters shared couple dashboard
```

---

## 6. Feature Requirements

### 6.1 Onboarding (16 Steps)

- Email + password account creation (no social login in v0.1)
- Profile fields: name, age, gender, city, state, country, WhatsApp number
- Relationship mode selection (newly dating / LDR / engaged / living together)
- Partner details: name, city
- Spark profile: preferences, budget bracket, date vibe
- Unique 6-character invite code generated on completion
- Progress bar visible throughout (step N of 16)
- Partner join flow: enter invite code → auto-link to existing account

### 6.2 Date Deck

- 3 curated date ideas delivered every Sunday at 9 AM
- Each idea scoped to the couple's relationship mode and city
- Both partners swipe privately (no influence on each other's choice)
- Match triggers auto-schedule for Saturday; no match = new deck next Sunday
- Date cards show: title, duration, cost estimate, icon, relationship mode tag
- Date library covers: cooking, outdoor, creative, conversation, festival-specific dates
- Festival awareness: Diwali, Holi, Karva Chauth, Valentine's, Christmas, Onam

### 6.3 Date Detail

Each date in the library includes:
- Title, description, duration, cost estimate, relationship mode
- Full shopping list with item, cost, and Amazon link where applicable
- Recipe or activity video (YouTube link)
- Pre-flight checklist (15-minute warm-up routine)
- Step-by-step guide with per-step time estimates
- Separate shopping lists for LDR couples (each partner's own list)

### 6.4 Date Room

- Opens at scheduled date time (Saturday 9 PM default)
- Synced countdown timer visible to both partners
- Synced playlist (shared music for the duration)
- Step-by-step activity guide displayed in real time
- In-app WebRTC video call (camera + microphone, local PiP overlay)
- Video call status indicator (connecting / live / ended)
- End-of-date prompt: capture Memory Card

### 6.5 Memory Wall

- Shared wall visible to both partners
- Each memory card: 2 photos + 2 notes (one from each partner)
- Cards display date title, date, location context
- After 6 months of memories → exportable scrapbook (planned v0.2)
- Memory detail view: full card with photos and notes

### 6.6 Letter Locker

- Async message feature for LDR couples
- Write and schedule letters to be delivered at a future date
- Recipient cannot open until scheduled delivery time
- Supports text + optional photo attachment

### 6.7 Discover

- Browse full date library outside the weekly deck
- Filter by: relationship mode, budget bracket, duration, festival
- Tap any card to see full workflow before committing

### 6.8 Profile

- View and edit personal Spark profile
- View couple stats: dates completed, streak, total time together
- Invite code display (for re-sharing with partner)
- Partner profile summary

### 6.9 Authentication

- Email + password sign-in and sign-up
- Password hashed client-side before storage
- Session persisted via localStorage
- Supabase backend for profile and couple data storage
- Google Sign-In: deferred (in development)

---

## 7. User Stories & Acceptance Criteria

### US-01 — Create an account and invite partner

> *As a user, I want to sign up and link my account to my partner so we can use DuoSpark together.*

**Acceptance Criteria:**
- [ ] User completes 16-step onboarding with all required fields
- [ ] Unique invite code is generated on completion
- [ ] Partner can sign up using the invite code and accounts are linked
- [ ] Both partners see each other's name in the shared dashboard after linking

---

### US-02 — Discover and match on a date idea

> *As a couple, we want to independently choose from date options so neither partner feels pressured by the other's choice.*

**Acceptance Criteria:**
- [ ] Each partner sees the same 3 date cards on Sunday
- [ ] Swipe choices are hidden from each other until both have chosen
- [ ] If both choose the same date, it is auto-scheduled for Saturday
- [ ] If there is no match, a new deck appears the following Sunday
- [ ] Matched date is visible on both partners' home screens with date and time

---

### US-03 — Run a date in the Date Room

> *As a couple, I want a guided experience during our date so we don't have to figure out what to do next.*

**Acceptance Criteria:**
- [ ] Date Room opens at the scheduled time
- [ ] Synced timer counts down the date duration for both partners simultaneously
- [ ] Step-by-step instructions display with per-step time
- [ ] Shared playlist plays during the date
- [ ] LDR couples can initiate in-app video call within the Date Room
- [ ] End-of-date screen prompts Memory Card creation

---

### US-04 — Capture and view memories

> *As a couple, I want to save photos and notes from our dates so we can look back on them.*

**Acceptance Criteria:**
- [ ] After each date, both partners can add a photo and a note
- [ ] Memory Card is saved to the shared Memory Wall
- [ ] Memory Wall displays all past date cards in reverse chronological order
- [ ] Tapping a card opens the full memory detail view

---

### US-05 — Write a letter in Letter Locker

> *As an LDR partner, I want to write a letter to be delivered later so my partner has something to open on a special day.*

**Acceptance Criteria:**
- [ ] User can write a letter with text and optional photo
- [ ] User can set a future delivery date and time
- [ ] Partner cannot open the letter until the scheduled time
- [ ] Delivered letters are marked as opened after the partner reads them

---

### US-06 — Video call during a date

> *As an LDR couple, I want to video call within the app during our date so we don't have to switch to WhatsApp.*

**Acceptance Criteria:**
- [ ] Video call can be initiated from within the Date Room
- [ ] Both camera and microphone are accessible
- [ ] Local video appears as a PiP overlay in the corner
- [ ] Call status (connecting / live / ended) is visible
- [ ] Call can be ended without leaving the Date Room

---

## 8. Technical Architecture

### Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML + JavaScript (single-file SPA) |
| Typography | Fraunces (display), Geist (body), DM Mono (labels) |
| Icons | Tabler Icons (outline webfont) |
| Backend / Database | Supabase (Postgres + Auth) |
| Video Call | WebRTC (browser-native, peer-to-peer) |
| State | localStorage (session) + Supabase (persistent) |
| Deployment | Vercel (static) |
| Date Library | Hand-curated JSON (embedded in index.html) |

### Data Model (simplified)

```
profiles
  └─ id, name, email, whatsapp, city, state, country
  └─ partnerId, coupleId
  └─ profile_data (Spark profile, mode, preferences, invite code)

couples
  └─ id, partner_a_id, partner_b_id
  └─ current_date_id, streak, dates_completed

dates (library — embedded JSON)
  └─ id, title, mode, icon, budget, duration
  └─ shopping[], preflight[], steps[], video{}

memories
  └─ coupleId, dateId, dateTitle
  └─ photo_a, note_a, photo_b, note_b
  └─ createdAt

letters
  └─ fromId, toId, body, photo
  └─ deliverAt, openedAt
```

### Authentication

- Email + password auth via Supabase Auth
- Password hashed client-side before transmission
- Session stored in localStorage
- Google Sign-In: in development (deferred from v0.1)

### Video Call (WebRTC)

- Browser-native WebRTC API (no external library)
- Peer-to-peer connection established via signaling
- Local video displayed as PiP overlay
- Remote video fills the Date Room panel

### Date Library

- 20+ hand-curated dates embedded as structured JSON in `index.html`
- Each entry fully self-contained: shopping, preflight, steps, video, festival tags
- India-context-aware: city-specific options for Mumbai, Delhi, Bangalore, Lodi Garden, Cubbon Park etc.
- Budget brackets: free, low (≤₹500), mid (₹500–1,500), high (₹1,500–3,000), premium

---

## 9. Product Design Decisions

### Weekly ritual over on-demand browsing

DuoSpark delivers a Date Deck every Sunday rather than letting couples browse whenever. This creates a shared weekly rhythm — both partners know Sunday means new options — and reduces decision fatigue. The constraint (only 3 choices) is intentional.

### Private swiping before reveal

Each partner swipes independently, with no visibility into the other's choice until both have decided. This prevents anchoring bias (the first-mover's choice influences the second) and removes the social pressure of "I don't want to disappoint them." The match moment becomes a genuine shared discovery.

### End-to-end ownership of the date

Most products stop at the idea. DuoSpark owns the entire execution: shopping list → video prep → pre-flight → live Date Room → memory capture. The goal is zero gap between "we agreed on a date" and "we actually did it."

### India-first content curation

All dates are curated for Indian contexts: Amazon India links in shopping lists, city-specific outdoor dates (Lodi Garden in Delhi, Cubbon Park in Bangalore, Kala Ghoda in Mumbai), festival-aware dates (Diwali rangoli, Holi colour throw, Karva Chauth), and INR pricing throughout.

### Memory Wall as relationship proof

The Memory Wall is not just a photo album — it is designed to be visible proof of effort over time. After 6 months of consistent dates, the wall becomes a scrapbook that demonstrates sustained investment in the relationship. This drives long-term retention more than any notification or streak mechanic.

### LDR as a first-class persona

Most date apps assume physical proximity. LDR couples are a primary persona for DuoSpark, not an afterthought. In-app video call, parallel activity design (both do the same thing simultaneously in their own spaces), Letter Locker for async intimacy, and time-zone-aware scheduling are all built specifically for LDR.

---

## 10. Success Metrics

### Activation Metrics

| Metric | Target |
|---|---|
| Onboarding completion rate | > 60% |
| Partner link rate (both partners join) | > 50% of signups |
| Time to first date match | < 7 days after both partners join |

### Engagement Metrics

| Metric | Target |
|---|---|
| Week 2 retention (couple returns for second date) | > 40% |
| Date Room completion rate (opened and finished) | > 70% |
| Memory Card creation rate (post-date) | > 50% |
| Letter Locker usage (LDR couples) | > 30% of LDR couples per month |

### Business Metrics (Post-Beta)

| Metric | Target |
|---|---|
| Founding couples activated | 100 |
| Weekly active couples at 30 days | > 40 of 100 |
| NPS from founding couples | > 50 |
| Qualitative feedback sessions completed | 20 |

---

## 11. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Only one partner completes onboarding | High — product requires both | In-app invite flow + WhatsApp share CTA; reminder nudge after 48 hours |
| Couples match on different dates (no match) | Medium — breaks weekly ritual | Show both choices after the week; offer a re-vote round |
| WebRTC connection fails for LDR couples | High — core LDR feature | Fallback prompt to switch to WhatsApp; improve signaling in v0.2 |
| Date library feels repetitive after 4–6 weeks | High — drives churn | Expand library; festival calendar keeps content fresh; AI personalisation in v0.2 |
| Google Sign-In not available | Medium — friction in signup | Email/password auth is complete; Google deferred, not dropped |
| No users yet to validate retention assumptions | High | Founder-led outreach to first 20 couples; weekly 1:1 feedback calls |
| Privacy concern — couples sharing personal data | Medium | No third-party data sharing; Supabase data stays within the product |

---

## 12. Out of Scope

The following are explicitly **not** part of v0.1:

- AI-powered personalised date recommendations
- Google or Apple social sign-in
- Native iOS or Android app
- Paid subscription tiers
- Push notifications (email nudges only)
- Public date sharing or social features
- Group dates (3+ participants)
- Non-English language support
- Exportable scrapbook (planned v0.2)
- Automated shopping cart integration

---

## 13. Experiment Plan

### Hypothesis

Couples who complete the full Date Room experience (pre-flight → live steps → Memory Card) will retain at a significantly higher rate in week 2 than couples who match on a date but do not complete the room.

### Setup

| | Control | Variant |
|---|---|---|
| **Group** | Couples who matched but skipped Date Room | Couples who completed full Date Room flow |
| **Measurement period** | 14 days post-match | 14 days post-match |
| **Sample** | First 100 founding couples | First 100 founding couples |

### Primary Success Criteria

- Full Date Room completers show **≥ 2× week-2 retention** vs. non-completers
- Memory Card creation rate **> 50%** among completers

### Secondary Metrics

- Which step in the Date Room sees the highest drop-off
- Which date from the library gets matched most often
- LDR vs. co-located retention difference

---

## 14. Future Roadmap

| Phase | Feature |
|---|---|
| **v0.2** | Google Sign-In |
| **v0.2** | AI-powered personalised date recommendations based on Spark profile |
| **v0.2** | Improved WebRTC signaling reliability |
| **v0.2** | Exportable 6-month scrapbook (PDF) |
| **v0.3** | WhatsApp / push notification nudges (Sunday deck, Wednesday shopping list, Saturday pre-flight) |
| **v0.3** | Expanded date library (50+ dates across all modes) |
| **v0.3** | Streak tracking and couple milestones |
| **v0.4** | Freemium model: free tier (2 dates/month) + Pro (unlimited + AI) |
| **v0.4** | Mystery Date mode (partner doesn't know what's planned) |
| **v1.0** | Native mobile app (React Native) |
| **v1.0** | Seller / experience partner integrations (book a class, order ingredients) |
| **v1.1** | Community date library (couples contribute their own dates) |

---

## 15. Glossary

| Term | Definition |
|---|---|
| **Date Deck** | A set of 3 curated date ideas delivered to a couple every Sunday for private swiping |
| **Date Room** | The live in-app experience that runs during a date — synced timer, playlist, steps, and video call |
| **Spark Profile** | A user's preference profile built during onboarding — relationship mode, budget bracket, city, vibe |
| **Memory Card** | A post-date capture: 2 photos + 2 notes (one from each partner), saved to the Memory Wall |
| **Memory Wall** | A shared archive of all completed date memory cards for a couple |
| **Letter Locker** | An async message feature allowing partners to write and schedule letters for future delivery |
| **Invite Code** | A unique 6-character code generated at the end of Partner A's onboarding, shared with Partner B to link accounts |
| **LDR** | Long-distance relationship — couples who are geographically separated |
| **Pre-flight** | A 15-minute warm-up checklist before the Date Room opens (e.g. set the table, pour a drink, light a candle) |
| **Match** | The moment both partners privately choose the same date from the Date Deck — triggers auto-schedule |
| **Founding Couple** | One of the first 100 couples on the platform; free for life and given direct feedback access to the founder |
| **Mode** | The relationship stage a couple selects: newly dating, long-distance, engaged, or living together |

---

*DuoSpark — Date night, sorted. 🔥*
*Built in India, for couples everywhere.*
