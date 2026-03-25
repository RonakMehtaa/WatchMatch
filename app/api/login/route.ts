import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    if (!email || !name) {
      return NextResponse.json({ error: 'Email and name are required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
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
      
      return NextResponse.json({ 
        userId,
        name,
        email,
        isReturningUser: true
      });
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

      return NextResponse.json({ 
        userId: newUser.id,
        name: newUser.name,
        email: newUser.email,
        isReturningUser: false
      });
    }
  } catch (error) {
    console.error('Error in login:', error);
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 });
  }
}
