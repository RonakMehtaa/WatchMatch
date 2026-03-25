import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { userId, contentId, liked } = await request.json();

    if (!userId || contentId === undefined || liked === undefined) {
      return NextResponse.json(
        { error: 'User ID, content ID, and liked status are required' },
        { status: 400 }
      );
    }

    // Check if swipe already exists
    const { data: existingSwipe } = await supabase
      .from('swipes')
      .select('id')
      .eq('user_id', userId)
      .eq('content_id', contentId)
      .single();

    if (existingSwipe) {
      // Update existing swipe
      const { error } = await supabase
        .from('swipes')
        .update({ liked })
        .eq('id', existingSwipe.id);

      if (error) {
        console.error('Error updating swipe:', error);
        return NextResponse.json({ error: 'Failed to update swipe' }, { status: 500 });
      }

      return NextResponse.json({ success: true, updated: true });
    }

    // Create new swipe
    const { error } = await supabase
      .from('swipes')
      .insert({ user_id: userId, content_id: contentId, liked });

    if (error) {
      console.error('Error creating swipe:', error);
      return NextResponse.json({ error: 'Failed to create swipe' }, { status: 500 });
    }

    return NextResponse.json({ success: true, updated: false });
  } catch (error) {
    console.error('Error processing swipe:', error);
    return NextResponse.json({ error: 'Failed to process swipe' }, { status: 500 });
  }
}
