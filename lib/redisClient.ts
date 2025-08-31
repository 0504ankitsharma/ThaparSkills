import { createClient } from 'redis'

let redis: ReturnType<typeof createClient> | null = null

export async function getRedisClient() {
  if (!redis) {
    redis = createClient({
      url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    })

    redis.on('error', (err) => console.error('Redis Client Error', err))
    
    await redis.connect()
  }
  
  return redis
}

export async function closeRedisConnection() {
  if (redis) {
    await redis.quit()
    redis = null
  }
}

// Redis key patterns
export const REDIS_KEYS = {
  FEED_RECENT: 'feed:recent',
  CHAT_MESSAGES: (connectionId: string) => `chat:${connectionId}`,
  ONLINE_USER: (userId: string) => `online:${userId}`,
} as const

// Cache helpers
export async function cacheSkillFeed(skills: any[]) {
  try {
    const client = await getRedisClient()
    
    // Clear existing feed cache
    await client.del(REDIS_KEYS.FEED_RECENT)
    
    // Add skills to cache (keep last 200)
    for (const skill of skills) {
      await client.lPush(REDIS_KEYS.FEED_RECENT, JSON.stringify(skill))
    }
    
    // Trim to keep only last 200 items
    await client.lTrim(REDIS_KEYS.FEED_RECENT, 0, 199)
  } catch (error) {
    console.error('Redis cache update failed:', error)
  }
}

export async function getCachedSkillFeed(limit: number = 20) {
  try {
    const client = await getRedisClient()
    const cached = await client.lRange(REDIS_KEYS.FEED_RECENT, 0, limit - 1)
    
    if (cached && cached.length > 0) {
      return cached.map(item => JSON.parse(item))
    }
    
    return null
  } catch (error) {
    console.error('Redis cache read failed:', error)
    return null
  }
}

export async function cacheChatMessage(connectionId: string, message: any) {
  try {
    const client = await getRedisClient()
    const key = REDIS_KEYS.CHAT_MESSAGES(connectionId)
    
    await client.lPush(key, JSON.stringify(message))
    await client.lTrim(key, 0, 49) // Keep only last 50 messages
    await client.expire(key, 86400) // Expire after 24 hours
  } catch (error) {
    console.error('Redis chat cache update failed:', error)
  }
}

export async function getCachedChatMessages(connectionId: string, limit: number = 50) {
  try {
    const client = await getRedisClient()
    const key = REDIS_KEYS.CHAT_MESSAGES(connectionId)
    
    const cached = await client.lRange(key, 0, limit - 1)
    
    if (cached && cached.length > 0) {
      return cached.map(item => JSON.parse(item)).reverse() // Reverse to get chronological order
    }
    
    return null
  } catch (error) {
    console.error('Redis chat cache read failed:', error)
    return null
  }
}
