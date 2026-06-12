# ScoreBite

Private World Cup prediction leagues for friends, with friendly stakes like coffee, pizza, treats, and dares. ScoreBite does not handle odds, gambling, real-money payments, or payment enforcement.

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a Supabase project and run the SQL in `supabase/schema.sql` from the Supabase SQL editor.

   If you see `Could not find the table 'public.leagues' in the schema cache`, the SQL schema has not been applied to the Supabase project connected in `.env.local`.
   Re-run the latest schema whenever new columns or functions are added, such as profile fields or the league creation RPC.

3. Enable Google Auth in Supabase:

   - Supabase Dashboard -> Authentication -> Providers -> Google.
   - Add your Google OAuth client ID and secret.
   - In Google Cloud Console -> APIs & Services -> Credentials -> your OAuth client, add this as an Authorized redirect URI:
     - `https://your-project-ref.supabase.co/auth/v1/callback`
   - In Supabase Dashboard -> Authentication -> URL Configuration, add redirect URLs:
     - `http://localhost:3000/auth/callback`
     - `http://localhost:3001/auth/callback`
     - `http://localhost:3002/auth/callback`
     - `https://your-vercel-domain.vercel.app/auth/callback`

4. Fill `.env.local`:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-for-local-seeding-only
   ```

5. Import all 104 FIFA World Cup 2026 matches after the schema and env are ready:

   ```bash
   npm run seed:matches
   ```

6. Run locally:

   ```bash
   npm run dev
   ```

   Open `http://localhost:3000`.

## Test Flow

1. Sign in with Google.
2. Create a league from `/create-league`.
3. Copy the invite code and join from another account or browser profile.
4. Open a match and submit a score prediction before kickoff.
5. As a league owner or admin, open `/admin` and enter a final result.
6. Confirm the league leaderboard updates and friendly stake reminders appear.

## Deployment

1. Push the repository to GitHub.
2. Import it in Vercel as a Next.js project.
3. Add the same Supabase env vars in Vercel project settings.
4. Add the Vercel `/auth/callback` URL to Supabase Auth redirect URLs.
5. Deploy.

## Useful Commands

```bash
npm run lint
npm run build
npm run dev
npm run seed:matches
```

## Dev Cache Troubleshooting

If the browser shows `Cannot find module './123.js'` from `.next/server/webpack-runtime.js`, stop the dev server and clear the generated Next cache:

```bash
rm -rf .next
npm run dev -- -p 3001
```

Avoid running `npm run build` while `npm run dev` is still running. Both commands write to `.next`, which can confuse the development server.
