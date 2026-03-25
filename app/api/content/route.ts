import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { fetchMixedContent } from '@/lib/tmdb';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    
    // Get filter parameters
    const providersParam = searchParams.get('providers');
    const genresParam = searchParams.get('genres');
    
    const providers = providersParam ? providersParam.split(',').map(Number) : undefined;
    const genres = genresParam ? genresParam.split(',').map(Number) : undefined;

    // Try to get from cache first (only if no filters applied)
    if (!providers && !genres) {
      const { data: cachedContent, error: cacheError } = await supabase
        .from('content_cache')
        .select('*')
        .order('popularity', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (!cacheError && cachedContent && cachedContent.length > 0) {
        return NextResponse.json({ content: cachedContent, cached: true });
      }
    }

    // Fetch from TMDB with filters
    const content = await fetchMixedContent(10, providers, genres);

    // Cache the content (only if no filters)
    if (content.length > 0 && !providers && !genres) {
      const contentToCache = content.map(item => ({
        id: item.id,
        title: item.title,
        overview: item.overview,
        poster_path: item.poster_path,
        rating: item.rating,
        popularity: item.popularity,
        content_type: item.content_type,
        providers: item.providers,
      }));

      await supabase
        .from('content_cache')
        .upsert(contentToCache, { onConflict: 'id' });
    }

    const paginatedContent = content.slice((page - 1) * limit, page * limit);

    return NextResponse.json({ content: paginatedContent, cached: false });
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}
