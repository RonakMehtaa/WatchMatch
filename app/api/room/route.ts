import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST() {
  try {
    // Generate a random 6-character room ID
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();

    const { data, error } = await supabase
      .from('rooms')
      .insert({ id: roomId })
      .select()
      .single();

    if (error) {
      console.error('Error creating room:', error);
      return NextResponse.json({ error: 'Failed to create room' }, { status: 500 });
    }

    return NextResponse.json({ roomId: data.id });
  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json({ error: 'Failed to create room' }, { status: 500 });
  }
}
