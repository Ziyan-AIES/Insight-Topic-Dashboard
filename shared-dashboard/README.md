# Team-Synced Monthly Insights Dashboard (No Git Sync Needed)

This is a lightweight web dashboard your team can edit directly in the browser, with shared real-time data backed by Supabase.

## What you get

- One shared dashboard link for everyone
- Edit topics directly on the dashboard UI
- Near real-time sync (others see updates quickly)
- Free-tier friendly setup

## 1) Create Supabase project (free)

1. Create a project at [Supabase](https://supabase.com/).
2. Open SQL Editor.
3. Run `supabase.sql`.
4. (Optional) Run `seed.sql`.
5. In Project Settings -> API, copy:
   - Project URL
   - anon public key

## 2) Configure dashboard

Open `app.js` and fill:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

## 3) Publish as a shared link

Any static hosting works:

- Netlify Drop (drag `index.html`, `styles.css`, `app.js`)
- Vercel static
- GitHub Pages

After publish, share the URL with teammates.

## 4) Suggested secure setup (after MVP)

This starter uses simple open access for speed. After your MVP:

- enable RLS
- add Supabase Auth (magic link)
- restrict write policy to your team domain

## Files

- `index.html` - dashboard UI shell
- `styles.css` - purple/blue visual style
- `app.js` - realtime load/edit/save logic
- `supabase.sql` - table and realtime setup
- `seed.sql` - starter records from your current monthly topics
