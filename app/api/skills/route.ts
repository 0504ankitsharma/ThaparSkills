import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabaseClient'
import { getCachedSkillFeed, cacheSkillFeed } from '@/lib/redisClient'

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { skill_name, description, image_url } = body

    // Validate required fields
    if (!skill_name || !description) {
      return NextResponse.json(
        { error: 'Skill name and description are required' },
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

    // Create skill post
    const { data: newSkill, error } = await supabaseAdmin
      .from('skills')
      .insert([
        {
          user_id: user.id,
          skill_name,
          description,
          image_url: image_url || null,
        },
      ])
      .select(`
        *,
        users!inner(name, profile_pic, roll_number)
      `)
      .single()

    if (error) {
      console.error('Error creating skill:', error)
      return NextResponse.json(
        { error: 'Failed to create skill post' },
        { status: 500 }
      )
    }

    // Update Redis cache
    try {
      const skillWithUserData = {
        ...newSkill,
        user_name: newSkill.users.name,
        user_pic: newSkill.users.profile_pic,
        roll_number: newSkill.users.roll_number,
      }
      
      // Get current cached feed and add new skill
      const cachedFeed = await getCachedSkillFeed(200) || []
      const updatedFeed = [skillWithUserData, ...cachedFeed]
      await cacheSkillFeed(updatedFeed)
    } catch (redisError) {
      console.error('Redis cache update failed:', redisError)
      // Continue even if Redis fails
    }

    return NextResponse.json(newSkill)
  } catch (error) {
    console.error('Error in POST /api/skills:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cursor = searchParams.get('cursor')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search')
    const department = searchParams.get('department')

    // Try Redis cache first
    try {
      const cachedFeed = await getCachedSkillFeed(limit)
      if (cachedFeed && cachedFeed.length > 0) {
        // Apply filters to cached data
        let filteredFeed = cachedFeed
        
        if (search) {
          filteredFeed = cachedFeed.filter(skill =>
            skill.skill_name.toLowerCase().includes(search.toLowerCase()) ||
            skill.description?.toLowerCase().includes(search.toLowerCase())
          )
        }
        
        if (department && department !== 'All Departments') {
          filteredFeed = filteredFeed.filter(skill =>
            skill.users?.department === department
          )
        }

        if (filteredFeed.length > 0) {
          return NextResponse.json({
            skills: filteredFeed.slice(0, limit),
            hasMore: filteredFeed.length > limit,
            nextCursor: filteredFeed[limit]?.id || null,
          })
        }
      }
    } catch (redisError) {
      console.error('Redis cache read failed:', redisError)
      // Fallback to Supabase
    }

    // Build Supabase query
    let query = supabaseAdmin
      .from('skill_feed')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit + 1) // Get one extra to check if there are more

    if (cursor) {
      query = query.lt('created_at', cursor)
    }

    if (search) {
      query = query.or(`skill_name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (department && department !== 'All Departments') {
      query = query.eq('department', department)
    }

    const { data: skills, error } = await query

    if (error) {
      console.error('Error fetching skills:', error)
      return NextResponse.json(
        { error: 'Failed to fetch skills' },
        { status: 500 }
      )
    }

    // Check if there are more skills
    const hasMore = skills.length > limit
    const skillsToReturn = hasMore ? skills.slice(0, limit) : skills
    const nextCursor = hasMore ? skills[limit - 1]?.created_at : null

    // Update Redis cache
    try {
      if (!cursor && !search && !department) {
        // Only cache the main feed, not filtered results
        await cacheSkillFeed(skills)
      }
    } catch (redisError) {
      console.error('Redis cache update failed:', redisError)
      // Continue even if Redis fails
    }

    return NextResponse.json({
      skills: skillsToReturn,
      hasMore,
      nextCursor,
    })
  } catch (error) {
    console.error('Error in GET /api/skills:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
