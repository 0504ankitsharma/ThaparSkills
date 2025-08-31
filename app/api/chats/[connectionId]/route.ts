import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabaseClient'
import { getCachedChatMessages, cacheChatMessage } from '@/lib/redisClient'

export async function GET(
  request: NextRequest,
  { params }: { params: { connectionId: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { connectionId } = params
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')

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
      .eq('id', connectionId)
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .single()

    if (connectionError || !connection) {
      return NextResponse.json(
        { error: 'Connection not found' },
        { status: 404 }
      )
    }

    // Try Redis cache first
    try {
      const cachedMessages = await getCachedChatMessages(connectionId, limit)
      if (cachedMessages && cachedMessages.length > 0) {
        return NextResponse.json({
          messages: cachedMessages,
          hasMore: false, // Redis only stores recent messages
        })
      }
    } catch (redisError) {
      console.error('Redis cache read failed:', redisError)
      // Fallback to Supabase
    }

    // Get messages from Supabase
    const { data: messages, error: messagesError } = await supabaseAdmin
      .from('chats')
      .select('*')
      .eq('connection_id', connectionId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (messagesError) {
      console.error('Error fetching messages:', messagesError)
      return NextResponse.json(
        { error: 'Failed to fetch messages' },
        { status: 500 }
      )
    }

    // Reverse to get chronological order
    const orderedMessages = messages.reverse()

    // Update Redis cache
    try {
      if (orderedMessages.length > 0) {
        await cacheChatMessage(connectionId, orderedMessages[orderedMessages.length - 1])
      }
    } catch (redisError) {
      console.error('Redis cache update failed:', redisError)
      // Continue even if Redis fails
    }

    return NextResponse.json({
      messages: orderedMessages,
      hasMore: messages.length === limit,
    })
  } catch (error) {
    console.error('Error in GET /api/chats/[connectionId]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { connectionId: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { connectionId } = params
    const body = await request.json()
    const { message } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
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
      .eq('id', connectionId)
      .eq('status', 'accepted')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .single()

    if (connectionError || !connection) {
      return NextResponse.json(
        { error: 'Connection not found or not accepted' },
        { status: 404 }
      )
    }

    // Create chat message
    const { data: newMessage, error: messageError } = await supabaseAdmin
      .from('chats')
      .insert([
        {
          connection_id: connectionId,
          sender_id: user.id,
          message: message.trim(),
        },
      ])
      .select()
      .single()

    if (messageError) {
      console.error('Error creating message:', messageError)
      return NextResponse.json(
        { error: 'Failed to create message' },
        { status: 500 }
      )
    }

    // Update Redis cache
    try {
      await cacheChatMessage(connectionId, newMessage)
    } catch (redisError) {
      console.error('Redis cache update failed:', redisError)
      // Continue even if Redis fails
    }

    return NextResponse.json(newMessage)
  } catch (error) {
    console.error('Error in POST /api/chats/[connectionId]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
