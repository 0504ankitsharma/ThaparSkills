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
    const { receiver_id } = body

    if (!receiver_id) {
      return NextResponse.json(
        { error: 'Receiver ID is required' },
        { status: 400 }
      )
    }

    // Get sender user ID from clerk_id
    const { data: senderUser, error: senderError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single()

    if (senderError || !senderUser) {
      return NextResponse.json(
        { error: 'Sender profile not found' },
        { status: 404 }
      )
    }

    // Check if connection already exists
    const { data: existingConnection } = await supabaseAdmin
      .from('connections')
      .select('*')
      .or(`and(sender_id.eq.${senderUser.id},receiver_id.eq.${receiver_id}),and(sender_id.eq.${receiver_id},receiver_id.eq.${senderUser.id})`)
      .single()

    if (existingConnection) {
      return NextResponse.json(
        { error: 'Connection already exists' },
        { status: 409 }
      )
    }

    // Create connection request
    const { data: newConnection, error } = await supabaseAdmin
      .from('connections')
      .insert([
        {
          sender_id: senderUser.id,
          receiver_id,
          status: 'pending',
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating connection:', error)
      return NextResponse.json(
        { error: 'Failed to create connection request' },
        { status: 500 }
      )
    }

    return NextResponse.json(newConnection)
  } catch (error) {
    console.error('Error in POST /api/connections:', error)
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
    const status = searchParams.get('status') || 'all'

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

    // Build query based on status
    let query = supabaseAdmin
      .from('connections')
      .select(`
        *,
        sender:users!connections_sender_id_fkey(name, profile_pic, roll_number, department),
        receiver:users!connections_receiver_id_fkey(name, profile_pic, roll_number, department)
      `)
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)

    if (status !== 'all') {
      query = query.eq('status', status)
    }

    const { data: connections, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching connections:', error)
      return NextResponse.json(
        { error: 'Failed to fetch connections' },
        { status: 500 }
      )
    }

    // Format connections with user info
    const formattedConnections = connections.map(connection => {
      const isSender = connection.sender_id === user.id
      const otherUser = isSender ? connection.receiver : connection.sender
      
      return {
        ...connection,
        other_user: otherUser,
        is_sender: isSender,
      }
    })

    return NextResponse.json(formattedConnections)
  } catch (error) {
    console.error('Error in GET /api/connections:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
