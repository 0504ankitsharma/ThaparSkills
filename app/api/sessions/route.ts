import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabaseClient'

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { connection_id, date, time, place, session_count } = body

    // Validate required fields
    if (!connection_id || !date || !time) {
      return NextResponse.json(
        { error: 'Connection ID, date, and time are required' },
        { status: 400 }
      )
    }

    // Get user ID from clerk_id
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    // Verify connection exists, user is participant, and connection is accepted
    const { data: connection, error: connectionError } = await supabaseAdmin
      .from('connections')
      .select('*')
      .eq('id', connection_id)
      .eq('status', 'accepted')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .single()

    if (connectionError || !connection) {
      return NextResponse.json(
        { error: 'Connection not found or not accepted' },
        { status: 404 }
      )
    }

    // Validate date is in the future
    const sessionDate = new Date(`${date}T${time}`)
    if (sessionDate <= new Date()) {
      return NextResponse.json(
        { error: 'Session must be scheduled for a future date and time' },
        { status: 400 }
      )
    }

    // Create session
    const { data: newSession, error: sessionError } = await supabaseAdmin
      .from('sessions')
      .insert([
        {
          connection_id,
          date,
          time,
          place: place || null,
          session_count: session_count || 1,
        },
      ])
      .select()
      .single()

    if (sessionError) {
      console.error('Error creating session:', sessionError)
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: 500 }
      )
    }

    return NextResponse.json(newSession)
  } catch (error) {
    console.error('Error in POST /api/sessions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const connection_id = searchParams.get('connection_id')

    if (!connection_id) {
      return NextResponse.json(
        { error: 'Connection ID is required' },
        { status: 400 }
      )
    }

    // Get user ID from clerk_id
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    // Verify connection exists and user is participant
    const { data: connection, error: connectionError } = await supabaseAdmin
      .from('connections')
      .select('*')
      .eq('id', connection_id)
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .single()

    if (connectionError || !connection) {
      return NextResponse.json(
        { error: 'Connection not found' },
        { status: 404 }
      )
    }

    // Get sessions for the connection
    const { data: sessions, error: sessionsError } = await supabaseAdmin
      .from('sessions')
      .select('*')
      .eq('connection_id', connection_id)
      .order('date', { ascending: true })
      .order('time', { ascending: true })

    if (sessionsError) {
      console.error('Error fetching sessions:', sessionsError)
      return NextResponse.json(
        { error: 'Failed to fetch sessions' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      sessions: sessions || [],
    })
  } catch (error) {
    console.error('Error in GET /api/sessions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
