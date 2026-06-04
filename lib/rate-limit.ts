import { createRedisConnection } from "./bullmq/connection";

const memoryCache = new Map<string, { count: number; resetTime: number }>();

/**
 * Rate limit requests by IP address.
 * Defaults to 5 requests per 60 seconds.
 */
export async function rateLimit(ip: string, limit = 5, duration = 60): Promise<{ success: boolean }> {
  try {
    const redis = createRedisConnection();
    // Test connection
    await redis.connect();
    
    const key = `rate-limit:register:${ip}`;
    const current = await redis.get(key);
    
    if (current && parseInt(current, 10) >= limit) {
      await redis.quit();
      return { success: false };
    }
    
    const tx = redis.multi();
    tx.incr(key);
    tx.expire(key, duration);
    await tx.exec();
    await redis.quit();
    
    return { success: true };
  } catch (error) {
    // Fallback to in-memory rate limiting
    const now = Date.now();
    const key = ip;
    const record = memoryCache.get(key);
    
    if (!record || now > record.resetTime) {
      memoryCache.set(key, {
        count: 1,
        resetTime: now + duration * 1000,
      });
      return { success: true };
    }
    
    if (record.count >= limit) {
      return { success: false };
    }
    
    record.count += 1;
    return { success: true };
  }
}
