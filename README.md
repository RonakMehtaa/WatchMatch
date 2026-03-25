# WatchMatch 🎬

A cinematic movie and TV show matching app. Swipe on content and compare your picks with friends to find what to watch together.

![WatchMatch](https://img.shields.io/badge/Next.js-16-black) ![Tailwind](https://img.shields.io/badge/Tailwind-4-blue) ![Framer Motion](https://img.shields.io/badge/Framer%20Motion-12-pink)

## Features

- 🎬 Swipe on movies and TV shows
- 🎯 Filter by streaming services and genres
- ✨ Compare matches with friends
- 🎨 Premium Netflix-inspired UI
- 📱 Fully responsive design

## Tech Stack

- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Database**: Supabase
- **API**: TMDB (The Movie Database)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- TMDB API key ([Get it here](https://www.themoviedb.org/settings/api))
- Supabase account ([Create one here](https://supabase.com))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/watchmatch.git
cd watchmatch
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Then edit `.env.local` with your credentials:
- `NEXT_PUBLIC_TMDB_API_KEY`: Your TMDB API key
- `TMDB_API_KEY`: Same as above (for server-side requests)
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon/public key

4. Set up the database:

Run the SQL script in your Supabase SQL Editor:
```bash
# Copy contents of supabase-schema.sql and run in Supabase dashboard
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/watchmatch)

1. Click the button above or go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Add environment variables:
   - `NEXT_PUBLIC_TMDB_API_KEY`
   - `TMDB_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

## Project Structure

```
watchmatch/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── compare/           # Compare page
│   ├── swipe/             # Swipe page
│   └── page.tsx           # Home/login page
├── components/            # React components
├── lib/                   # Utilities and configurations
└── public/                # Static assets
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_TMDB_API_KEY` | TMDB API key for client-side | Yes |
| `TMDB_API_KEY` | TMDB API key for server-side | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
