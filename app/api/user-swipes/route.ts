import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Fetch all swipes for this user
    const { data, error } = await supabase
      .from('swipes')
      .select('content_id')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user swipes:', error);
      return NextResponse.json({ error: 'Failed to fetch swipes' }, { status: 500 });
    }

    return NextResponse.json({ data: data || [] });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
