# ScoreBite

ScoreBite is a private FIFA World Cup prediction league app for friends. Users sign in with Google, create invite-only leagues, predict match scores, and attach friendly stakes like coffee, pizza, treats, burgers, or dares.

ScoreBite is intentionally not a gambling or payment product. It does not support odds, wagers, real-money payments, payouts, payment processing, or enforcement of stakes. Stakes are social reminders only.

Live deployment:

[https://scorebite.vercel.app](https://scorebite.vercel.app)

## What The App Does

ScoreBite lets a group of friends run a private prediction league around the FIFA World Cup.

Core flows:

1. A user signs in with Google.
2. They create a private league.
3. ScoreBite generates an invite code.
4. Friends join the league with that code.
5. Everyone sees the shared World Cup match schedule.
6. Users submit score predictions before kickoff.
7. Predictions lock automatically once a match starts.
8. A league owner/admin enters final match results.
9. The leaderboard updates using the scoring rules.
10. Friendly stake reminders appear after results are entered.

## Main Features

- Google authentication with Supabase Auth
- Private leagues with invite codes
- Click-to-copy invite codes
- Public World Cup match schedule page
- Full FIFA World Cup 2026 match importer
- Prediction forms for match scores
- Friendly stake text on predictions
- Automatic prediction locking after kickoff
- Admin result entry
- Leaderboard scoring
- Exact score and correct result counts
- Streak badges
- Friendly stake reminders
- Editable user profiles
- Dark-mode sports-card UI
- Mobile-responsive layouts
- Vercel-ready deployment

## User Profiles

Users can edit their player card from `/profile`.

Editable fields:

- Display name
- Username
- Bio
- Favorite team
- Avatar/photo URL

Profile data appears in league leaderboards and friend-facing league screens.

For the MVP, avatars are stored as image URLs. Supabase Storage upload support can be added later if direct file upload is needed.

## Scoring Rules

ScoreBite uses simple prediction scoring:

| Prediction outcome | Points |
| --- | ---: |
| Exact score | 5 |
| Correct winner + correct goal difference | 3 |
| Correct winner only | 2 |
| Correct draw but wrong score | 2 |
| Wrong prediction | 0 |

Scoring logic lives in:

`lib/scoring.ts`

## Friendly Stakes

When submitting a prediction, users can add a stake such as:

- Coffee
- Pizza
- Burger
- Treat
- Funny dare

After a result is entered, ScoreBite can show who owes a friendly stake to another player. These reminders are not legally or financially enforced.

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Landing page |
| `/login` | Google login |
| `/dashboard` | User leagues |
| `/profile` | Edit profile |
| `/matches` | Public World Cup match schedule |
| `/create-league` | Create private league |
| `/join-league` | Join league by invite code |
| `/league/[leagueId]` | League leaderboard, invite code, stakes, matches |
| `/league/[leagueId]/match/[matchId]` | Submit/view prediction |
| `/admin` | Import matches and enter match results |
| `/auth/callback` | Supabase OAuth callback |

## Tech Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase Postgres
- Supabase Row-Level Security
- Vercel deployment
- Lucide icons

## Project Structure

```text
app/
  admin/page.tsx
  auth/callback/route.ts
  create-league/page.tsx
  dashboard/page.tsx
  join-league/page.tsx
  league/[leagueId]/page.tsx
  league/[leagueId]/match/[matchId]/page.tsx
  login/page.tsx
  matches/page.tsx
  profile/page.tsx
  layout.tsx
  page.tsx

components/
  AdminResultForm.tsx
  Badges.tsx
  CopyInviteButton.tsx
  Footer.tsx
  Header.tsx
  Leaderboard.tsx
  LeagueCard.tsx
  MatchCard.tsx
  PredictionForm.tsx

lib/
  actions.ts
  helpers.ts
  names.ts
  scoring.ts
  supabaseClient.ts
  worldCupSchedule.ts

scripts/
  seed-matches.ts

styles/
  globals.css

supabase/
  schema.sql

types/
  db.ts
```

## Database Tables

The schema lives in:

`supabase/schema.sql`

Tables:

- `profiles`
- `leagues`
- `league_members`
- `matches`
- `predictions`
- `stake_settlements`

Important profile fields:

- `username`
- `full_name`
- `bio`
- `favorite_team`
- `avatar_url`

Important match fields:

- `match_number`
- `tournament`
- `stage`
- `group_name`
- `team_a`
- `team_b`
- `kickoff_time`
- `venue`
- `team_a_score`
- `team_b_score`
- `status`

## Row-Level Security

Supabase RLS is enabled for all app tables.

High-level policy behavior:

- Users can only see leagues they belong to.
- Users can only see league member lists for their own leagues.
- Users can create their own private leagues.
- Users can join leagues through invite codes.
- Users can create/update their own predictions before kickoff.
- Match schedules are publicly readable.
- League owners/admins can enter results.
- League members can see stake reminders for their own league.

League creation and invite joining are handled with RLS-safe database functions:

- `create_league_for_current_user(league_name, invite_code_input)`
- `join_league_by_invite(invite_code_input)`

## World Cup Schedule Import

ScoreBite can import all 104 FIFA World Cup 2026 matches.

Importer:

`lib/worldCupSchedule.ts`

CLI seed script:

`scripts/seed-matches.ts`

Admin import:

`/admin`

The importer reads public match schedule pages and upserts matches by `match_number`, so rerunning the import updates existing rows instead of creating duplicates.

## Environment Variables

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Required:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Optional for local CLI seeding:

```bash
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-for-local-seeding-only
```

Do not commit `.env.local`.

## Local Setup

Install dependencies:

```bash
npm install
```

Run the Supabase schema:

1. Open Supabase Dashboard.
2. Go to SQL Editor.
3. Paste the latest contents of `supabase/schema.sql`.
4. Run it.

Re-run the schema whenever new columns, policies, or functions are added.

Start local development:

```bash
npm run dev -- -p 3001
```

Open:

[http://localhost:3001](http://localhost:3001)

## Supabase Auth Setup

Enable Google Auth:

1. Supabase Dashboard -> Authentication -> Providers -> Google
2. Add Google OAuth client ID and secret
3. Supabase Dashboard -> Authentication -> URL Configuration
4. Add local callback URLs:

```text
http://localhost:3000/auth/callback
http://localhost:3001/auth/callback
http://localhost:3002/auth/callback
```

For production, add:

```text
https://scorebite.vercel.app/auth/callback
```

Set Supabase Site URL to:

```text
https://scorebite.vercel.app
```

In Google Cloud Console, the authorized redirect URI should be the Supabase callback:

```text
https://your-project-ref.supabase.co/auth/v1/callback
```

Example from the current project:

```text
https://nlxvkgipmatdtjzmivyv.supabase.co/auth/v1/callback
```

## Importing Matches

Option 1: from the app

1. Sign in.
2. Create or open a league as an owner/admin.
3. Go to `/admin`.
4. Click **Import matches**.

Option 2: from CLI

Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local`, then run:

```bash
npm run seed:matches
```

## Testing Checklist

Use this before calling a deployment production-ready:

1. Sign in with Google.
2. Edit profile at `/profile`.
3. Create a league.
4. Copy invite code from dashboard or league page.
5. Join from another Google account or browser profile.
6. Import World Cup matches from `/admin`.
7. Open `/matches` and confirm upcoming matches appear.
8. Open a league match and submit a prediction.
9. Add a friendly stake.
10. Refresh and confirm the prediction persists.
11. Confirm completed/past matches are locked.
12. Enter a result from `/admin`.
13. Confirm leaderboard points update.
14. Confirm stake reminders appear.
15. Test mobile layout.

## Deployment

The app is deployed on Vercel:

[https://scorebite.vercel.app](https://scorebite.vercel.app)

To deploy manually:

```bash
npx vercel deploy --prod
```

Production environment variables required in Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

The service-role key is not required for normal deployed app runtime.

## Useful Commands

```bash
npm run dev -- -p 3001
npm run lint
npm run build
npm run seed:matches
```

## Troubleshooting

### Supabase table missing

Error:

```text
Could not find the table 'public.leagues' in the schema cache
```

Fix:

Run the latest `supabase/schema.sql` in the Supabase SQL Editor.

### RLS error creating leagues

Error:

```text
new row violates row-level security policy for table "leagues"
```

Fix:

Run the latest schema. League creation depends on the RPC:

```text
create_league_for_current_user
```

### Google redirect mismatch

Error:

```text
redirect_uri_mismatch
```

Fix:

Add the Supabase callback URL in Google Cloud Console:

```text
https://your-project-ref.supabase.co/auth/v1/callback
```

Add the app callback URL in Supabase:

```text
http://localhost:3001/auth/callback
https://scorebite.vercel.app/auth/callback
```

### Next dev cache missing chunks

Error:

```text
Cannot find module './123.js'
```

Fix:

```bash
Ctrl+C
rm -rf .next
npm run dev -- -p 3001
```

Avoid running `npm run build` while `npm run dev` is still running. Both commands write to `.next`, which can confuse the development server.

## Safety / Product Boundaries

ScoreBite is for casual prediction games among friends.

It does not:

- Offer odds
- Handle betting
- Process payments
- Hold balances
- Pay winnings
- Enforce stakes
- Support real-money gambling

Friendly stakes are just text reminders between friends.
