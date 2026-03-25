const TMDB_API_KEY = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export interface TMDBContent {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  popularity: number;
  media_type?: string;
  release_date?: string;
  first_air_date?: string;
}

export interface ContentItem {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  rating: number;
  popularity: number;
  content_type: 'movie' | 'tv';
  providers: string[];
}

export const PROVIDER_IDS = {
  Netflix: 8,
  'Amazon Prime Video': 9,
  'Disney Plus': 337,
  'HBO Max': 384,
  'Apple TV Plus': 350,
  'Hulu': 15,
  'Paramount Plus': 531,
  'Peacock': 386,
} as const;

export const GENRE_IDS = {
  // Movies
  Action: 28,
  Adventure: 12,
  Animation: 16,
  Comedy: 35,
  Crime: 80,
  Documentary: 99,
  Drama: 18,
  Family: 10751,
  Fantasy: 14,
  History: 36,
  Horror: 27,
  Music: 10402,
  Mystery: 9648,
  Romance: 10749,
  'Science Fiction': 878,
  'TV Movie': 10770,
  Thriller: 53,
  War: 10752,
  Western: 37,
} as const;

export async function fetchTMDBContent(
  type: 'movie' | 'tv' = 'movie',
  page: number = 1,
  providers?: number[],
  genres?: number[]
): Promise<ContentItem[]> {
  try {
    // Build query parameters
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY!,
      language: 'en-US',
      region: 'CA',
      page: page.toString(),
      sort_by: 'popularity.desc',
      watch_region: 'CA',
    });

    if (providers && providers.length > 0) {
      params.append('with_watch_providers', providers.join('|'));
    }

    if (genres && genres.length > 0) {
      params.append('with_genres', genres.join(','));
    }

    const response = await fetch(
      `${TMDB_BASE_URL}/discover/${type}?${params.toString()}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from TMDB');
    }

    const data = await response.json();
    
    return data.results.map((item: TMDBContent) => ({
      id: item.id,
      title: type === 'movie' ? item.title : item.name,
      overview: item.overview,
      poster_path: item.poster_path,
      rating: Math.round(item.vote_average * 10) / 10,
      popularity: item.popularity,
      content_type: type,
      providers: [],
    }));
  } catch (error) {
    console.error('Error fetching TMDB content:', error);
    return [];
  }
}

export async function fetchMixedContent(
  pages: number = 10,
  providers?: number[],
  genres?: number[]
): Promise<ContentItem[]> {
  const content: ContentItem[] = [];
  const seenIds = new Set<number>();
  
  // Fetch both movies and TV shows
  for (let page = 1; page <= pages; page++) {
    const [movies, tvShows] = await Promise.all([
      fetchTMDBContent('movie', page, providers, genres),
      fetchTMDBContent('tv', page, providers, genres),
    ]);
    
    // Filter out duplicates
    [...movies, ...tvShows].forEach(item => {
      if (!seenIds.has(item.id)) {
        seenIds.add(item.id);
        content.push(item);
      }
    });
  }
  
  // Sort by popularity instead of random shuffle
  return content.sort((a, b) => b.popularity - a.popularity);
}

export function getPosterUrl(path: string, size: 'w342' | 'w500' | 'original' = 'w500'): string {
  if (!path) return '/placeholder-poster.jpg';
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getBackdropUrl(path: string, size: 'w780' | 'w1280' | 'original' = 'w1280'): string {
  if (!path) return '/placeholder-backdrop.jpg';
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}
