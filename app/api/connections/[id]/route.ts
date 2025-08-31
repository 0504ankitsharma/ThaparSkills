import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabaseClient'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()
    const { status } = body

    if (!status || !['accepted', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Valid status (accepted/rejected) is required' },
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

    // Get connection and verify user can update it
    const { data: connection, error: connectionError } = await supabaseAdmin
      .from('connections')
      .select('*')
      .eq('id', id)
      .single()

    if (connectionError || !connection) {
      return NextResponse.json(
        { error: 'Connection not found' },
        { status: 404 }
      )
    }

    // Only receiver can accept/reject, sender can cancel
    const canUpdate = 
      (status === 'accepted' || status === 'rejected') && connection.receiver_id === user.id ||
      (status === 'rejected') && connection.sender_id === user.id

    if (!canUpdate) {
      return NextResponse.json(
        { error: 'Not authorized to update this connection' },
        { status: 403 }
      )
    }

    // Update connection status
    const { data: updatedConnection, error: updateError } = await supabaseAdmin
      .from('connections')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating connection:', updateError)
      return NextResponse.json(
        { error: 'Failed to update connection' },
        { status: 500 }
      )
    }

    return NextResponse.json(updatedConnection)
  } catch (error) {
    console.error('Error in PUT /api/connections/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
