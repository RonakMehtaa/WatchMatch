import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email1 = searchParams.get('email1');
    const email2 = searchParams.get('email2');

    if (!email1 || !email2) {
      return NextResponse.json({ error: 'Both email addresses are required' }, { status: 400 });
    }

    // Get both users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, name')
      .in('email', [email1, email2]);

    if (usersError || !users || users.length !== 2) {
      return NextResponse.json({ error: 'One or both users not found' }, { status: 404 });
    }

    const userIds = users.map(u => u.id);

    // Get all liked content by both users
    const { data: swipes, error: swipesError } = await supabase
      .from('swipes')
      .select('content_id, user_id')
      .in('user_id', userIds)
      .eq('liked', true);

    if (swipesError || !swipes) {
      return NextResponse.json({ matches: [], users });
    }

    // Find content liked by BOTH users
    const contentCounts = swipes.reduce((acc: any, swipe: any) => {
      acc[swipe.content_id] = (acc[swipe.content_id] || new Set()).add(swipe.user_id);
      return acc;
    }, {} as Record<number, Set<string>>);

    const matchedContentIds = Object.entries(contentCounts)
      .filter(([_, userSet]) => (userSet as Set<string>).size === 2)
      .map(([contentId]) => parseInt(contentId));

    if (matchedContentIds.length === 0) {
      return NextResponse.json({ matches: [], users });
    }

    // Get content details from cache
    const { data: matches, error: matchesError } = await supabase
      .from('content_cache')
      .select('*')
      .in('id', matchedContentIds)
      .order('rating', { ascending: false })
      .order('popularity', { ascending: false });

    if (matchesError) {
      console.error('Error fetching matches:', matchesError);
      return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 });
    }

    return NextResponse.json({ matches: matches || [], users });
  } catch (error) {
    console.error('Error comparing users:', error);
    return NextResponse.json({ error: 'Failed to compare users' }, { status: 500 });
  }
}
