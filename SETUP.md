# WatchMatch - Setup Guide

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] Supabase account created
- [ ] TMDB API key obtained
- [ ] Environment variables configured

## Step-by-Step Setup

### 1. Supabase Setup (5 minutes)

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in project details:
   - Name: `watchmatch`
   - Database Password: (save this securely)
   - Region: Choose closest to you
4. Wait for project to initialize (~2 minutes)
5. Go to **SQL Editor** in left sidebar
6. Click "New Query"
7. Copy the entire contents of `supabase-schema.sql` file
8. Paste into the editor and click "Run"
9. You should see "Success. No rows returned"

### 2. Get Supabase Credentials

1. In your Supabase project, go to **Project Settings** (gear icon)
2. Click **API** in the left menu
3. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (under "Project API keys")

### 3. Get TMDB API Key

1. Go to [themoviedb.org](https://www.themoviedb.org)
2. Create an account (free)
3. Go to Settings → API
4. Click "Request an API Key"
5. Choose "Developer"
6. Fill in the application form (can be brief)
7. Accept terms and submit
8. Copy your **API Key (v3 auth)**

### 4. Configure Environment Variables

Create `.env.local` in the root folder with:

```bash
# TMDB API
NEXT_PUBLIC_TMDB_API_KEY=your_actual_tmdb_key_here
TMDB_API_KEY=your_actual_tmdb_key_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key_here
```

**Replace** the placeholder values with your actual keys!

### 5. Install and Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Testing the App

1. Open the app in two different browsers (or incognito)
2. In Browser 1: Enter name "Alice" → Create New Room
3. Copy the room code (e.g., "ABC123")
4. In Browser 2: Enter name "Bob" → Join with code "ABC123"
5. Both users swipe right on the same movies
6. Click "See Your Matches" to see shared likes!

## Deployment to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in project settings
5. Deploy!

## Common Issues

### Database Tables Not Created
- Make sure you ran the entire SQL schema
- Check SQL Editor for errors
- Verify you're in the correct project

### API Keys Not Working
- Check for typos in `.env.local`
- Make sure there are no spaces around the `=` sign
- Restart dev server after changing env vars

### Images Not Loading
- TMDB API has rate limits (check console)
- Verify API key is valid
- Check internet connection

## Need Help?

- TMDB API Docs: https://developers.themoviedb.org/3
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs

---

Happy swiping! 🎬✨
