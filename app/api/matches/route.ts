import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const roomId = searchParams.get('roomId');

    if (!userId || !roomId) {
      return NextResponse.json({ error: 'User ID and Room ID are required' }, { status: 400 });
    }

    // Get all users in the room
    const { data: roomMembers, error: roomMembersError } = await supabase
      .from('room_members')
      .select('user_id')
      .eq('room_id', roomId);

    if (roomMembersError || !roomMembers || roomMembers.length < 2) {
      return NextResponse.json({ matches: [] });
    }

    const userIds = roomMembers.map((m: any) => m.user_id);

    // Get all liked content by all users in the room
    const { data: likedSwipes, error: swipesError } = await supabase
      .from('swipes')
      .select('content_id, user_id')
      .in('user_id', userIds)
      .eq('liked', true);

    if (swipesError || !likedSwipes) {
      return NextResponse.json({ matches: [] });
    }

    // Find content liked by all users
    const contentCounts = likedSwipes.reduce((acc: any, swipe: any) => {
      acc[swipe.content_id] = (acc[swipe.content_id] || new Set()).add(swipe.user_id);
      return acc;
    }, {} as Record<number, Set<string>>);

    const matchedContentIds = Object.entries(contentCounts)
      .filter(([_, users]) => (users as Set<string>).size === userIds.length)
      .map(([contentId]) => parseInt(contentId));

    if (matchedContentIds.length === 0) {
      return NextResponse.json({ matches: [] });
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

    return NextResponse.json({ matches: matches || [] });
  } catch (error) {
    console.error('Error getting matches:', error);
    return NextResponse.json({ error: 'Failed to get matches' }, { status: 500 });
  }
}
