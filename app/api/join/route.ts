import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, name, roomId } = await request.json();

    if (!email || !name || !roomId) {
      return NextResponse.json({ error: 'Email, name and room ID are required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Check if room exists
    const { data: room } = await supabase
      .from('rooms')
      .select('id')
      .eq('id', roomId)
      .single();

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    // Check if user exists by email
    let userId: string;
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, name')
      .eq('email', email)
      .single();

    if (existingUser) {
      // User exists, use their ID
      userId = existingUser.id;
      
      // Update name if it changed
      if (existingUser.name !== name) {
        await supabase
          .from('users')
          .update({ name, updated_at: new Date().toISOString() })
          .eq('id', userId);
      }
    } else {
      // Create new user
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({ email, name })
        .select()
        .single();

      if (createError || !newUser) {
        console.error('Error creating user:', createError);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
      }

      userId = newUser.id;
    }

    // Add user to room (if not already a member)
    const { error: memberError } = await supabase
      .from('room_members')
      .upsert(
        { user_id: userId, room_id: roomId },
        { onConflict: 'user_id,room_id' }
      );

    if (memberError) {
      console.error('Error adding user to room:', memberError);
      return NextResponse.json({ error: 'Failed to join room' }, { status: 500 });
    }

    return NextResponse.json({ 
      userId,
      roomId,
      name,
      email,
      isReturningUser: !!existingUser
    });
  } catch (error) {
    console.error('Error joining room:', error);
    return NextResponse.json({ error: 'Failed to join room' }, { status: 500 });
  }
}
